import React, { useEffect, useRef, useState } from "react";
import useOrderBook from "../hooks/useOrderBook";
import useLastPrice from "../hooks/useLastPrice";
import { calculateTotal, formatCurrency } from "../utils/utils";
import { ReactComponent as IconArrowDown } from "../assets/IconArrowDown.svg";
import "../styles/Orderbook.css";

const OrderBook = () => {
	const { bids, asks } = useOrderBook();
	const { price, side } = useLastPrice();
	const [renderBids, setRenderBids] = useState([]);
	const [renderAsks, setRenderAsks] = useState([]);
	const prevBids = useRef(null);
	const prevAsks = useRef(null);

	useEffect(() => {
		setRenderBids(bids.slice(0, 8));
	}, [bids]);

	useEffect(() => {
		setRenderAsks(asks.slice(-8));
	}, [asks]);

	useEffect(() => {
		prevBids.current = renderBids;
		prevAsks.current = renderAsks;
	}, [renderBids, renderAsks]);

	const colorFilter =
		side === "down"
			? { color: "#FF5B5A" }
			: side === "up"
			? { color: "#00b15d" }
			: { color: "#F0F4F8" };

	const bidTotals = calculateTotal(bids, true);
	const askTotals = calculateTotal(asks);

	const renderAskQuotes = () => {
		return renderAsks.map((ask, index) => {
			const totalPercentage =
				(parseInt(askTotals.at(-8 + index)) / parseInt(askTotals[0])) *
				100;

			const isNewPrice = !prevAsks.current.some(
				(subArray) => subArray[0] === ask[0]
			);

			const match = prevAsks.current.find((item) => item[0] === price);
			const sizeChanged =
				!isNewPrice && match ? match[1] !== ask[1] : false;
			const isSizeIncreased =
				match && parseFloat(ask[1]) > parseFloat(match[1]);

			const flashSizeClass = sizeChanged
				? isSizeIncreased
					? "flash-size-up"
					: "flash-size-down"
				: "";

			return (
				<div
					key={index}
					className={`ask-row ${
						isNewPrice ? "flash-red-background" : ""
					}`}
				>
					<span className="ask-price">{formatCurrency(ask[0])}</span>
					<span className={`size ${flashSizeClass}`}>
						{formatCurrency(ask[1])}
					</span>
					<div className="total">
						<div
							className="total-percentage total-percentage--red"
							style={{ width: `${totalPercentage}%` }}
						/>
						<span>{formatCurrency(askTotals.at(-8 + index))}</span>
					</div>
				</div>
			);
		});
	};

	const renderBidQuotes = () => {
		return renderBids.map((bid, index) => {
			const totalPercentage =
				(parseInt(bidTotals[index]) / parseInt(bidTotals[7])) * 100;

			const isNewPrice = !prevBids.current.some(
				(subArray) => subArray[0] === bid[0]
			);

			const match = prevBids.current.find((item) => item[0] === price);
			const sizeChanged =
				!isNewPrice && match ? match[1] !== bid[1] : false;
			const isSizeIncreased =
				match && parseFloat(bid[1]) > parseFloat(match[1]);

			const flashSizeClass = sizeChanged
				? isSizeIncreased
					? "flash-size-up"
					: "flash-size-down"
				: "";

			return (
				<div
					key={index}
					className={`bid-row ${
						isNewPrice ? "flash-green-background" : ""
					}`}
				>
					<span className="bid-price">{formatCurrency(bid[0])}</span>
					<span className={`size ${flashSizeClass}`}>
						{formatCurrency(bid[1])}
					</span>
					<div className="total">
						<div
							className="total-percentage total-percentage--green"
							style={{ width: `${totalPercentage}%` }}
						/>
						<span>{formatCurrency(bidTotals[index])}</span>
					</div>
				</div>
			);
		});
	};

	return (
		<div className="container">
			<div className="header">
				<span>Order Book</span>
			</div>
			<div className="column-head">
				<span className="price">Price (USD)</span>
				<span className="size">Size</span>
				<span className="total">Total</span>
			</div>
			{renderAskQuotes()}
			<div
				className={`current-price ${
					side === "up"
						? "price-up"
						: side === "down"
						? "price-down"
						: ""
				}`}
			>
				<span style={colorFilter}>{formatCurrency(price)}</span>
				{side !== "same" && (
					<IconArrowDown
						fill="none"
						stroke={colorFilter.color}
						transform={side === "up" ? "rotate(180)" : "rotate(0)"}
						alt="arrow"
					/>
				)}
			</div>
			{renderBidQuotes()}
		</div>
	);
};

export default OrderBook;
