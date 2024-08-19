export const formatCurrency = (numString) => {
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

export const calculateTotal = (data, isBid = false) => {
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
