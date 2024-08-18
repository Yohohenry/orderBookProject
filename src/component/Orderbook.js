import React from "react";
import useOrderBook from "../hooks/useOrderBook";
import useLastPrice from "../hooks/useLastPrice";
import { ReactComponent as IconArrowDown } from "../assets/IconArrowDown.svg";

const orderBookData = {
	bids: [
		["59252.5", "0.06865"],
		["59249.0", "0.24000"],
		["59235.5", "0.16073"],
		["59235.0", "0.26626"],
		["59233.0", "0.50000"],
	],
	asks: [
		["59292.0", "0.50000"],
		["59285.5", "0.24000"],
		["59285.0", "0.15598"],
		["59278.5", "0.01472"],
	],
};

const tradeHistoryData = {
	symbol: "BTCPFC",
	side: "SELL",
	size: 0.007,
	price: 59254.8,
	tradeId: 118974855,
	timestamp: 1584446020295,
};

const OrderBook = () => {
	const { bids, asks } = useOrderBook();
	const { price, side } = useLastPrice();

	const colorFilter =
		side === "down"
			? { color: "#FF5B5A" }
			: side === "up"
			? { color: "#00b15d" }
			: { color: "#F0F4F8" };

	console.log("pricepriceprice", price);

	const reduceData = (data) => {
		return data.slice(0, 8);
	};

	const calculateTotal = (data, isBid = false) => {
		let total = 0;
		if (isBid) {
			return [...data].map(([price, size]) => {
				total += parseFloat(size);
				return String(total);
			});
		} else
			return [...data]
				.reverse()
				.map(([price, size]) => {
					total += parseFloat(size);
					return String(total);
				})
				.reverse();
	};

	const formatCurrency = (numString) => {
		if (!numString) {
			return "";
		}
		if (!/^\d*\.?\d*$/.test(numString)) {
			return numString;
		}

		const parts = numString.split(".");
		let integerPart = parts[0];
		const decimalPart = parts.length > 1 ? "." + parts[1] : "";

		integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		return integerPart + decimalPart;
	};

	const bidTotals = calculateTotal(reduceData(bids), true);
	const askTotals = calculateTotal(reduceData(asks));

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<span style={{ flex: 1, textAlign: "end" }}>Price (USD)</span>
				<span style={{ flex: 0.8, textAlign: "end" }}>Size</span>
				<span style={{ flex: 1.2, textAlign: "end" }}>Total</span>
			</div>

			{reduceData(asks).map((ask, index) => {
				const totalPercentage =
					(parseInt(askTotals[index]) / parseInt(askTotals[0])) * 100;
				return (
					<div key={index} style={styles.askRow}>
						<span style={styles.askPrice}>
							{formatCurrency(ask[0])}
						</span>
						<span style={styles.size}>
							{formatCurrency(ask[1])}
						</span>
						<span style={styles.total}>
							<div
								style={{
									position: "relative",
									height: 20,
									display: "flex",
									justifyContent: "flex-end",
								}}
							>
								<div
									style={{
										width: `${totalPercentage}%`,
										backgroundColor: "rgba(255, 0, 0, 0.2)",
										position: "absolute",
										right: 0,
										height: "100%",
										zIndex: 1,
									}}
								/>
								<span
									style={{ position: "relative", zIndex: 2 }}
								>
									{formatCurrency(askTotals[index])}
								</span>
							</div>
						</span>
					</div>
				);
			})}

			<div
				style={{
					...styles.currentPrice,
					...(side === "up"
						? styles.priceUp
						: side === "down"
						? styles.priceDown
						: { backgroundColor: "rgba(134, 152, 170, 0.12)" }),
				}}
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

			{reduceData(bids).map((bid, index) => {
				const totalPercentage =
					(parseInt(bidTotals[index]) / parseInt(bidTotals[7])) * 100;
				return (
					<div key={index} style={styles.bidRow}>
						<span style={styles.bidPrice}>
							{formatCurrency(bid[0])}
						</span>
						<span style={styles.size}>
							{formatCurrency(bid[1])}
						</span>
						<span style={styles.total}>
							<div
								style={{
									position: "relative",
									height: 20,
									display: "flex",
									justifyContent: "flex-end",
								}}
							>
								<div
									style={{
										width: `${totalPercentage}%`,
										backgroundColor:
											"rgba(16, 186, 104, 0.12)",
										position: "absolute",
										right: 0,
										height: "100%",
										zIndex: 1,
									}}
								/>
								<span
									style={{ position: "relative", zIndex: 2 }}
								>
									{formatCurrency(bidTotals[index])}
								</span>
							</div>
						</span>
					</div>
				);
			})}
		</div>
	);
};

const styles = {
	container: {
		backgroundColor: "#131B29",
		color: "#F0F4F8",
		padding: "10px",
		borderRadius: "5px",
		width: "320px",
		fontSize: "18px",
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		color: "#8698aa",
		marginBottom: "10px",
	},
	askRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "end",
		backgroundColor: "#131B29",
		padding: "5px 0",
		color: "#FF5B5A",
		cursor: "pointer",
	},
	bidRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "end",
		backgroundColor: "#131B29",
		padding: "5px 0",
		color: "#00b15d",
		cursor: "pointer",
	},
	askPrice: {
		flex: 1,
		color: "#FF5B5A",
	},
	bidPrice: {
		flex: 1,
		color: "#00b15d",
	},
	size: {
		flex: 0.8,
		textAlign: "right",
		color: "white",
	},
	total: {
		alignItems: "end",
		position: "raletive",
		flex: 1.2,
		textAlign: "right",
		color: "white",
	},
	currentPrice: {
		display: "flex",
		justifyContent: "center",
		padding: "10px 0",
		fontWeight: "bold",
		fontSize: "20px",
	},
	priceDown: {
		backgroundColor: "rgba(255, 90, 90, 0.12)",
	},
	priceUp: {
		backgroundColor: "rgba(16, 186, 104, 0.12)",
	},
};

export default OrderBook;
