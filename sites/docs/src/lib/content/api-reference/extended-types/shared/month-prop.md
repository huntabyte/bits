```ts
import type { DateValue } from "@internationalized/date";

type Month = {
	/**
	 * The current month being iterated over.
	 * This is passed to certain components to determine
	 * if they fall within the current month.
	 */
	value: DateValue;

	/**
	 * An array of arrays of dates. Each top-level array represents
	 * a week. Each nested array represents a day in the week.
	 */
	weeks: DateValue[][];

	/**
	 * An array of all the dates in the month. This is a flat array
	 * used for rendering more custom calendars.
	 */
	dates: DateValue[];
};
```
