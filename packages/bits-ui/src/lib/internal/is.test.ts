import { describe, expect, it } from "vitest";
import { isNumberString } from "./is.js";

describe("isNumberString", () => {
	it("should return true for valid number strings", () => {
		expect(isNumberString("123")).toBe(true);
		expect(isNumberString("0")).toBe(true);
		expect(isNumberString("-42")).toBe(true);
		expect(isNumberString("3.14")).toBe(true);
	});

	it("should return false for strings that are not valid numbers", () => {
		expect(isNumberString("abc")).toBe(false);
		expect(isNumberString("1a2b3c")).toBe(false);
		expect(isNumberString("number")).toBe(false);
		expect(isNumberString("--123")).toBe(false);
	});

	it("should return false for empty string", () => {
		expect(isNumberString("")).toBe(false);
	});

	it("should return true for strings with leading or trailing whitespace", () => {
		expect(isNumberString("  123")).toBe(true);
		expect(isNumberString("456  ")).toBe(true);
		expect(isNumberString(" 789 ")).toBe(true);
	});

	it("should return false for strings with non-numeric characters and whitespace", () => {
		expect(isNumberString("  abc123")).toBe(false);
		expect(isNumberString("123def  ")).toBe(false);
		expect(isNumberString(" 456 xyz ")).toBe(false);
	});

	it("should return true for strings with exponential notation", () => {
		expect(isNumberString("1e3")).toBe(true);
		expect(isNumberString("2.5e-4")).toBe(true);
		expect(isNumberString("-3.2E+5")).toBe(true);
	});
});
