import { afterTick } from "$lib/internal/afterTick.js";
import { isValidIndex } from "$lib/internal/arrays.js";
import {
	getAriaDisabled,
	getAriaHidden,
	getAriaSelected,
	getDataDisabled,
	getDataInvalid,
	getDataReadonly,
	getDataSelected,
	getDataUnavailable,
} from "$lib/internal/attrs.js";
import {
	watch,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { styleToString } from "$lib/internal/style.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useId } from "$lib/internal/useId.svelte.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { getAnnouncer, type Announcer } from "$lib/shared/date/announcer.js";
import {
	createMonths,
	getSelectableCells,
	isCalendarCell,
	setPlaceholderToNodeValue,
} from "$lib/shared/date/calendar-helpers.svelte.js";
import { createFormatter, type Formatter } from "$lib/shared/date/formatter.js";
import type { Month } from "$lib/shared/date/types.js";
import { isAfter, isBefore, parseStringToDateValue, toDate } from "$lib/shared/date/utils.js";
import {
	getLocalTimeZone,
	isSameDay,
	isSameMonth,
	isToday,
	type DateValue,
} from "@internationalized/date";
import { DEV } from "esm-env";
import { untrack } from "svelte";

const ARROW_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.ARROW_LEFT, kbd.ARROW_RIGHT];
const SELECT_KEYS = [kbd.ENTER, kbd.SPACE];

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
			isDateDisabled: (date: DateValue) => boolean;
			isDateUnavailable: (date: DateValue) => boolean;
			fixedWeeks: boolean;
			numberOfMonths: number;
			locale: string;
			calendarLabel: string;
			type: "single" | "multiple";
			readonly: boolean;
		}>
>;

class CalendarRootState {
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

		this.announcer = getAnnouncer();
		this.formatter = createFormatter(this.locale.value);

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		this.months = createMonths({
			dateObj: this.placeholder.value,
			weekStartsOn: this.weekStartsOn.value,
			locale: this.locale.value,
			fixedWeeks: this.fixedWeeks.value,
			numberOfMonths: this.numberOfMonths.value,
		});

		$effect(() => {
			if (!this.ref.value) return;
			const removeHeading = this.#createAccessibleHeading(
				this.ref.value,
				this.fullCalendarLabel
			);
			return removeHeading;
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.locale.value) return;
			this.formatter.setLocale(this.locale.value);
		});

		watch(this.placeholder, () => {
			/**
			 * If the placeholder's month is already in this visible months,
			 * we don't need to do anything.
			 */
			if (this.visibleMonths.some((month) => isSameMonth(month, this.placeholder.value))) {
				return;
			}

			const defaultMonthProps = {
				weekStartsOn: this.weekStartsOn.value,
				locale: this.locale.value,
				fixedWeeks: this.fixedWeeks.value,
				numberOfMonths: this.numberOfMonths.value,
			};

			this.months = createMonths({ ...defaultMonthProps, dateObj: this.placeholder.value });
		});

		/**
		 * Updates the displayed months based on changes in the options values,
		 * which determines the month to show in the calendar.
		 */
		$effect(() => {
			const weekStartsOn = this.weekStartsOn.value;
			const locale = this.locale.value;
			const fixedWeeks = this.fixedWeeks.value;
			const numberOfMonths = this.numberOfMonths.value;

			untrack(() => {
				const placeholder = this.placeholder.value;
				if (!placeholder) return;
				const defaultMonthProps = {
					weekStartsOn,
					locale,
					fixedWeeks,
					numberOfMonths,
				};

				this.months = createMonths({ ...defaultMonthProps, dateObj: placeholder });
			});
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
		watch(this.value, () => {
			const value = this.value.value;
			if (Array.isArray(value) && value.length) {
				const lastValue = value[value.length - 1];
				if (lastValue && this.placeholder.value !== lastValue) {
					this.placeholder.value = lastValue;
				}
			} else if (!Array.isArray(value) && value && this.placeholder.value !== value) {
				this.placeholder.value = value;
			}
		});
	}

	/**
	 * This derived store holds an array of localized day names for the current
	 * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
	 * updating its content when the option changes. Using this store to render the
	 * calendar's days of the week is strongly recommended, as it guarantees that
	 * the days are correctly formatted for the current locale and calendar view.
	 */
	weekdays = $derived.by(() => {
		if (!this.months.length) return [];
		const firstMonth = this.months[0];
		if (!firstMonth) return [];
		const firstWeek = firstMonth.weeks[0];
		if (!firstWeek) return [];
		return firstWeek.map((date) =>
			this.formatter.dayOfWeek(toDate(date), this.weekdayFormat.value)
		);
	});

	/**
	 * Navigates to the next page of the calendar.
	 */
	nextPage() {
		const months = this.months;
		const numberOfMonths = this.numberOfMonths.value;
		const pagedNavigation = this.pagedNavigation.value;
		const firstMonth = months[0]?.value;
		if (!firstMonth) return;
		if (pagedNavigation) {
			this.placeholder.value = firstMonth.add({ months: numberOfMonths });
		} else {
			const newMonths = createMonths({
				dateObj: firstMonth.add({ months: 1 }),
				weekStartsOn: this.weekStartsOn.value,
				locale: this.locale.value,
				fixedWeeks: this.fixedWeeks.value,
				numberOfMonths,
			});

			this.months = newMonths;
			this.placeholder.value = firstMonth.set({ day: 1 });
		}
	}

	/**
	 * Navigates to the previous page of the calendar.
	 */
	prevPage() {
		const months = this.months;
		const numberOfMonths = this.numberOfMonths.value;
		const pagedNavigation = this.pagedNavigation.value;
		const firstMonth = months[0]?.value;
		if (!firstMonth) return;
		if (pagedNavigation) {
			this.placeholder.value = firstMonth.subtract({ months: numberOfMonths });
		} else {
			const newMonths = createMonths({
				dateObj: firstMonth.subtract({ months: 1 }),
				weekStartsOn: this.weekStartsOn.value,
				locale: this.locale.value,
				fixedWeeks: this.fixedWeeks.value,
				numberOfMonths,
			});

			this.months = newMonths;
			this.placeholder.value = firstMonth.set({ day: 1 });
		}
	}

	nextYear() {
		this.placeholder.value = this.placeholder.value.add({ years: 1 });
	}

	prevYear() {
		this.placeholder.value = this.placeholder.value.subtract({ years: 1 });
	}

	setYear(year: number) {
		this.placeholder.value = this.placeholder.value.set({ year });
	}

	setMonth(month: number) {
		this.placeholder.value = this.placeholder.value.set({ month });
	}

	#createAccessibleHeading(node: HTMLElement, label: string) {
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
		const h2 = document.createElement("h2");
		h2.textContent = label;
		h2.id = this.accessibleHeadingId;
		h2.role = "heading";
		h2.ariaLevel = "2";
		node.insertBefore(div, node.firstChild);
		div.appendChild(h2);

		// return a function that removes the two created elements
		return () => {
			const h2 = document.getElementById(this.accessibleHeadingId);
			if (!h2) return;
			div.parentElement?.removeChild(div);
			h2.remove();
		};
	}

	isNextButtonDisabled = $derived.by(() => {
		if (!this.maxValue.value || !this.months.length) return false;
		if (this.disabled.value) return true;
		const lastMonthInView = this.months[this.months.length - 1]?.value;
		if (lastMonthInView === undefined) return false;
		const firstMonthOfNextPage = lastMonthInView.add({ months: 1 }).set({ day: 1 });
		return isAfter(firstMonthOfNextPage, this.maxValue.value);
	});

	isPrevButtonDisabled = $derived.by(() => {
		if (!this.minValue.value || !this.months.length) return false;
		if (this.disabled.value) return true;
		const firstMonthInView = this.months[0]?.value;
		if (firstMonthInView === undefined) return false;
		const lastMonthOfPrevPage = firstMonthInView.subtract({ months: 1 }).set({ day: 1 });
		return isBefore(lastMonthOfPrevPage, this.minValue.value);
	});

	isInvalid = $derived.by(() => {
		const value = this.value.value;
		const isDateDisabled = this.isDateDisabledProp.value;
		const isDateUnavailable = this.isDateUnavailableProp.value;
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
		if (!this.months.length) return "";
		if (this.locale.value !== this.formatter.getLocale()) {
			this.formatter.setLocale(this.locale.value);
		}

		if (this.months.length === 1) {
			const month = this.months[0];
			if (!month) return "";
			return `${this.formatter.fullMonthAndYear(toDate(month.value))}`;
		}
		const firstMonth = this.months[0];
		const lastMonth = this.months[this.months.length - 1];
		if (!firstMonth || !lastMonth) return "";

		const startMonth = toDate(firstMonth.value);
		const endMonth = toDate(lastMonth.value);

		const startMonthName = this.formatter.fullMonth(startMonth);
		const endMonthName = this.formatter.fullMonth(endMonth);
		const startMonthYear = this.formatter.fullYear(startMonth);
		const endMonthYear = this.formatter.fullYear(endMonth);

		const content =
			startMonthYear === endMonthYear
				? `${startMonthName} - ${endMonthName} ${endMonthYear}`
				: `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;
		return content;
	});

	fullCalendarLabel = $derived.by(() => {
		return `${this.calendarLabel.value} ${this.headingValue}`;
	});

	isOutsideVisibleMonths(date: DateValue) {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	}

	isDateDisabled(date: DateValue) {
		if (this.isDateDisabledProp.value(date) || this.disabled.value) return true;
		const minValue = this.minValue.value;
		const maxValue = this.maxValue.value;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isBefore(maxValue, date)) return true;
		return false;
	}

	isDateSelected(date: DateValue) {
		const value = this.value.value;
		if (Array.isArray(value)) {
			return value.some((d) => isSameDay(d, date));
		} else if (!value) {
			return false;
		} else {
			return isSameDay(value, date);
		}
	}

	#shiftFocus(node: HTMLElement, add: number) {
		const candidateCells = getSelectableCells(this.id.value);
		if (!candidateCells.length) return;

		const index = candidateCells.indexOf(node);
		const nextIndex = index + add;

		/**
		 * If the next cell is within the bounds of the displayed cells,
		 * easy day, we just focus it.
		 */
		if (isValidIndex(nextIndex, candidateCells)) {
			const nextCell = candidateCells[nextIndex]!;
			setPlaceholderToNodeValue(nextCell, this.placeholder);
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
			if (this.isPrevButtonDisabled) return;

			const months = this.months;
			const firstMonth = months[0]?.value;
			if (!firstMonth) return;
			const numberOfMonths = this.numberOfMonths.value;
			this.placeholder.value = firstMonth.subtract({ months: numberOfMonths });

			// Without a tick here, it seems to be too quick for the DOM to update

			afterTick(() => {
				const newCandidateCells = getSelectableCells(this.id.value);
				if (!newCandidateCells.length) return;

				/**
				 * Starting at the end of the array, shift focus by the diff
				 * between the nextIndex and the length of the array, since the
				 * nextIndex is negative.
				 */
				const newIndex = newCandidateCells.length - Math.abs(nextIndex);
				if (isValidIndex(newIndex, newCandidateCells)) {
					const newCell = newCandidateCells[newIndex]!;
					setPlaceholderToNodeValue(newCell, this.placeholder);
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

			// shift the calendard forward a month unless next month is disabled
			if (this.isNextButtonDisabled) return;

			const months = this.months;
			const firstMonth = months[0]?.value;
			if (!firstMonth) return;
			const numberOfMonths = this.numberOfMonths.value;
			this.placeholder.value = firstMonth.add({ months: numberOfMonths });

			afterTick(() => {
				const newCandidateCells = getSelectableCells(this.id.value);
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

	handleCellClick = (date: DateValue) => {
		const readonly = this.readonly.value;
		if (readonly) return;
		const isDateDisabled = this.isDateDisabledProp.value;
		const isDateUnavailable = this.isDateUnavailableProp.value;
		if (isDateDisabled?.(date) || isDateUnavailable?.(date)) return;

		const prev = this.value.value;
		const multiple = this.type.value === "multiple";
		if (multiple) {
			if (Array.isArray(prev) || prev === undefined) {
				this.value.value = this.#handleMultipleUpdate(prev, date);
			}
			return;
		} else {
			if (!Array.isArray(prev)) {
				const next = this.#handleSingleUpdate(prev, date);
				if (!next) {
					this.announcer.announce("Selected date is now empty.", "polite", 5000);
				} else {
					this.announcer.announce(
						`Selected Date: ${this.formatter.selectedDate(next, false)}`,
						"polite"
					);
				}
				this.value.value = next;
			}
		}
	};

	#handleMultipleUpdate(prev: DateValue[] | undefined, date: DateValue) {
		if (!prev) return [date];
		if (!Array.isArray(prev)) {
			if (DEV) throw new Error("Invalid value for multiple prop.");
			return;
		}
		const index = prev.findIndex((d) => isSameDay(d, date));
		const preventDeselect = this.preventDeselect.value;
		if (index === -1) {
			return [...prev, date];
		} else if (preventDeselect) {
			return prev;
		} else {
			const next = prev.filter((d) => !isSameDay(d, date));
			if (!next.length) {
				this.placeholder.value = date;
				return undefined;
			}
			return next;
		}
	}

	#handleSingleUpdate(prev: DateValue | undefined, date: DateValue) {
		if (Array.isArray(prev)) {
			if (DEV) throw new Error("Invalid value for single prop.");
		}
		if (!prev) return date;
		const preventDeselect = this.preventDeselect.value;
		if (!preventDeselect && isSameDay(prev, date)) {
			this.placeholder.value = date;
			return undefined;
		}
		return date;
	}

	#onkeydown = (e: KeyboardEvent) => {
		const currentCell = e.target;
		if (!isCalendarCell(currentCell)) return;
		if (!ARROW_KEYS.includes(e.key) && !SELECT_KEYS.includes(e.key)) return;

		e.preventDefault();

		if (e.key === kbd.ARROW_DOWN) {
			this.#shiftFocus(currentCell, 7);
		}
		if (e.key === kbd.ARROW_UP) {
			this.#shiftFocus(currentCell, -7);
		}
		if (e.key === kbd.ARROW_LEFT) {
			this.#shiftFocus(currentCell, -1);
		}
		if (e.key === kbd.ARROW_RIGHT) {
			this.#shiftFocus(currentCell, 1);
		}

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			const cellValue = currentCell.getAttribute("data-value");
			if (!cellValue) return;

			this.handleCellClick(parseStringToDateValue(cellValue, this.placeholder.value));
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "application",
				"aria-label": this.fullCalendarLabel,
				"data-invalid": getDataInvalid(this.isInvalid),
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-readonly": getDataReadonly(this.readonly.value),
				//
				onkeydown: this.#onkeydown,
			}) as const
	);

	createHeading(props: CalendarHeadingStateProps) {
		return new CalendarHeadingState(props, this);
	}
}

type CalendarHeadingStateProps = WithRefProps;
class CalendarHeadingState {
	id: CalendarHeadingStateProps["id"];
	ref: CalendarHeadingStateProps["ref"];

	constructor(
		props: CalendarHeadingStateProps,
		readonly root: CalendarRootState
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
				id: this.id.value,
				"aria-hidden": getAriaHidden(true),
				"data-disabled": getDataDisabled(this.root.disabled.value),
			}) as const
	);
}

type CalendarCellStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: DateValue;
		month: DateValue;
	}>
>;

class CalendarCellState {
	id: CalendarCellStateProps["id"];
	ref: CalendarCellStateProps["ref"];
	value: CalendarCellStateProps["value"];
	month: CalendarCellStateProps["month"];
	cellDate = $derived.by(() => toDate(this.value.value));
	isDisabled = $derived.by(() => this.root.isDateDisabledProp.value(this.value.value));
	isUnvailable = $derived.by(() => this.root.isDateUnavailableProp.value(this.value.value));
	isDateToday = $derived.by(() => isToday(this.value.value, getLocalTimeZone()));
	isOutsideMonth = $derived.by(() => !isSameMonth(this.value.value, this.month.value));
	isOutsideVisibleMonths = $derived.by(() => this.root.isOutsideVisibleMonths(this.value.value));
	isFocusedDate = $derived.by(() => isSameDay(this.value.value, this.root.placeholder.value));
	isSelectedDate = $derived.by(() => this.root.isDateSelected(this.value.value));
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
		this.value = props.value;
		this.month = props.month;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	#tabindex = $derived.by(() =>
		this.isFocusedDate ? 0 : this.isOutsideMonth || this.isDisabled ? undefined : -1
	);

	#onclick = () => {
		if (this.isDisabled) return;
		this.root.handleCellClick(this.value.value);
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "button",
				"aria-label": this.labelText,
				"aria-selected": getAriaSelected(this.isSelectedDate),
				"aria-disabled": getAriaDisabled(
					this.isDisabled || this.isOutsideMonth || this.isUnvailable
				),
				"data-selected": getDataSelected(this.isSelectedDate),
				"data-value": this.value.value.toString(),
				"data-disabled": getDataDisabled(this.isDisabled),
				"data-unavailable": getDataUnavailable(this.isUnvailable),
				"data-today": this.isDateToday ? "" : undefined,
				"data-outside-month": this.isOutsideMonth ? "" : undefined,
				"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : undefined,
				"data-focused": this.isFocusedDate ? "" : undefined,
				tabindex: this.#tabindex,
				//
				onclick: this.#onclick,
			}) as const
	);
}

type CalendarNextButtonStateProps = WithRefProps;

class CalendarNextButtonState {
	id: CalendarNextButtonStateProps["id"];
	ref: CalendarNextButtonStateProps["ref"];
	isDisabled = $derived.by(() => this.root.isNextButtonDisabled);

	constructor(
		props: CalendarNextButtonStateProps,
		readonly root: CalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	#onclick = () => {
		if (this.isDisabled) return;
		this.root.nextPage();
	};

	props = $derived.by(
		() =>
			({
				role: "button",
				type: "button",
				"aria-label": "Next",
				"aria-disabled": getAriaDisabled(this.isDisabled),
				"data-disabled": getDataDisabled(this.isDisabled),
				disabled: this.isDisabled,
				//
				onclick: this.#onclick,
			}) as const
	);
}

type CalendarPrevButtonStateProps = WithRefProps;

class CalendarPrevButtonState {
	id: CalendarPrevButtonStateProps["id"];
	ref: CalendarPrevButtonStateProps["ref"];
	isDisabled = $derived.by(() => this.root.isPrevButtonDisabled);

	constructor(
		props: CalendarPrevButtonStateProps,
		readonly root: CalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	#onclick = () => {
		if (this.isDisabled) return;
		this.root.prevPage();
	};

	props = $derived.by(
		() =>
			({
				role: "button",
				type: "button",
				"aria-label": "Previous",
				"aria-disabled": getAriaDisabled(this.isDisabled),
				"data-disabled": getDataDisabled(this.isDisabled),
				disabled: this.isDisabled,
				//
				onclick: this.#onclick,
			}) as const
	);
}
