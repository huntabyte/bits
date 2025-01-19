/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { getDirectionalKeys } from "./get-directional-keys.js";
import { kbd } from "./kbd.js";

describe("getDirectionalKeys", () => {
	it("should return correct keys for default direction and orientation", () => {
		const result = getDirectionalKeys();
		expect(result).toEqual({
			nextKey: kbd.ARROW_RIGHT,
			prevKey: kbd.ARROW_LEFT,
		});
	});

	it("should return correct keys for rtl direction and horizontal orientation", () => {
		const result = getDirectionalKeys("rtl", "horizontal");
		expect(result).toEqual({
			nextKey: kbd.ARROW_LEFT,
			prevKey: kbd.ARROW_RIGHT,
		});
	});

	it("should return correct keys for ltr direction and vertical orientation", () => {
		const result = getDirectionalKeys("ltr", "vertical");
		expect(result).toEqual({
			nextKey: kbd.ARROW_DOWN,
			prevKey: kbd.ARROW_UP,
		});
	});

	it("should return correct keys for rtl direction and vertical orientation", () => {
		const result = getDirectionalKeys("rtl", "vertical");
		expect(result).toEqual({
			nextKey: kbd.ARROW_DOWN,
			prevKey: kbd.ARROW_UP,
		});
	});

	it("should handle invalid direction and orientation values", () => {
		const result1 = getDirectionalKeys("invalid" as any, "horizontal");
		const result2 = getDirectionalKeys("ltr", "invalid" as any);
		expect(result1).toEqual({
			nextKey: kbd.ARROW_RIGHT,
			prevKey: kbd.ARROW_LEFT,
		});
		expect(result2).toEqual({
			nextKey: kbd.ARROW_RIGHT,
			prevKey: kbd.ARROW_LEFT,
		});
	});
});
