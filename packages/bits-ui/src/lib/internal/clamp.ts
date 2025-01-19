/**
 * Clamps a number between a minimum and maximum value.
 */
export function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}
