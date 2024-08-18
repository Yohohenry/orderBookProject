import { useState, useEffect } from "react";

const useOrderBook = () => {
	const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

	const updateOrderBook = (newBids, newAsks) => {
		setOrderBook((prevOrderBook) => {
			const updatedBids = mergeDelta(prevOrderBook.bids, newBids);
			const updatedAsks = mergeDelta(prevOrderBook.asks, newAsks);
			return {
				bids: updatedBids,
				asks: updatedAsks,
			};
		});
	};

	const mergeDelta = (orderBook, delta) => {
		const updatedOrderBook = [...orderBook];
		delta.forEach(([price, size]) => {
			const index = updatedOrderBook.findIndex(([p]) => p === price);
			if (index !== -1) {
				if (size === "0") {
					updatedOrderBook.splice(index, 1);
				} else {
					updatedOrderBook[index] = [price, size];
				}
			} else if (size !== "0") {
				updatedOrderBook.push([price, size]);
			}
		});
		return updatedOrderBook.sort(
			(a, b) => parseFloat(b[0]) - parseFloat(a[0])
		);
	};

	useEffect(() => {
		let lastSeqNum = null;

		const ws = new WebSocket("wss://ws.btse.com/ws/oss/futures");

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					op: "subscribe",
					args: ["update:BTCPFC_0"],
				})
			);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data && data.data) {
				const { type, seqNum, prevSeqNum, bids, asks } = data.data;

				if (type === "snapshot") {
					lastSeqNum = seqNum;
					setOrderBook({
						bids: bids,
						asks: asks,
					});
				} else if (type === "delta") {
					if (lastSeqNum !== null && prevSeqNum !== lastSeqNum) {
						ws.send(
							JSON.stringify({
								op: "subscribe",
								args: ["update:BTCPFC_0"],
							})
						);
					} else {
						lastSeqNum = seqNum;
						updateOrderBook(bids, asks);
					}
				}
			} else {
				console.warn(
					'Received data is undefined or has no "data" field'
				);
			}
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		ws.onclose = () => {
			console.log("WebSocket connection closed");
		};

		return () => {
			ws.close();
		};
	}, []);

	return orderBook;
};

export default useOrderBook;
