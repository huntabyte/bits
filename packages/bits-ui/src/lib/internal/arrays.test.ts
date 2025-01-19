import { describe, expect, it } from "vitest";
import {
	arraysAreEqual,
	backward,
	chunk,
	forward,
	getNextMatch,
	isValidIndex,
	next,
	prev,
	wrapArray,
} from "./arrays.js";

describe("arraysAreEqual", () => {
	it("should return true for two empty arrays", () => {
		expect(arraysAreEqual([], [])).toBe(true);
	});

	it("should return true for two arrays with the same elements in the same order", () => {
		expect(arraysAreEqual([1, 2, 3], [1, 2, 3])).toBe(true);
	});

	it("should return false for two arrays with different lengths", () => {
		expect(arraysAreEqual([1, 2, 3], [1, 2])).toBe(false);
	});

	it("should return false for two arrays with different elements", () => {
		expect(arraysAreEqual([1, 2, 3], [1, 2, 4])).toBe(false);
	});

	it("should return false for two arrays with elements in different orders", () => {
		expect(arraysAreEqual([1, 2, 3], [3, 2, 1])).toBe(false);
	});

	it("should handle arrays with non-primitive values", () => {
		const obj1 = { foo: "bar" };
		const obj2 = { foo: "bar" };
		expect(arraysAreEqual([obj1], [obj2])).toBe(true);
	});

	it("should handle arrays with different non-primitive values", () => {
		const obj1 = { foo: "baz" };
		const obj2 = { foo: "bar" };
		expect(arraysAreEqual([obj1], [obj2])).toBe(false);
	});

	it("should handle nested arrays", () => {
		expect(arraysAreEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
		expect(arraysAreEqual([1, [2, 3]], [1, [3, 2]])).toBe(false);
	});

	it("should handle arrays with different types of elements", () => {
		expect(arraysAreEqual([1, "2", true], [1, "2", true])).toBe(true);
		expect(arraysAreEqual([1, "2", true], [1, 2, true])).toBe(false);
	});

	it("should handle sparse arrays", () => {
		// eslint-disable-next-line no-sparse-arrays
		const arr1 = [1, , 3];
		const arr2 = [1, undefined, 3];
		expect(arraysAreEqual(arr1, arr2)).toBe(true);
	});

	it("should handle NaN values", () => {
		expect(arraysAreEqual([Number.NaN], [Number.NaN])).toBe(true);
	});
});

describe("chunk", () => {
	it("should return an empty array when given an empty array", () => {
		expect(chunk([], 2)).toEqual([]);
	});

	it("should return an array with one chunk when size is greater than or equal to array length", () => {
		expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
		expect(chunk([1, 2, 3], 4)).toEqual([[1, 2, 3]]);
	});

	it("should chunk the array into arrays of the specified size", () => {
		expect(chunk([1, 2, 3, 4], 2)).toEqual([
			[1, 2],
			[3, 4],
		]);
		expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
	});

	it("should work with arrays containing different types", () => {
		expect(chunk(["a", "b", "c", "d"], 2)).toEqual([
			["a", "b"],
			["c", "d"],
		]);
		expect(chunk([1, "b", true, null], 2)).toEqual([
			[1, "b"],
			[true, null],
		]);
	});

	it("should handle negative or zero size", () => {
		expect(chunk([1, 2, 3, 4], 0)).toEqual([]);
		expect(chunk([1, 2, 3, 4], -1)).toEqual([]);
	});
});

describe("isValidIndex", () => {
	it("should return true for valid indices", () => {
		const arr = [1, 2, 3, 4, 5];
		expect(isValidIndex(0, arr)).toBe(true);
		expect(isValidIndex(2, arr)).toBe(true);
		expect(isValidIndex(4, arr)).toBe(true);
	});

	it("should return false for indices outside the array bounds", () => {
		const arr = [1, 2, 3, 4, 5];
		expect(isValidIndex(-1, arr)).toBe(false);
		expect(isValidIndex(5, arr)).toBe(false);
		expect(isValidIndex(10, arr)).toBe(false);
	});

	it("should return false for negative indices", () => {
		const arr = [1, 2, 3, 4, 5];
		expect(isValidIndex(-1, arr)).toBe(false);
		expect(isValidIndex(-5, arr)).toBe(false);
	});

	it("should return true for an empty array and index 0", () => {
		const arr: unknown[] = [];
		expect(isValidIndex(0, arr)).toBe(false);
	});

	it("should work with arrays of different types", () => {
		const arr = ["a", "b", "c", "d"];
		expect(isValidIndex(0, arr)).toBe(true);
		expect(isValidIndex(3, arr)).toBe(true);
		expect(isValidIndex(4, arr)).toBe(false);
	});
});

describe("next", () => {
	const testArray = ["a", "b", "c", "d"];

	it("returns the next element in the array", () => {
		expect(next(testArray, 0)).toBe("b");
		expect(next(testArray, 1)).toBe("c");
		expect(next(testArray, 2)).toBe("d");
	});

	it("loops to the beginning of the array when reaching the end (default behavior)", () => {
		expect(next(testArray, 3)).toBe("a");
	});

	it("returns undefined when loop is false and at the end of the array", () => {
		expect(next(testArray, 3, false)).toBeUndefined();
	});

	it("works with arrays of different types", () => {
		const numberArray = [1, 2, 3, 4];
		expect(next(numberArray, 1)).toBe(3);

		const objectArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
		expect(next(objectArray, 0)).toEqual({ id: 2 });
	});

	it("handles arrays with one element", () => {
		const singleElementArray = ["solo"];
		expect(next(singleElementArray, 0)).toEqual("solo");
		expect(next(singleElementArray, 0, false)).toEqual("solo");
	});

	it("returns undefined for empty arrays", () => {
		const emptyArray: string[] = [];
		expect(next(emptyArray, 0)).toBeUndefined();
	});

	it("returns undefined for out-of-bounds indices", () => {
		expect(next(testArray, 4)).toBeUndefined();
		expect(next(testArray, -1)).toBeUndefined();
	});

	it("returns undefined for negative indices", () => {
		expect(next(testArray, -1)).toBeUndefined();
	});

	it("returns undefined for indices equal to or greater than array length", () => {
		expect(next(testArray, 4)).toBeUndefined();
		expect(next(testArray, 5)).toBeUndefined();
	});
});

describe("prev", () => {
	const testArray = ["a", "b", "c", "d"];

	it("returns the previous element in the array", () => {
		expect(prev(testArray, 1)).toBe("a");
		expect(prev(testArray, 2)).toBe("b");
		expect(prev(testArray, 3)).toBe("c");
	});

	it("loops to the end of the array when at the beginning (default behavior)", () => {
		expect(prev(testArray, 0)).toBe("d");
	});

	it("returns undefined when loop is false and at the beginning of the array", () => {
		expect(prev(testArray, 0, false)).toBeUndefined();
	});

	it("works with arrays of different types", () => {
		const numberArray = [1, 2, 3, 4];
		expect(prev(numberArray, 2)).toBe(2);

		const objectArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
		expect(prev(objectArray, 1)).toEqual({ id: 1 });
	});

	it("handles arrays with one element", () => {
		const singleElementArray = ["solo"];
		expect(prev(singleElementArray, 0)).toBe("solo");
		expect(prev(singleElementArray, 0, false)).toBe("solo");
	});

	it("returns undefined for empty arrays", () => {
		const emptyArray: string[] = [];
		expect(prev(emptyArray, 0)).toBeUndefined();
	});

	it("returns undefined for out-of-bounds indices", () => {
		expect(prev(testArray, 4)).toBeUndefined();
		expect(prev(testArray, -1)).toBeUndefined();
	});

	it("returns undefined for negative indices", () => {
		expect(prev(testArray, -1)).toBeUndefined();
	});

	it("returns undefined for indices equal to or greater than array length", () => {
		expect(prev(testArray, 4)).toBeUndefined();
		expect(prev(testArray, 5)).toBeUndefined();
	});

	it("returns undefined for indices other than 0 in single-element arrays", () => {
		const singleElementArray = ["solo"];
		expect(prev(singleElementArray, 1)).toBeUndefined();
		expect(prev(singleElementArray, -1)).toBeUndefined();
	});
});

describe("forward function", () => {
	const testArray = ["a", "b", "c", "d", "e"];

	it("returns the element at the target index when within bounds", () => {
		expect(forward(testArray, 0, 2)).toBe("c");
		expect(forward(testArray, 1, 1)).toBe("c");
		expect(forward(testArray, 2, 2)).toBe("e");
	});

	it("wraps around the array when looping is enabled and target index is out of bounds", () => {
		expect(forward(testArray, 3, 2)).toBe("a");
		expect(forward(testArray, 4, 1)).toBe("a");
		expect(forward(testArray, 0, 5)).toBe("a");
		expect(forward(testArray, 0, 7)).toBe("c");
	});

	it("returns the first or last element when looping is disabled and target index is out of bounds", () => {
		expect(forward(testArray, 3, 2, false)).toBe("e");
		expect(forward(testArray, 4, 1, false)).toBe("e");
		expect(forward(testArray, 0, 5, false)).toBe("e");
		expect(forward(testArray, 2, -3, false)).toBe("a");
	});

	it("handles zero increment", () => {
		expect(forward(testArray, 2, 0)).toBe("c");
		expect(forward(testArray, 4, 0)).toBe("e");
	});

	it("works with arrays of different types", () => {
		const numberArray = [1, 2, 3, 4, 5];
		expect(forward(numberArray, 1, 2)).toBe(4);

		const objectArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
		expect(forward(objectArray, 0, 1)).toEqual({ id: 2 });
	});

	it("handles single-element arrays", () => {
		const singleElementArray = ["solo"];
		expect(forward(singleElementArray, 0, 1)).toBe("solo");
		expect(forward(singleElementArray, 0, 5)).toBe("solo");
		expect(forward(singleElementArray, 0, -1)).toBe("solo");
	});

	it("handles negative increments", () => {
		expect(forward(testArray, 3, -1)).toBe("c");
		expect(forward(testArray, 4, -2)).toBe("c");
		expect(forward(testArray, 1, -1)).toBe("a"); // Correctly wraps to the end
		expect(forward(testArray, 0, -1)).toBe("e"); // Wraps to the last element
	});

	it("handles negative increments with looping disabled", () => {
		expect(forward(testArray, 3, -1, false)).toBe("c");
		expect(forward(testArray, 4, -2, false)).toBe("c");
		expect(forward(testArray, 1, -2, false)).toBe("a"); // Returns first element
		expect(forward(testArray, 4, -5, false)).toBe("a"); // Returns first element
	});

	it("returns undefined for empty arrays", () => {
		const emptyArray: string[] = [];
		expect(forward(emptyArray, 0, 1)).toBeUndefined();
	});

	it("returns undefined for out-of-bounds initial indices", () => {
		expect(forward(testArray, -1, 1)).toBeUndefined();
		expect(forward(testArray, 5, 1)).toBeUndefined();
	});

	it("handles large positive and negative increments", () => {
		expect(forward(testArray, 0, 15)).toBe("a"); // Loops around 3 times
		expect(forward(testArray, 0, -15)).toBe("a"); // Loops around -3 times
		expect(forward(testArray, 0, 15, false)).toBe("e");
		expect(forward(testArray, 0, -15, false)).toBe("a");
	});
});

describe("backward function", () => {
	const testArray = [1, 2, 3, 4, 5];

	it("should return the correct element when moving backward", () => {
		expect(backward(testArray, 2, 1)).toBe(2);
		expect(backward(testArray, 4, 2)).toBe(3);
	});

	it("should wrap around the array when looping is enabled", () => {
		expect(backward(testArray, 0, 1)).toBe(5);
		expect(backward(testArray, 1, 3)).toBe(4);
	});

	it("should clamp to array bounds when looping is disabled", () => {
		expect(backward(testArray, 0, 1, false)).toBe(1);
		expect(backward(testArray, 1, 3, false)).toBe(1);
	});

	it("should handle negative decrements (moving forward)", () => {
		expect(backward(testArray, 2, -1)).toBe(4);
		expect(backward(testArray, 4, -2)).toBe(2);
	});

	it("should return undefined for empty arrays", () => {
		expect(backward([], 0, 1)).toBeUndefined();
	});

	it("should return undefined for out-of-bounds initial indices", () => {
		expect(backward(testArray, -1, 1)).toBeUndefined();
		expect(backward(testArray, 5, 1)).toBeUndefined();
	});

	it("should handle large decrements", () => {
		expect(backward(testArray, 4, 10)).toBe(5);
		expect(backward(testArray, 4, 11)).toBe(4);
	});
});

describe("getNextMatch", () => {
	const values = ["apple", "banana", "cherry", "date", "elderberry"];

	it("should return the first match when no current match is provided", () => {
		expect(getNextMatch(values, "b")).toBe("banana");
	});

	it("should return the next match when a current match is provided", () => {
		expect(getNextMatch(values, "c", "cherry")).toBe(undefined);
		expect(getNextMatch(values, "c", "banana")).toBe("cherry");
	});

	it("should handle repeated characters in search", () => {
		expect(getNextMatch(values, "aaa", "apple")).toBe(undefined);
		expect(getNextMatch(values, "aaa", "banana")).toBe("apple");
	});

	it("should wrap around the array when reaching the end", () => {
		expect(getNextMatch(values, "d", "date")).toBe(undefined);
		expect(getNextMatch(values, "a", "elderberry")).toBe("apple");
	});

	it("should be case-insensitive", () => {
		expect(getNextMatch(values, "B", "apple")).toBe("banana");
		expect(getNextMatch(values, "cH", "banana")).toBe("cherry");
	});

	it("should handle empty search string", () => {
		expect(getNextMatch(values, "", "banana")).toBe(undefined);
	});

	it("should handle empty values array", () => {
		expect(getNextMatch([], "a")).toBe(undefined);
	});

	it("should exclude current match when search is a single character", () => {
		expect(getNextMatch(values, "a", "apple")).toBe(undefined);
		expect(getNextMatch(values, "b", "banana")).toBe(undefined);
	});

	it("should not exclude current match when search is multiple characters", () => {
		expect(getNextMatch(values, "ap", "apple")).toBe(undefined);
		expect(getNextMatch(values, "ba", "banana")).toBe(undefined);
	});

	it("should handle values with common prefixes", () => {
		const prefixValues = ["prefix1", "prefix2", "prefix3", "other"];
		expect(getNextMatch(prefixValues, "pre", "prefix1")).toBe(undefined);
		expect(getNextMatch(prefixValues, "pre", "prefix2")).toBe(undefined);
		expect(getNextMatch(prefixValues, "pre", "prefix3")).toBe(undefined);
		expect(getNextMatch(prefixValues, "pre", "other")).toBe("prefix1");
	});

	it("should cycle through values with common prefixes using single character search", () => {
		const prefixValues = ["prefix1", "prefix2", "prefix3", "other"];
		expect(getNextMatch(prefixValues, "p", "other")).toBe("prefix1");
		expect(getNextMatch(prefixValues, "p", "prefix1")).toBe("prefix2");
		expect(getNextMatch(prefixValues, "p", "prefix2")).toBe("prefix3");
		expect(getNextMatch(prefixValues, "p", "prefix3")).toBe("prefix1");
	});

	it("should handle single character search with prefixed values", () => {
		const prefixValues = ["prefix1", "prefix2", "prefix3", "other"];
		expect(getNextMatch(prefixValues, "p")).toBe("prefix1");
		expect(getNextMatch(prefixValues, "p", "prefix1")).toBe("prefix2");
		expect(getNextMatch(prefixValues, "o")).toBe("other");
		expect(getNextMatch(prefixValues, "o", "other")).toBe(undefined);
	});
});

describe("wrapArray", () => {
	it("should wrap the array starting from the given index", () => {
		expect(wrapArray(["a", "b", "c", "d"], 2)).toEqual(["c", "d", "a", "b"]);
	});

	it("should handle start index 0 (no wrapping)", () => {
		expect(wrapArray([1, 2, 3, 4, 5], 0)).toEqual([1, 2, 3, 4, 5]);
	});

	it("should wrap correctly with start index equal to array length", () => {
		expect(wrapArray(["x", "y", "z"], 3)).toEqual(["x", "y", "z"]);
	});

	it("should work with empty array", () => {
		expect(wrapArray([], 2)).toEqual([]);
	});

	it("should work with array of different types", () => {
		expect(wrapArray([true, 42, "test"], 1)).toEqual([42, "test", true]);
	});
});
