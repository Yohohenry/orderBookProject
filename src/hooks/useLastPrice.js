import { useState, useEffect, useRef } from "react";

const useLastPrice = () => {
	const [lastPrice, setLastPrice] = useState({ price: "", side: "" });
	const previousPriceRef = useRef(null);

	useEffect(() => {
		const ws = new WebSocket("wss://ws.btse.com/ws/futures");

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					op: "subscribe",
					args: ["tradeHistoryApi:BTCPFC"],
				})
			);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data && data.data) {
				const { price } = data.data[0];
				const currentPrice = parseFloat(price);

				let side = "same";
				if (previousPriceRef.current !== null) {
					if (currentPrice > previousPriceRef.current) {
						side = "up";
					} else if (currentPrice < previousPriceRef.current) {
						side = "down";
					}
				}

				previousPriceRef.current = currentPrice;
				setLastPrice({
					price: String(price),
					side,
				});
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

	return lastPrice;
};

export default useLastPrice;
