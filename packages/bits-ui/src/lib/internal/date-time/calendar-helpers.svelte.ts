import { type DateValue, endOfMonth, isSameMonth, startOfMonth } from "@internationalized/date";
import { type ReadableBox, type WritableBox, afterTick, styleToString } from "svelte-toolbelt";
import { untrack } from "svelte";
import {
	getDaysInMonth,
	getLastFirstDayOfWeek,
	getNextLastDayOfWeek,
	isAfter,
	isBefore,
	parseStringToDateValue,
	toDate,
} from "./utils.js";
import type { Formatter } from "./formatter.js";
import { getDataDisabled, getDataInvalid, getDataReadonly } from "$lib/internal/attrs.js";
import { chunk, isValidIndex } from "$lib/internal/arrays.js";
import { isHTMLElement } from "$lib/internal/is.js";
import { kbd } from "$lib/internal/kbd.js";
import type { Month } from "$lib/shared/index.js";

/**
 * Checks if a given node is a calendar cell element.
 *
 * @param node - The node to check.
 */
export function isCalendarDayNode(node: unknown): node is HTMLElement {
	if (!isHTMLElement(node)) return false;
	if (!node.hasAttribute("data-bits-day")) return false;
	return true;
}

/**
 * Retrieves an array of date values representing the days between
 * the provided start and end dates.
 */
export function getDaysBetween(start: DateValue, end: DateValue) {
	const days: DateValue[] = [];
	let dCurrent = start.add({ days: 1 });
	const dEnd = end;
	while (dCurrent.compare(dEnd) < 0) {
		days.push(dCurrent);
		dCurrent = dCurrent.add({ days: 1 });
	}
	return days;
}

export type CreateMonthProps = {
	/**
	 * The date object representing the month's date (usually the first day of the month).
	 */
	dateObj: DateValue;

	/**
	 * The day of the week to start the calendar on (0 for Sunday, 1 for Monday, etc.).
	 */
	weekStartsOn: number;

	/**
	 * Whether to always render 6 weeks in the calendar, even if the month doesn't
	 * span 6 weeks.
	 */
	fixedWeeks: boolean;

	/**
	 * The locale to use when creating the calendar month.
	 */
	locale: string;
};

/**
 * Creates a calendar month object.
 *
 * @remarks
 * Given a date, this function returns an object containing
 * the necessary values to render a calendar month, including
 * the month's date (the first day of that month), which can be
 * used to render the name of the month, an array of all dates
 * in that month, and an array of weeks. Each week is an array
 * of dates, useful for rendering an accessible calendar grid
 * using a loop and table elements.
 *
 */
function createMonth(props: CreateMonthProps): Month<DateValue> {
	const { dateObj, weekStartsOn, fixedWeeks, locale } = props;
	const daysInMonth = getDaysInMonth(dateObj);

	const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }));

	const firstDayOfMonth = startOfMonth(dateObj);
	const lastDayOfMonth = endOfMonth(dateObj);

	const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, weekStartsOn, locale);
	const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, weekStartsOn, locale);

	const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth);
	const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }));

	const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;

	if (fixedWeeks && totalDays < 42) {
		const extraDays = 42 - totalDays;

		let startFrom = nextMonthDays[nextMonthDays.length - 1];

		if (!startFrom) {
			startFrom = dateObj.add({ months: 1 }).set({ day: 1 });
		}

		let length = extraDays;
		if (nextMonthDays.length === 0) {
			length = extraDays - 1;
			nextMonthDays.push(startFrom);
		}

		const extraDaysArray = Array.from({ length }, (_, i) => {
			const incr = i + 1;
			return startFrom.add({ days: incr });
		});
		nextMonthDays.push(...extraDaysArray);
	}

	const allDays = lastMonthDays.concat(datesArray, nextMonthDays);

	const weeks = chunk(allDays, 7);

	return {
		value: dateObj,
		dates: allDays,
		weeks,
	};
}

type SetMonthProps = CreateMonthProps & {
	numberOfMonths: number | undefined;
	currentMonths?: Month<DateValue>[];
};

export function createMonths(props: SetMonthProps) {
	const { numberOfMonths, dateObj, ...monthProps } = props;

	const months: Month<DateValue>[] = [];

	if (!numberOfMonths || numberOfMonths === 1) {
		months.push(
			createMonth({
				...monthProps,
				dateObj,
			})
		);
		return months;
	}

	months.push(
		createMonth({
			...monthProps,
			dateObj,
		})
	);

	// Create all the months, starting with the current month
	for (let i = 1; i < numberOfMonths; i++) {
		const nextMonth = dateObj.add({ months: i });
		months.push(
			createMonth({
				...monthProps,
				dateObj: nextMonth,
			})
		);
	}

	return months;
}

export function getSelectableCells(calendarNode: HTMLElement | null) {
	if (!calendarNode) return [];
	const selectableSelector = `[data-bits-day]:not([data-disabled]):not([data-outside-visible-months])`;

	return Array.from(calendarNode.querySelectorAll(selectableSelector)).filter(
		(el): el is HTMLElement => isHTMLElement(el)
	);
}

/**
 * A helper function to extract the date from the `data-value`
 * attribute of a date cell and set it as the placeholder value.
 *
 * Shared between the calendar and range calendar builders.
 *
 * @param node - The node to extract the date from.
 * @param placeholder - The placeholder value store which will be set to the extracted date.
 */
export function setPlaceholderToNodeValue(node: HTMLElement, placeholder: WritableBox<DateValue>) {
	const cellValue = node.getAttribute("data-value");
	if (!cellValue) return;
	placeholder.current = parseStringToDateValue(cellValue, placeholder.current);
}

type ShiftCalendarFocusProps = {
	/**
	 * The day node with current focus.
	 */
	node: HTMLElement;

	/**
	 * The number of days to shift the focus by.
	 */
	add: number;

	/**
	 * The `placeholder` value box
	 */
	placeholder: WritableBox<DateValue>;

	/**
	 * The calendar node.
	 */
	calendarNode: HTMLElement | null;

	/**
	 * Whether the previous button is disabled.
	 */
	isPrevButtonDisabled: boolean;

	/**
	 * Whether the next button is disabled.
	 */
	isNextButtonDisabled: boolean;

	/**
	 * The months array of the calendar.
	 */
	months: Month<DateValue>[];

	/**
	 * The number of months being displayed in the calendar.
	 */
	numberOfMonths: number;
};

/**
 * Shared logic for shifting focus between cells in the
 * calendar and range calendar.
 */
export function shiftCalendarFocus({
	node,
	add,
	placeholder,
	calendarNode,
	isPrevButtonDisabled,
	isNextButtonDisabled,
	months,
	numberOfMonths,
}: ShiftCalendarFocusProps) {
	const candidateCells = getSelectableCells(calendarNode);
	if (!candidateCells.length) return;

	const index = candidateCells.indexOf(node);
	const nextIndex = index + add;

	/**
	 * If the next cell is within the bounds of the displayed cells,
	 * easy day, we just focus it.
	 */
	if (isValidIndex(nextIndex, candidateCells)) {
		const nextCell = candidateCells[nextIndex]!;
		setPlaceholderToNodeValue(nextCell, placeholder);
		return nextCell.focus();
	}

	/**
	 * When the next cell falls outside the displayed cells range,
	 * we update the focus to the previous or next month based on the
	 * direction, and then focus on the relevant cell.
	 */

	if (nextIndex < 0) {
		/**
		 * To handle negative indices, we rewind by one month,
		 * retrieve candidate cells for that month, and shift focus
		 * by the difference between the nextIndex starting from the end
		 * of the array.
		 */

		// shift the calendar back a month unless prev month is disabled
		if (isPrevButtonDisabled) return;

		const firstMonth = months[0]?.value;
		if (!firstMonth) return;
		placeholder.current = firstMonth.subtract({ months: numberOfMonths });

		// Without a tick here, it seems to be too quick for the DOM to update

		afterTick(() => {
			const newCandidateCells = getSelectableCells(calendarNode);
			if (!newCandidateCells.length) return;

			/**
			 * Starting at the end of the array, shift focus by the diff
			 * between the nextIndex and the length of the array, since the
			 * nextIndex is negative.
			 */
			const newIndex = newCandidateCells.length - Math.abs(nextIndex);
			if (isValidIndex(newIndex, newCandidateCells)) {
				const newCell = newCandidateCells[newIndex]!;
				setPlaceholderToNodeValue(newCell, placeholder);
				return newCell.focus();
			}
		});
	}

	if (nextIndex >= candidateCells.length) {
		/**
		 * Since we're in the positive index range, we need to go forward
		 * a month, refetch the candidate cells within that month, and then
		 * starting at the beginning of the array, shift focus by the nextIndex
		 * amount.
		 */

		// shift the calendar forward a month unless next month is disabled
		if (isNextButtonDisabled) return;

		const firstMonth = months[0]?.value;
		if (!firstMonth) return;
		placeholder.current = firstMonth.add({ months: numberOfMonths });

		afterTick(() => {
			const newCandidateCells = getSelectableCells(calendarNode);
			if (!newCandidateCells.length) return;

			/**
			 * We need to determine how far into the next month we need to go
			 * to get the next index. So if we only went over the previous month
			 * by one, we need to go into the next month by 1 to get the right index.
			 */
			const newIndex = nextIndex - candidateCells.length;

			if (isValidIndex(newIndex, newCandidateCells)) {
				const nextCell = newCandidateCells[newIndex]!;
				return nextCell.focus();
			}
		});
	}
}

type HandleCalendarKeydownProps = {
	event: KeyboardEvent;
	handleCellClick: (event: Event, date: DateValue) => void;
	shiftFocus: (node: HTMLElement, add: number) => void;
	placeholderValue: DateValue;
};
const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT] as const;
const SELECT_KEYS = [kbd.ENTER, kbd.SPACE];

/**
 * Shared keyboard event handler for the calendar and range calendar.
 */
export function handleCalendarKeydown({
	event,
	handleCellClick,
	shiftFocus,
	placeholderValue,
}: HandleCalendarKeydownProps) {
	const currentCell = event.target;
	if (!isCalendarDayNode(currentCell)) return;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!ARROW_KEYS.includes(event.key as any) && !SELECT_KEYS.includes(event.key)) return;

	event.preventDefault();

	const kbdFocusMap: Record<(typeof ARROW_KEYS)[number], number> = {
		[kbd.ARROW_DOWN]: 7,
		[kbd.ARROW_UP]: -7,
		[kbd.ARROW_LEFT]: -1,
		[kbd.ARROW_RIGHT]: 1,
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (ARROW_KEYS.includes(event.key as any)) {
		const add = kbdFocusMap[event.key as (typeof ARROW_KEYS)[number]];
		if (add !== undefined) {
			shiftFocus(currentCell, add);
		}
	}

	if (SELECT_KEYS.includes(event.key)) {
		const cellValue = currentCell.getAttribute("data-value");
		if (!cellValue) return;
		handleCellClick(event, parseStringToDateValue(cellValue, placeholderValue));
	}
}

type HandleCalendarPageProps = {
	months: Month<DateValue>[];
	setMonths: (months: Month<DateValue>[]) => void;
	numberOfMonths: number;
	pagedNavigation: boolean;
	weekStartsOn: number;
	locale: string;
	fixedWeeks: boolean;
	setPlaceholder: (date: DateValue) => void;
};

export function handleCalendarNextPage({
	months,
	setMonths,
	numberOfMonths,
	pagedNavigation,
	weekStartsOn,
	locale,
	fixedWeeks,
	setPlaceholder,
}: HandleCalendarPageProps) {
	const firstMonth = months[0]?.value;
	if (!firstMonth) return;
	if (pagedNavigation) {
		setPlaceholder(firstMonth.add({ months: numberOfMonths }));
	} else {
		const newMonths = createMonths({
			dateObj: firstMonth.add({ months: 1 }),
			weekStartsOn,
			locale,
			fixedWeeks,
			numberOfMonths,
		});
		setMonths(newMonths);

		const firstNewMonth = newMonths[0];
		if (!firstNewMonth) return;
		setPlaceholder(firstNewMonth.value.set({ day: 1 }));
	}
}

export function handleCalendarPrevPage({
	months,
	setMonths,
	numberOfMonths,
	pagedNavigation,
	weekStartsOn,
	locale,
	fixedWeeks,
	setPlaceholder,
}: HandleCalendarPageProps) {
	const firstMonth = months[0]?.value;
	if (!firstMonth) return;
	if (pagedNavigation) {
		setPlaceholder(firstMonth.subtract({ months: numberOfMonths }));
	} else {
		const newMonths = createMonths({
			dateObj: firstMonth.subtract({ months: 1 }),
			weekStartsOn,
			locale,
			fixedWeeks,
			numberOfMonths,
		});

		setMonths(newMonths);
		const firstNewMonth = newMonths[0];
		if (!firstNewMonth) return;
		setPlaceholder(firstNewMonth.value.set({ day: 1 }));
	}
}

type GetWeekdaysProps = {
	months: Month<DateValue>[];
	weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
	formatter: Formatter;
};

export function getWeekdays({ months, formatter, weekdayFormat }: GetWeekdaysProps) {
	if (!months.length) return [];
	const firstMonth = months[0]!;
	const firstWeek = firstMonth.weeks[0];
	if (!firstWeek) return [];
	return firstWeek.map((date) => formatter.dayOfWeek(toDate(date), weekdayFormat));
}

type UseMonthViewSyncProps = {
	weekStartsOn: ReadableBox<number>;
	locale: ReadableBox<string>;
	fixedWeeks: ReadableBox<boolean>;
	numberOfMonths: ReadableBox<number>;
	placeholder: WritableBox<DateValue>;
	setMonths: (months: Month<DateValue>[]) => void;
};

/**
 * Updates the displayed months based on changes in the options values,
 * which determines the month to show in the calendar.
 */
export function useMonthViewOptionsSync(props: UseMonthViewSyncProps) {
	const weekStartsOn = props.weekStartsOn.current;
	const locale = props.locale.current;
	const fixedWeeks = props.fixedWeeks.current;
	const numberOfMonths = props.numberOfMonths.current;

	untrack(() => {
		const placeholder = props.placeholder.current;
		if (!placeholder) return;
		const defaultMonthProps = {
			weekStartsOn,
			locale,
			fixedWeeks,
			numberOfMonths,
		};

		props.setMonths(createMonths({ ...defaultMonthProps, dateObj: placeholder }));
	});
}

type CreateAccessibleHeadingProps = {
	calendarNode: HTMLElement;
	label: string;
	accessibleHeadingId: string;
};

/**
 * Creates an accessible heading element for the calendar.
 * Returns a function that removes the heading element.
 */
export function createAccessibleHeading({
	calendarNode,
	label,
	accessibleHeadingId,
}: CreateAccessibleHeadingProps) {
	const div = document.createElement("div");
	div.style.cssText = styleToString({
		border: "0px",
		clip: "rect(0px, 0px, 0px, 0px)",
		clipPath: "inset(50%)",
		height: "1px",
		margin: "-1px",
		overflow: "hidden",
		padding: "0px",
		position: "absolute",
		whiteSpace: "nowrap",
		width: "1px",
	});
	const h2 = document.createElement("div");
	h2.textContent = label;
	h2.id = accessibleHeadingId;
	h2.role = "heading";
	h2.ariaLevel = "2";
	calendarNode.insertBefore(div, calendarNode.firstChild);
	div.appendChild(h2);

	return () => {
		const h2 = document.getElementById(accessibleHeadingId);
		if (!h2) return;
		div.parentElement?.removeChild(div);
		h2.remove();
	};
}

type UseMonthViewPlaceholderSyncProps = {
	placeholder: WritableBox<DateValue>;
	getVisibleMonths: () => DateValue[];
	weekStartsOn: ReadableBox<number>;
	locale: ReadableBox<string>;
	fixedWeeks: ReadableBox<boolean>;
	numberOfMonths: ReadableBox<number>;
	setMonths: (months: Month<DateValue>[]) => void;
};

export function useMonthViewPlaceholderSync({
	placeholder,
	getVisibleMonths,
	weekStartsOn,
	locale,
	fixedWeeks,
	numberOfMonths,
	setMonths,
}: UseMonthViewPlaceholderSyncProps) {
	$effect(() => {
		placeholder.current;
		untrack(() => {
			/**
			 * If the placeholder's month is already in this visible months,
			 * we don't need to do anything.
			 */
			if (getVisibleMonths().some((month) => isSameMonth(month, placeholder.current))) {
				return;
			}

			const defaultMonthProps = {
				weekStartsOn: weekStartsOn.current,
				locale: locale.current,
				fixedWeeks: fixedWeeks.current,
				numberOfMonths: numberOfMonths.current,
			};

			setMonths(createMonths({ ...defaultMonthProps, dateObj: placeholder.current }));
		});
	});
}

type GetIsNextButtonDisabledProps = {
	maxValue: DateValue | undefined;
	months: Month<DateValue>[];
	disabled: boolean;
};

export function getIsNextButtonDisabled({
	maxValue,
	months,
	disabled,
}: GetIsNextButtonDisabledProps) {
	if (!maxValue || !months.length) return false;
	if (disabled) return true;
	const lastMonthInView = months[months.length - 1]?.value;
	if (!lastMonthInView) return false;
	const firstMonthOfNextPage = lastMonthInView
		.add({
			months: 1,
		})
		.set({ day: 1 });
	return isAfter(firstMonthOfNextPage, maxValue);
}

type GetIsPrevButtonDisabledProps = {
	minValue: DateValue | undefined;
	months: Month<DateValue>[];
	disabled: boolean;
};

export function getIsPrevButtonDisabled({
	minValue,
	months,
	disabled,
}: GetIsPrevButtonDisabledProps) {
	if (!minValue || !months.length) return false;
	if (disabled) return true;
	const firstMonthInView = months[0]?.value;
	if (!firstMonthInView) return false;
	const lastMonthOfPrevPage = firstMonthInView
		.subtract({
			months: 1,
		})
		.set({ day: 35 });
	return isBefore(lastMonthOfPrevPage, minValue);
}

type GetCalendarHeadingValueProps = {
	months: Month<DateValue>[];
	formatter: Formatter;
	locale: string;
};

export function getCalendarHeadingValue({
	months,
	locale,
	formatter,
}: GetCalendarHeadingValueProps) {
	if (!months.length) return "";
	if (locale !== formatter.getLocale()) {
		formatter.setLocale(locale);
	}
	if (months.length === 1) {
		const month = toDate(months[0]!.value);
		return `${formatter.fullMonthAndYear(month)}`;
	}

	const startMonth = toDate(months[0]!.value);
	const endMonth = toDate(months[months.length - 1]!.value);

	const startMonthName = formatter.fullMonth(startMonth);
	const endMonthName = formatter.fullMonth(endMonth);

	const startMonthYear = formatter.fullYear(startMonth);
	const endMonthYear = formatter.fullYear(endMonth);

	const content =
		startMonthYear === endMonthYear
			? `${startMonthName} - ${endMonthName} ${endMonthYear}`
			: `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;

	return content;
}

type GetCalendarElementProps = {
	fullCalendarLabel: string;
	id: string;
	isInvalid: boolean;
	disabled: boolean;
	readonly: boolean;
};

export function getCalendarElementProps({
	fullCalendarLabel,
	id,
	isInvalid,
	disabled,
	readonly,
}: GetCalendarElementProps) {
	return {
		id,
		role: "application",
		"aria-label": fullCalendarLabel,
		"data-invalid": getDataInvalid(isInvalid),
		"data-disabled": getDataDisabled(disabled),
		"data-readonly": getDataReadonly(readonly),
	} as const;
}

export type CalendarParts =
	| "root"
	| "grid"
	| "cell"
	| "next-button"
	| "prev-button"
	| "day"
	| "grid-body"
	| "grid-head"
	| "grid-row"
	| "head-cell"
	| "header"
	| "heading";

export function pickerOpenFocus(e: Event) {
	const nodeToFocus = document.querySelector<HTMLElement>("[data-bits-day][data-focused]");
	if (nodeToFocus) {
		e.preventDefault();
		nodeToFocus?.focus();
	}
}
