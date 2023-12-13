import React, { useEffect, useState } from "react";

const prefix = "WHATSAPP-clone-";

export default function useLocalStorage(key, initialValue) {
	const prefixedKey = prefix + key;

	const [value, setValue] = useState(() => {
		const jsonValue = localStorage.getItem(prefixedKey);
		console.log("json value :- ", jsonValue);
		if (jsonValue) return JSON.parse(jsonValue);

		if (typeof initialValue === "function") {
			return initialValue();
		} else {
			return initialValue;
		}
	});

	useEffect(() => {
		localStorage.setItem(prefixedKey, JSON.stringify(value));
	}, [prefixedKey, value]);

	return [value, setValue];
}
