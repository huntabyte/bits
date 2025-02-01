import type { DateValue } from "@internationalized/date";
import { Context } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { DateMatcher, DateRange, SegmentPart } from "$lib/shared/index.js";
import type { Granularity, HourCycle, WeekStartsOn } from "$lib/shared/date/types.js";

type DateRangePickerRootStateProps = WritableBoxedValues<{
	value: DateRange;
	startValue: DateValue | undefined;
	endValue: DateValue | undefined;
	open: boolean;
	placeholder: DateValue;
}> &
	ReadableBoxedValues<{
		readonlySegments: SegmentPart[];
		isDateUnavailable: DateMatcher;
		isDateDisabled: DateMatcher;
		minValue: DateValue | undefined;
		maxValue: DateValue | undefined;
		disabled: boolean;
		readonly: boolean;
		granularity: Granularity | undefined;
		hourCycle: HourCycle | undefined;
		locale: string;
		hideTimeZone: boolean;
		required: boolean;
		preventDeselect: boolean;
		pagedNavigation: boolean;
		weekStartsOn: WeekStartsOn;
		weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
		fixedWeeks: boolean;
		numberOfMonths: number;
		calendarLabel: string;
		disableDaysOutsideMonth: boolean;
		onRangeSelect?: () => void;
	}>;

class DateRangePickerRootState {
	constructor(readonly props: DateRangePickerRootStateProps) {}
}

export const DateRangePickerRootContext = new Context<DateRangePickerRootState>(
	"DateRangePicker.Root"
);

export function useDateRangePickerRoot(props: DateRangePickerRootStateProps) {
	return DateRangePickerRootContext.set(new DateRangePickerRootState(props));
}
