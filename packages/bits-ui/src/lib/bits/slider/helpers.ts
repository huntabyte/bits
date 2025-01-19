import type { StyleProperties } from "$lib/shared/index.js";

export function getRangeStyles(direction: "lr" | "rl" | "tb" | "bt", min: number, max: number) {
	const styles: StyleProperties = {
		position: "absolute",
	};
	if (direction === "lr") {
		styles.left = `${min}%`;
		styles.right = `${max}%`;
	} else if (direction === "rl") {
		styles.right = `${min}%`;
		styles.left = `${max}%`;
	} else if (direction === "bt") {
		styles.bottom = `${min}%`;
		styles.top = `${max}%`;
	} else {
		styles.top = `${min}%`;
		styles.bottom = `${max}%`;
	}
	return styles;
}

export function getThumbStyles(direction: "lr" | "rl" | "tb" | "bt", thumbPos: number) {
	const styles: StyleProperties = {
		position: "absolute",
	};
	if (direction === "lr") {
		styles.left = `${thumbPos}%`;
		styles.translate = "-50% 0";
	} else if (direction === "rl") {
		styles.right = `${thumbPos}%`;
		styles.translate = "50% 0";
	} else if (direction === "bt") {
		styles.bottom = `${thumbPos}%`;
		styles.translate = "0 50%";
	} else {
		styles.top = `${thumbPos}%`;
		styles.translate = "0 -50%";
	}
	return styles;
}

export function getTickStyles(
	direction: "lr" | "rl" | "tb" | "bt",
	tickPosition: number,
	offsetPercentage: number
) {
	const style: StyleProperties = {
		position: "absolute",
	};

	if (direction === "lr") {
		style.left = `${tickPosition}%`;
		style.translate = `${offsetPercentage}% 0`;
	} else if (direction === "rl") {
		style.right = `${tickPosition}%`;
		style.translate = `${-offsetPercentage}% 0`;
	} else if (direction === "bt") {
		style.bottom = `${tickPosition}%`;
		style.translate = `0 ${-offsetPercentage}%`;
	} else {
		style.top = `${tickPosition}%`;
		style.translate = `0 ${offsetPercentage}%`;
	}

	return style;
}
