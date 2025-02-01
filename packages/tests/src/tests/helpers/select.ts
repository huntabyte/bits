/**
 * Generates consistent test ids for select items, handling empty strings and null values
 * @param value - The value of the item
 * @returns The test id
 */
export function generateTestId(value: string | null) {
	return value && value !== null ? value : "empty";
}
export function getTestId(item: { value: string | null }) {
	return item.value && item.value !== null ? item.value : "empty";
}
