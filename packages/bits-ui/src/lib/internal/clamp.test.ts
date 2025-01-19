import { describe, expect, it } from "vitest";
import { clamp } from "./clamp.js";

describe("clamp", () => {
	it("should return the number if it is within the range", () => {
		expect(clamp(5, 0, 10)).toBe(5);
		expect(clamp(0, 0, 10)).toBe(0);
		expect(clamp(10, 0, 10)).toBe(10);
	});

	it("should return the minimum value if the number is below the range", () => {
		expect(clamp(-5, 0, 10)).toBe(0);
		expect(clamp(-10, -5, 5)).toBe(-5);
	});

	it("should return the maximum value if the number is above the range", () => {
		expect(clamp(15, 0, 10)).toBe(10);
		expect(clamp(20, -5, 5)).toBe(5);
	});

	it("should handle equal minimum and maximum values", () => {
		expect(clamp(5, 10, 10)).toBe(10);
		expect(clamp(15, 10, 10)).toBe(10);
	});

	it("should handle negative minimum and maximum values", () => {
		expect(clamp(-15, -20, -10)).toBe(-15);
		expect(clamp(-25, -20, -10)).toBe(-20);
		expect(clamp(-5, -20, -10)).toBe(-10);
	});

	it("should handle decimal values", () => {
		expect(clamp(3.5, 1.2, 7.8)).toBe(3.5);
		expect(clamp(0.5, 1.2, 7.8)).toBe(1.2);
		expect(clamp(9.5, 1.2, 7.8)).toBe(7.8);
	});
});
