import { describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce.js";

describe("debounce", () => {
	it("should execute the function after the specified wait time", async () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn();
		expect(mockFn).not.toHaveBeenCalled();

		await new Promise((resolve) => setTimeout(resolve, 200));
		expect(mockFn).toHaveBeenCalledOnce();
	});

	it("should debounce multiple calls within the wait time", async () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn();
		debouncedFn();
		debouncedFn();

		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(mockFn).not.toHaveBeenCalled();

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(mockFn).toHaveBeenCalledOnce();
	});

	it("should handle arguments correctly", async () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn(1, "hello", true);

		await new Promise((resolve) => setTimeout(resolve, 200));
		expect(mockFn).toHaveBeenCalledWith(1, "hello", true);
	});

	it("should reset the timer on subsequent calls", async () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn();
		await new Promise((resolve) => setTimeout(resolve, 50));
		debouncedFn();

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(mockFn).toHaveBeenCalledTimes(1);

		debouncedFn();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(mockFn).toHaveBeenCalledTimes(2);
	});

	it("should cancel the debounced function when destroy is called", async () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn();
		debouncedFn.destroy();

		await new Promise((resolve) => setTimeout(resolve, 200));
		expect(mockFn).not.toHaveBeenCalled();
	});
});
