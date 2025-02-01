import {
	type DateValue,
	getLocalTimeZone,
	isSameDay,
	isSameMonth,
	isToday,
} from "@internationalized/date";
import { DEV } from "esm-env";
import { untrack } from "svelte";
import { useRefById } from "svelte-toolbelt";
import { Context } from "runed";
import type { RangeCalendarRootState } from "../range-calendar/range-calendar.svelte.js";
import {
	getAriaDisabled,
	getAriaHidden,
	getAriaReadonly,
	getAriaSelected,
	getDataDisabled,
	getDataReadonly,
	getDataSelected,
	getDataUnavailable,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { useId } from "$lib/internal/use-id.js";
import type { DateMatcher, Month } from "$lib/shared/index.js";
import { type Announcer, getAnnouncer } from "$lib/internal/date-time/announcer.js";
import { type Formatter, createFormatter } from "$lib/internal/date-time/formatter.js";
import {
	type CalendarParts,
	createAccessibleHeading,
	createMonths,
	getCalendarElementProps,
	getCalendarHeadingValue,
	getIsNextButtonDisabled,
	getIsPrevButtonDisabled,
	getWeekdays,
	handleCalendarKeydown,
	handleCalendarNextPage,
	handleCalendarPrevPage,
	shiftCalendarFocus,
	useMonthViewOptionsSync,
	useMonthViewPlaceholderSync,
} from "$lib/internal/date-time/calendar-helpers.svelte.js";
import { isBefore, toDate } from "$lib/internal/date-time/utils.js";

type CalendarRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: DateValue | undefined | DateValue[];
		placeholder: DateValue;
	}> &
		ReadableBoxedValues<{
			preventDeselect: boolean;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			pagedNavigation: boolean;
			weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
			weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
			isDateDisabled: DateMatcher;
			isDateUnavailable: DateMatcher;
			fixedWeeks: boolean;
			numberOfMonths: number;
			locale: string;
			calendarLabel: string;
			type: "single" | "multiple";
			readonly: boolean;
			disableDaysOutsideMonth: boolean;
			initialFocus: boolean;
			/**
			 * This is strictly used by the `DatePicker` component to close the popover when a date
			 * is selected. It is not intended to be used by the user.
			 */
			onDateSelect?: () => void;
		}>
>;

export class CalendarRootState {
	ref: CalendarRootStateProps["ref"];
	id: CalendarRootStateProps["id"];
	value: CalendarRootStateProps["value"];
	placeholder: CalendarRootStateProps["placeholder"];
	preventDeselect: CalendarRootStateProps["preventDeselect"];
	minValue: CalendarRootStateProps["minValue"];
	maxValue: CalendarRootStateProps["maxValue"];
	disabled: CalendarRootStateProps["disabled"];
	pagedNavigation: CalendarRootStateProps["pagedNavigation"];
	weekStartsOn: CalendarRootStateProps["weekStartsOn"];
	weekdayFormat: CalendarRootStateProps["weekdayFormat"];
	isDateDisabledProp: CalendarRootStateProps["isDateDisabled"];
	isDateUnavailableProp: CalendarRootStateProps["isDateUnavailable"];
	fixedWeeks: CalendarRootStateProps["fixedWeeks"];
	numberOfMonths: CalendarRootStateProps["numberOfMonths"];
	locale: CalendarRootStateProps["locale"];
	calendarLabel: CalendarRootStateProps["calendarLabel"];
	type: CalendarRootStateProps["type"];
	readonly: CalendarRootStateProps["readonly"];
	disableDaysOutsideMonth: CalendarRootStateProps["disableDaysOutsideMonth"];
	onDateSelect: CalendarRootStateProps["onDateSelect"];
	initialFocus: CalendarRootStateProps["initialFocus"];
	months: Month<DateValue>[] = $state([]);
	visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	announcer: Announcer;
	formatter: Formatter;
	accessibleHeadingId = useId();

	constructor(props: CalendarRootStateProps) {
		this.value = props.value;
		this.placeholder = props.placeholder;
		this.preventDeselect = props.preventDeselect;
		this.minValue = props.minValue;
		this.maxValue = props.maxValue;
		this.disabled = props.disabled;
		this.pagedNavigation = props.pagedNavigation;
		this.weekStartsOn = props.weekStartsOn;
		this.weekdayFormat = props.weekdayFormat;
		this.isDateDisabledProp = props.isDateDisabled;
		this.isDateUnavailableProp = props.isDateUnavailable;
		this.fixedWeeks = props.fixedWeeks;
		this.numberOfMonths = props.numberOfMonths;
		this.locale = props.locale;
		this.calendarLabel = props.calendarLabel;
		this.type = props.type;
		this.readonly = props.readonly;
		this.id = props.id;
		this.ref = props.ref;
		this.disableDaysOutsideMonth = props.disableDaysOutsideMonth;
		this.onDateSelect = props.onDateSelect;
		this.initialFocus = props.initialFocus;

		this.announcer = getAnnouncer();
		this.formatter = createFormatter(this.locale.current);

		this.setMonths = this.setMonths.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.nextYear = this.nextYear.bind(this);
		this.setYear = this.setYear.bind(this);
		this.setMonth = this.setMonth.bind(this);
		this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this);
		this.isDateDisabled = this.isDateDisabled.bind(this);
		this.isDateSelected = this.isDateSelected.bind(this);
		this.shiftFocus = this.shiftFocus.bind(this);
		this.handleCellClick = this.handleCellClick.bind(this);
		this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this);
		this.handleSingleUpdate = this.handleSingleUpdate.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.getBitsAttr = this.getBitsAttr.bind(this);

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		this.months = createMonths({
			dateObj: this.placeholder.current,
			weekStartsOn: this.weekStartsOn.current,
			locale: this.locale.current,
			fixedWeeks: this.fixedWeeks.current,
			numberOfMonths: this.numberOfMonths.current,
		});

		$effect(() => {
			const initialFocus = untrack(() => this.initialFocus.current);
			if (initialFocus) {
				// focus the first `data-focused` day node
				const firstFocusedDay =
					this.ref.current?.querySelector<HTMLElement>(`[data-focused]`);
				if (firstFocusedDay) {
					firstFocusedDay.focus();
				}
			}
		});

		$effect(() => {
			if (!this.ref.current) return;
			const removeHeading = createAccessibleHeading({
				calendarNode: this.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId,
			});
			return removeHeading;
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.locale.current) return;
			this.formatter.setLocale(this.locale.current);
		});

		/**
		 * Updates the displayed months based on changes in the placeholder value.
		 */
		useMonthViewPlaceholderSync({
			placeholder: this.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.weekStartsOn,
			locale: this.locale,
			fixedWeeks: this.fixedWeeks,
			numberOfMonths: this.numberOfMonths,
			setMonths: (months: Month<DateValue>[]) => (this.months = months),
		});

		/**
		 * Updates the displayed months based on changes in the options values,
		 * which determines the month to show in the calendar.
		 */
		useMonthViewOptionsSync({
			fixedWeeks: this.fixedWeeks,
			locale: this.locale,
			numberOfMonths: this.numberOfMonths,
			placeholder: this.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.weekStartsOn,
		});

		/**
		 * Update the accessible heading's text content when the `fullCalendarLabel`
		 * changes.
		 */
		$effect(() => {
			const node = document.getElementById(this.accessibleHeadingId);
			if (!node) return;
			node.textContent = this.fullCalendarLabel;
		});

		/**
		 * Synchronize the placeholder value with the current value.
		 */
		$effect(() => {
			this.value.current;
			untrack(() => {
				const value = this.value.current;
				if (Array.isArray(value) && value.length) {
					const lastValue = value[value.length - 1];
					if (lastValue && this.placeholder.current !== lastValue) {
						this.placeholder.current = lastValue;
					}
				} else if (!Array.isArray(value) && value && this.placeholder.current !== value) {
					this.placeholder.current = value;
				}
			});
		});
	}

	setMonths(months: Month<DateValue>[]) {
		this.months = months;
	}

	/**
	 * This derived state holds an array of localized day names for the current
	 * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
	 * updating its content when the option changes. Using this state to render the
	 * calendar's days of the week is strongly recommended, as it guarantees that
	 * the days are correctly formatted for the current locale and calendar view.
	 */
	weekdays = $derived.by(() => {
		return getWeekdays({
			months: this.months,
			formatter: this.formatter,
			weekdayFormat: this.weekdayFormat.current,
		});
	});

	/**
	 * Navigates to the next page of the calendar.
	 */
	nextPage() {
		handleCalendarNextPage({
			fixedWeeks: this.fixedWeeks.current,
			locale: this.locale.current,
			numberOfMonths: this.numberOfMonths.current,
			pagedNavigation: this.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (date: DateValue) => (this.placeholder.current = date),
			weekStartsOn: this.weekStartsOn.current,
			months: this.months,
		});
	}

	/**
	 * Navigates to the previous page of the calendar.
	 */
	prevPage() {
		handleCalendarPrevPage({
			fixedWeeks: this.fixedWeeks.current,
			locale: this.locale.current,
			numberOfMonths: this.numberOfMonths.current,
			pagedNavigation: this.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (date: DateValue) => (this.placeholder.current = date),
			weekStartsOn: this.weekStartsOn.current,
			months: this.months,
		});
	}

	nextYear() {
		this.placeholder.current = this.placeholder.current.add({ years: 1 });
	}

	prevYear() {
		this.placeholder.current = this.placeholder.current.subtract({ years: 1 });
	}

	setYear(year: number) {
		this.placeholder.current = this.placeholder.current.set({ year });
	}

	setMonth(month: number) {
		this.placeholder.current = this.placeholder.current.set({ month });
	}

	isNextButtonDisabled = $derived.by(() => {
		return getIsNextButtonDisabled({
			maxValue: this.maxValue.current,
			months: this.months,
			disabled: this.disabled.current,
		});
	});

	isPrevButtonDisabled = $derived.by(() => {
		return getIsPrevButtonDisabled({
			minValue: this.minValue.current,
			months: this.months,
			disabled: this.disabled.current,
		});
	});

	isInvalid = $derived.by(() => {
		const value = this.value.current;
		const isDateDisabled = this.isDateDisabledProp.current;
		const isDateUnavailable = this.isDateUnavailableProp.current;
		if (Array.isArray(value)) {
			if (!value.length) return false;
			for (const date of value) {
				if (isDateDisabled(date)) return true;
				if (isDateUnavailable(date)) return true;
			}
		} else {
			if (!value) return false;
			if (isDateDisabled(value)) return true;
			if (isDateUnavailable(value)) return true;
		}
		return false;
	});

	headingValue = $derived.by(() => {
		return getCalendarHeadingValue({
			months: this.months,
			formatter: this.formatter,
			locale: this.locale.current,
		});
	});

	fullCalendarLabel = $derived.by(() => {
		return `${this.calendarLabel.current} ${this.headingValue}`;
	});

	isOutsideVisibleMonths(date: DateValue) {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	}

	isDateDisabled(date: DateValue) {
		if (this.isDateDisabledProp.current(date) || this.disabled.current) return true;
		const minValue = this.minValue.current;
		const maxValue = this.maxValue.current;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isBefore(maxValue, date)) return true;
		return false;
	}

	isDateSelected(date: DateValue) {
		const value = this.value.current;
		if (Array.isArray(value)) {
			return value.some((d) => isSameDay(d, date));
		} else if (!value) {
			return false;
		} else {
			return isSameDay(value, date);
		}
	}

	shiftFocus(node: HTMLElement, add: number) {
		return shiftCalendarFocus({
			node,
			add,
			placeholder: this.placeholder,
			calendarNode: this.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			months: this.months,
			numberOfMonths: this.numberOfMonths.current,
		});
	}

	handleCellClick(_: Event, date: DateValue) {
		const readonly = this.readonly.current;
		if (readonly) return;
		const isDateDisabled = this.isDateDisabledProp.current;
		const isDateUnavailable = this.isDateUnavailableProp.current;
		if (isDateDisabled?.(date) || isDateUnavailable?.(date)) return;

		const prev = this.value.current;
		const multiple = this.type.current === "multiple";
		if (multiple) {
			if (Array.isArray(prev) || prev === undefined) {
				this.value.current = this.handleMultipleUpdate(prev, date);
			}
		} else {
			if (!Array.isArray(prev)) {
				const next = this.handleSingleUpdate(prev, date);
				if (!next) {
					this.announcer.announce("Selected date is now empty.", "polite", 5000);
				} else {
					this.announcer.announce(
						`Selected Date: ${this.formatter.selectedDate(next, false)}`,
						"polite"
					);
				}
				this.value.current = next;
				if (next !== undefined) {
					this.onDateSelect?.current?.();
				}
			}
		}
	}

	handleMultipleUpdate(prev: DateValue[] | undefined, date: DateValue) {
		if (!prev) return [date];
		if (!Array.isArray(prev)) {
			if (DEV) throw new Error("Invalid value for multiple prop.");
			return;
		}
		const index = prev.findIndex((d) => isSameDay(d, date));
		const preventDeselect = this.preventDeselect.current;
		if (index === -1) {
			return [...prev, date];
		} else if (preventDeselect) {
			return prev;
		} else {
			const next = prev.filter((d) => !isSameDay(d, date));
			if (!next.length) {
				this.placeholder.current = date;
				return undefined;
			}
			return next;
		}
	}

	handleSingleUpdate(prev: DateValue | undefined, date: DateValue) {
		if (Array.isArray(prev)) {
			if (DEV) throw new Error("Invalid value for single prop.");
		}
		if (!prev) return date;
		const preventDeselect = this.preventDeselect.current;
		if (!preventDeselect && isSameDay(prev, date)) {
			this.placeholder.current = date;
			return undefined;
		}
		return date;
	}

	onkeydown(event: BitsKeyboardEvent) {
		handleCalendarKeydown({
			event,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.placeholder.current,
		});
	}

	snippetProps = $derived.by(() => ({
		months: this.months,
		weekdays: this.weekdays,
	}));

	getBitsAttr(part: CalendarParts) {
		return `data-bits-calendar-${part}`;
	}

	props = $derived.by(
		() =>
			({
				...getCalendarElementProps({
					fullCalendarLabel: this.fullCalendarLabel,
					id: this.id.current,
					isInvalid: this.isInvalid,
					disabled: this.disabled.current,
					readonly: this.readonly.current,
				}),
				[this.getBitsAttr("root")]: "",
				//
				onkeydown: this.onkeydown,
			}) as const
	);
}

export type CalendarHeadingStateProps = WithRefProps;
export class CalendarHeadingState {
	id: CalendarHeadingStateProps["id"];
	ref: CalendarHeadingStateProps["ref"];
	headingValue = $derived.by(() => this.root.headingValue);

	constructor(
		props: CalendarHeadingStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"aria-hidden": getAriaHidden(true),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				"data-readonly": getDataReadonly(this.root.readonly.current),
				[this.root.getBitsAttr("heading")]: "",
			}) as const
	);
}

type CalendarCellStateProps = WithRefProps<
	ReadableBoxedValues<{
		date: DateValue;
		month: DateValue;
	}>
>;

class CalendarCellState {
	id: CalendarCellStateProps["id"];
	ref: CalendarCellStateProps["ref"];
	date: CalendarCellStateProps["date"];
	month: CalendarCellStateProps["month"];
	cellDate = $derived.by(() => toDate(this.date.current));
	isDisabled = $derived.by(() => this.root.isDateDisabled(this.date.current));
	isUnavailable = $derived.by(() => this.root.isDateUnavailableProp.current(this.date.current));
	isDateToday = $derived.by(() => isToday(this.date.current, getLocalTimeZone()));
	isOutsideMonth = $derived.by(() => !isSameMonth(this.date.current, this.month.current));
	isOutsideVisibleMonths = $derived.by(() => this.root.isOutsideVisibleMonths(this.date.current));
	isFocusedDate = $derived.by(() => isSameDay(this.date.current, this.root.placeholder.current));
	isSelectedDate = $derived.by(() => this.root.isDateSelected(this.date.current));
	labelText = $derived.by(() =>
		this.root.formatter.custom(this.cellDate, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	);

	constructor(
		props: CalendarCellStateProps,
		readonly root: CalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.date = props.date;
		this.month = props.month;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	snippetProps = $derived.by(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
	}));

	ariaDisabled = $derived.by(() => {
		return (
			this.isDisabled ||
			(this.isOutsideMonth && this.root.disableDaysOutsideMonth.current) ||
			this.isUnavailable
		);
	});

	sharedDataAttrs = $derived.by(
		() =>
			({
				"data-unavailable": getDataUnavailable(this.isUnavailable),
				"data-today": this.isDateToday ? "" : undefined,
				"data-outside-month": this.isOutsideMonth ? "" : undefined,
				"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : undefined,
				"data-focused": this.isFocusedDate ? "" : undefined,
				"data-selected": getDataSelected(this.isSelectedDate),
				"data-value": this.date.current.toString(),
				"data-disabled": getDataDisabled(
					this.isDisabled ||
						(this.isOutsideMonth && this.root.disableDaysOutsideMonth.current)
				),
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "gridcell",
				"aria-selected": getAriaSelected(this.isSelectedDate),
				"aria-disabled": getAriaDisabled(this.ariaDisabled),
				...this.sharedDataAttrs,
				[this.root.getBitsAttr("cell")]: "",
			}) as const
	);
}

type CalendarDayStateProps = WithRefProps;

class CalendarDayState {
	id: CalendarDayStateProps["id"];
	ref: CalendarDayStateProps["ref"];

	constructor(
		props: CalendarDayStateProps,
		readonly cell: CalendarCellState
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	#tabindex = $derived.by(() =>
		this.cell.isFocusedDate
			? 0
			: (this.cell.isOutsideMonth && this.cell.root.disableDaysOutsideMonth.current) ||
				  this.cell.isDisabled
				? undefined
				: -1
	);

	onclick(e: BitsMouseEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.handleCellClick(e, this.cell.date.current);
	}

	snippetProps = $derived.by(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.date.current.day}`,
	}));

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "button",
				"aria-label": this.cell.labelText,
				"aria-disabled": getAriaDisabled(this.cell.ariaDisabled),
				...this.cell.sharedDataAttrs,
				tabindex: this.#tabindex,
				[this.cell.root.getBitsAttr("day")]: "",
				// Shared logic for range calendar and calendar
				"data-bits-day": "",
				//
				onclick: this.onclick,
			}) as const
	);
}

export type CalendarNextButtonStateProps = WithRefProps;

export class CalendarNextButtonState {
	id: CalendarNextButtonStateProps["id"];
	ref: CalendarNextButtonStateProps["ref"];
	isDisabled = $derived.by(() => this.root.isNextButtonDisabled);

	constructor(
		props: CalendarNextButtonStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	onclick(_: BitsMouseEvent) {
		if (this.isDisabled) return;
		this.root.nextPage();
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "button",
				type: "button",
				"aria-label": "Next",
				"aria-disabled": getAriaDisabled(this.isDisabled),
				"data-disabled": getDataDisabled(this.isDisabled),
				disabled: this.isDisabled,
				[this.root.getBitsAttr("next-button")]: "",
				//
				onclick: this.onclick,
			}) as const
	);
}

export type CalendarPrevButtonStateProps = WithRefProps;

export class CalendarPrevButtonState {
	id: CalendarPrevButtonStateProps["id"];
	ref: CalendarPrevButtonStateProps["ref"];
	isDisabled = $derived.by(() => this.root.isPrevButtonDisabled);

	constructor(
		props: CalendarPrevButtonStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	onclick(_: BitsMouseEvent) {
		if (this.isDisabled) return;
		this.root.prevPage();
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "button",
				type: "button",
				"aria-label": "Previous",
				"aria-disabled": getAriaDisabled(this.isDisabled),
				"data-disabled": getDataDisabled(this.isDisabled),
				disabled: this.isDisabled,
				[this.root.getBitsAttr("prev-button")]: "",
				//
				onclick: this.onclick,
			}) as const
	);
}

export type CalendarGridStateProps = WithRefProps;

export class CalendarGridState {
	id: CalendarGridStateProps["id"];
	ref: CalendarGridStateProps["ref"];

	constructor(
		props: CalendarGridStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				tabindex: -1,
				role: "grid",
				"aria-readonly": getAriaReadonly(this.root.readonly.current),
				"aria-disabled": getAriaDisabled(this.root.disabled.current),
				"data-readonly": getDataReadonly(this.root.readonly.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[this.root.getBitsAttr("grid")]: "",
			}) as const
	);
}

export type CalendarGridBodyStateProps = WithRefProps;

export class CalendarGridBodyState {
	id: CalendarGridBodyStateProps["id"];
	ref: CalendarGridBodyStateProps["ref"];

	constructor(
		props: CalendarGridBodyStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-disabled": getDataDisabled(this.root.disabled.current),
				"data-readonly": getDataReadonly(this.root.readonly.current),
				[this.root.getBitsAttr("grid-body")]: "",
			}) as const
	);
}

export type CalendarGridHeadStateProps = WithRefProps;

export class CalendarGridHeadState {
	id: CalendarGridHeadStateProps["id"];
	ref: CalendarGridHeadStateProps["ref"];

	constructor(
		props: CalendarGridHeadStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-disabled": getDataDisabled(this.root.disabled.current),
				"data-readonly": getDataReadonly(this.root.readonly.current),
				[this.root.getBitsAttr("grid-head")]: "",
			}) as const
	);
}

export type CalendarGridRowStateProps = WithRefProps;

export class CalendarGridRowState {
	id: CalendarGridRowStateProps["id"];
	ref: CalendarGridRowStateProps["ref"];

	constructor(
		props: CalendarGridRowStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-disabled": getDataDisabled(this.root.disabled.current),
				"data-readonly": getDataReadonly(this.root.readonly.current),
				[this.root.getBitsAttr("grid-row")]: "",
			}) as const
	);
}

export type CalendarHeadCellStateProps = WithRefProps;

export class CalendarHeadCellState {
	id: CalendarHeadCellStateProps["id"];
	ref: CalendarHeadCellStateProps["ref"];

	constructor(
		props: CalendarHeadCellStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-disabled": getDataDisabled(this.root.disabled.current),
				"data-readonly": getDataReadonly(this.root.readonly.current),
				[this.root.getBitsAttr("head-cell")]: "",
			}) as const
	);
}

export type CalendarHeaderStateProps = WithRefProps;

export class CalendarHeaderState {
	id: CalendarHeaderStateProps["id"];
	ref: CalendarHeaderStateProps["ref"];

	constructor(
		props: CalendarHeaderStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-disabled": getDataDisabled(this.root.disabled.current),
				"data-readonly": getDataReadonly(this.root.readonly.current),
				[this.root.getBitsAttr("header")]: "",
			}) as const
	);
}

export const CalendarRootContext = new Context<CalendarRootState | RangeCalendarRootState>(
	"Calendar.Root | RangeCalender.Root"
);

const CalendarCellContext = new Context<CalendarCellState>("Calendar.Cell | RangeCalendar.Cell");

export function useCalendarRoot(props: CalendarRootStateProps) {
	return CalendarRootContext.set(new CalendarRootState(props));
}

export function useCalendarGrid(props: CalendarGridStateProps) {
	return new CalendarGridState(props, CalendarRootContext.get());
}

export function useCalendarCell(props: CalendarCellStateProps) {
	return CalendarCellContext.set(
		new CalendarCellState(props, CalendarRootContext.get() as CalendarRootState)
	);
}

export function useCalendarNextButton(props: CalendarNextButtonStateProps) {
	return new CalendarNextButtonState(props, CalendarRootContext.get());
}

export function useCalendarPrevButton(props: CalendarPrevButtonStateProps) {
	return new CalendarPrevButtonState(props, CalendarRootContext.get());
}

export function useCalendarDay(props: CalendarDayStateProps) {
	return new CalendarDayState(props, CalendarCellContext.get());
}

export function useCalendarGridBody(props: CalendarGridBodyStateProps) {
	return new CalendarGridBodyState(props, CalendarRootContext.get());
}

export function useCalendarGridHead(props: CalendarGridHeadStateProps) {
	return new CalendarGridHeadState(props, CalendarRootContext.get());
}

export function useCalendarGridRow(props: CalendarGridRowStateProps) {
	return new CalendarGridRowState(props, CalendarRootContext.get());
}

export function useCalendarHeadCell(props: CalendarHeadCellStateProps) {
	return new CalendarHeadCellState(props, CalendarRootContext.get());
}

export function useCalendarHeader(props: CalendarHeaderStateProps) {
	return new CalendarHeaderState(props, CalendarRootContext.get());
}

export function useCalendarHeading(props: CalendarHeadingStateProps) {
	return new CalendarHeadingState(props, CalendarRootContext.get());
}
