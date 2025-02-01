import type { DateValue } from "@internationalized/date";
import { Context } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { DateMatcher, SegmentPart } from "$lib/shared/index.js";
import type { Granularity, HourCycle, WeekStartsOn } from "$lib/shared/date/types.js";

type DatePickerRootStateProps = WritableBoxedValues<{
	value: DateValue | undefined;
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
		initialFocus: boolean;
		onDateSelect?: () => void;
	}>;

class DatePickerRootState {
	constructor(readonly props: DatePickerRootStateProps) {}
}

export const DatePickerRootContext = new Context<DatePickerRootState>("DatePicker.Root");

export function useDatePickerRoot(props: DatePickerRootStateProps) {
	return DatePickerRootContext.set(new DatePickerRootState(props));
}
