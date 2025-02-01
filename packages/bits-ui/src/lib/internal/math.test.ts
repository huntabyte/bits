import { describe, expect, it } from "vitest";
import { snapValueToStep } from "./math.js";

describe("snapValueToStep", () => {
	it("should snap value to nearest step", () => {
		expect(snapValueToStep(3.7, 0, 10, 1)).toBe(4);
		expect(snapValueToStep(3.2, 0, 10, 1)).toBe(3);
	});

	it("should handle decimal steps", () => {
		expect(snapValueToStep(3.7, 0, 10, 0.5)).toBe(3.5);
		expect(snapValueToStep(3.8, 0, 10, 0.5)).toBe(4);
	});

	it("should respect min value", () => {
		expect(snapValueToStep(1.2, 2, 10, 1)).toBe(2);
	});

	it("should respect max value", () => {
		expect(snapValueToStep(9.8, 0, 9, 1)).toBe(9);
	});

	it("should handle NaN min value", () => {
		expect(snapValueToStep(3.7, Number.NaN, 10, 1)).toBe(4);
	});

	it("should handle NaN max value", () => {
		expect(snapValueToStep(3.7, 0, Number.NaN, 1)).toBe(4);
	});

	it("should handle both NaN min and max values", () => {
		expect(snapValueToStep(3.7, Number.NaN, Number.NaN, 1)).toBe(4);
	});

	it("should handle values outside the range", () => {
		expect(snapValueToStep(12, 0, 10, 1)).toBe(10);
		expect(snapValueToStep(-2, 0, 10, 1)).toBe(0);
	});

	it("should handle large steps", () => {
		expect(snapValueToStep(17, 0, 100, 20)).toBe(20);
	});

	it("should maintain precision for decimal steps", () => {
		expect(snapValueToStep(3.14159, 0, 10, 0.01)).toBe(3.14);
		expect(snapValueToStep(3.14159, 0, 10, 0.001)).toBe(3.142);
	});
});
