import { describe, expect, it } from "vitest";
import {
	POINT_COMPARATOR,
	type Point,
	type Polygon,
	makeHullPresorted,
	pointInPolygon,
} from "./polygon.js";

describe("makeHullPresorted", () => {
	it("should return an empty array for an empty input array", () => {
		const points: Point[] = [];
		const result = makeHullPresorted(points);
		expect(result).toEqual([]);
	});

	it("should return the input array for an array with one point", () => {
		const points: Point[] = [{ x: 0, y: 0 }];
		const result = makeHullPresorted(points);
		expect(result).toEqual(points);
	});

	it("should return the convex hull for a set of presorted points", () => {
		const points: Point[] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 1 },
			{ x: 4, y: 0 },
		];
		const expectedHull: Point[] = [
			{ x: 0, y: 0 },
			{ x: 2, y: 2 },
			{ x: 4, y: 0 },
		];
		const result = makeHullPresorted(points);
		expect(result).toEqual(expectedHull);
	});

	it("should handle collinear points correctly", () => {
		const points: Point[] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 4, y: 4 },
		];
		const expectedHull: Point[] = [
			{ x: 0, y: 0 },
			{ x: 4, y: 4 },
		];
		const result = makeHullPresorted(points);
		expect(result).toEqual(expectedHull);
	});

	it("should handle duplicate points correctly", () => {
		const points: Point[] = [
			{ x: 0, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 1 },
			{ x: 3, y: 1 },
			{ x: 4, y: 0 },
		];
		const expectedHull: Point[] = [
			{ x: 0, y: 0 },
			{ x: 2, y: 2 },
			{ x: 4, y: 0 },
		];
		const result = makeHullPresorted(points);
		expect(result).toEqual(expectedHull);
	});

	it("should return a single point if all points are the same", () => {
		const points: Point[] = [
			{ x: 1, y: 1 },
			{ x: 1, y: 1 },
			{ x: 1, y: 1 },
		];
		const expectedHull: Point[] = [{ x: 1, y: 1 }];
		const result = makeHullPresorted(points);
		expect(result).toEqual(expectedHull);
	});
});

describe("pOINT_COMPARATOR", () => {
	it("should return -1 if point a has a smaller x-coordinate", () => {
		const a: Point = { x: 1, y: 0 };
		const b: Point = { x: 2, y: 0 };
		const result = POINT_COMPARATOR(a, b);
		expect(result).toBe(-1);
	});

	it("should return +1 if point a has a larger x-coordinate", () => {
		const a: Point = { x: 3, y: 0 };
		const b: Point = { x: 2, y: 0 };
		const result = POINT_COMPARATOR(a, b);
		expect(result).toBe(+1);
	});

	it("should compare y-coordinates if x-coordinates are equal", () => {
		const a1: Point = { x: 2, y: 1 };
		const b1: Point = { x: 2, y: 2 };
		const result1 = POINT_COMPARATOR(a1, b1);
		expect(result1).toBe(-1);

		const a2: Point = { x: 2, y: 3 };
		const b2: Point = { x: 2, y: 2 };
		const result2 = POINT_COMPARATOR(a2, b2);
		expect(result2).toBe(+1);
	});

	it("should return 0 if both x-coordinates and y-coordinates are equal", () => {
		const a: Point = { x: 2, y: 2 };
		const b: Point = { x: 2, y: 2 };
		const result = POINT_COMPARATOR(a, b);
		expect(result).toBe(0);
	});

	it("should correctly compare points with negative coordinates", () => {
		const a1: Point = { x: -2, y: 0 };
		const b1: Point = { x: -1, y: 0 };
		const result1 = POINT_COMPARATOR(a1, b1);
		expect(result1).toBe(-1);

		const a2: Point = { x: -2, y: -3 };
		const b2: Point = { x: -2, y: -2 };
		const result2 = POINT_COMPARATOR(a2, b2);
		expect(result2).toBe(-1);
	});

	it("should correctly compare points with floating-point coordinates", () => {
		const a1: Point = { x: 1.5, y: 0 };
		const b1: Point = { x: 2.5, y: 0 };
		const result1 = POINT_COMPARATOR(a1, b1);
		expect(result1).toBe(-1);

		const a2: Point = { x: 2.5, y: 1.7 };
		const b2: Point = { x: 2.5, y: 1.8 };
		const result2 = POINT_COMPARATOR(a2, b2);
		expect(result2).toBe(-1);
	});
});

describe("pointInPolygon", () => {
	const polygon: Polygon = [
		{ x: 0, y: 0 },
		{ x: 4, y: 0 },
		{ x: 4, y: 4 },
		{ x: 0, y: 4 },
	];

	it("should return true for a point inside the polygon", () => {
		const point: Point = { x: 2, y: 2 };
		const result = pointInPolygon(point, polygon);
		expect(result).toBe(true);
	});

	it("should return false for a point outside the polygon", () => {
		const point: Point = { x: 5, y: 5 };
		const result = pointInPolygon(point, polygon);
		expect(result).toBe(false);
	});

	it("should return true for a point on a polygon edge", () => {
		const point: Point = { x: 2, y: 0 };
		const result = pointInPolygon(point, polygon);
		expect(result).toBe(true);
	});

	it("should return false for a point on a polygon vertex", () => {
		const point: Point = { x: 4, y: 4 };
		const result = pointInPolygon(point, polygon);
		expect(result).toBe(false);
	});

	it("should handle polygons with negative coordinates", () => {
		const polygonNegative: Polygon = [
			{ x: -4, y: -4 },
			{ x: 0, y: -4 },
			{ x: 0, y: 0 },
			{ x: -4, y: 0 },
		];
		const pointInside: Point = { x: -2, y: -2 };
		const pointOutside: Point = { x: 1, y: -2 };
		expect(pointInPolygon(pointInside, polygonNegative)).toBe(true);
		expect(pointInPolygon(pointOutside, polygonNegative)).toBe(false);
	});

	it("should handle polygons with floating-point coordinates", () => {
		const polygonFloat: Polygon = [
			{ x: 0.5, y: 0.5 },
			{ x: 4.5, y: 0.5 },
			{ x: 4.5, y: 4.5 },
			{ x: 0.5, y: 4.5 },
		];
		const pointInside: Point = { x: 2.5, y: 2.5 };
		const pointOutside: Point = { x: 5.5, y: 2.5 };
		expect(pointInPolygon(pointInside, polygonFloat)).toBe(true);
		expect(pointInPolygon(pointOutside, polygonFloat)).toBe(false);
	});
});
