import type {
	DateRangePickerCalendarPropsWithoutHTML,
	DateRangePickerInputPropsWithoutHTML,
	DateRangePickerRootPropsWithoutHTML,
} from "bits-ui";
import { label, root as rangeFieldRoot, segment } from "./date-range-field.api.js";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	withChildProps,
} from "./helpers.js";
import { content, trigger } from "./popover.api.js";
import {
	root as calendarRoot,
	cell,
	day,
	grid,
	gridBody,
	gridHead,
	gridRow,
	headCell,
	header,
	heading,
	nextButton,
	prevButton,
} from "./calendar.api.js";
import { root as rangeCalendarRoot } from "./range-calendar.api.js";
import { root as datePickerRoot } from "./date-picker.api.js";
import { DateRangeFieldInputTypeProp } from "./extended-types/date-range-field/index.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<DateRangePickerRootPropsWithoutHTML>({
	title: "Root",
	description: "The root date picker component.",
	props: {
		value: rangeFieldRoot.props!.value,
		onValueChange: rangeFieldRoot.props!.onValueChange,
		placeholder: rangeFieldRoot.props!.placeholder,
		onPlaceholderChange: rangeFieldRoot.props!.onPlaceholderChange,
		readonlySegments: rangeFieldRoot.props!.readonlySegments,
		isDateUnavailable: calendarRoot.props!.isDateUnavailable,
		minValue: rangeFieldRoot.props!.minValue,
		maxValue: rangeFieldRoot.props!.maxValue,
		validate: rangeFieldRoot.props!.validate,
		onInvalid: rangeFieldRoot.props!.onInvalid,
		granularity: rangeFieldRoot.props!.granularity,
		hideTimeZone: rangeFieldRoot.props!.hideTimeZone,
		errorMessageId: rangeFieldRoot.props!.errorMessageId,
		hourCycle: rangeFieldRoot.props!.hourCycle,
		locale: rangeFieldRoot.props!.locale,
		disabled: rangeFieldRoot.props!.disabled,
		readonly: rangeFieldRoot.props!.readonly,
		required: rangeFieldRoot.props!.required,
		closeOnRangeSelect: createBooleanProp({
			default: C.TRUE,
			description: "Whether or not to close the popover when a date range is selected.",
		}),
		disableDaysOutsideMonth: rangeCalendarRoot.props!.disableDaysOutsideMonth,
		pagedNavigation: rangeCalendarRoot.props!.pagedNavigation,
		preventDeselect: rangeCalendarRoot.props!.preventDeselect,
		weekdayFormat: rangeCalendarRoot.props!.weekdayFormat,
		weekStartsOn: rangeCalendarRoot.props!.weekStartsOn,
		calendarLabel: rangeCalendarRoot.props!.calendarLabel,
		fixedWeeks: rangeCalendarRoot.props!.fixedWeeks,
		isDateDisabled: rangeCalendarRoot.props!.isDateDisabled,
		numberOfMonths: rangeCalendarRoot.props!.numberOfMonths,
		open: datePickerRoot.props!.open,
		onOpenChange: datePickerRoot.props!.onOpenChange,
		onEndValueChange: rangeFieldRoot.props!.onEndValueChange,
		onStartValueChange: rangeFieldRoot.props!.onStartValueChange,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the root element when the calendar is invalid.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the root element when the calendar is disabled.",
		}),
		createDataAttrSchema({
			name: "readonly",
			description: "Present on the root element when the calendar is readonly.",
		}),
		createDataAttrSchema({
			name: "calendar-root",
			description: "Present on the root element.",
		}),
	],
});

const calendar = createApiSchema<DateRangePickerCalendarPropsWithoutHTML>({
	title: "Calendar",
	description: "The calendar component containing the grids of dates.",
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the root element when the calendar is invalid.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the root element when the calendar is disabled.",
		}),
		createDataAttrSchema({
			name: "readonly",
			description: "Present on the root element when the calendar is readonly.",
		}),
		createDataAttrSchema({
			name: "calendar-root",
			description: "Present on the root element.",
		}),
	],
});

const input = createApiSchema<DateRangePickerInputPropsWithoutHTML>({
	title: "Input",
	description: "The field input component which contains the segments of the date field.",
	props: {
		name: {
			type: C.STRING,
			description:
				"The name of the input field used for form submission. If provided a hidden input will be rendered alongside the field.",
		},
		type: createEnumProp({
			options: ["start", "end"],
			description: "The type of field to render (start or end).",
			required: true,
			definition: DateRangeFieldInputTypeProp,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the element when the field is invalid.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the element when the field is disabled.",
		}),
		createDataAttrSchema({
			name: "date-field-input",
			description: "Present on the element.",
		}),
	],
});

export const dateRangePicker = [
	root,
	label,
	input,
	segment,
	trigger,
	content,
	calendar,
	header,
	prevButton,
	heading,
	nextButton,
	grid,
	gridRow,
	gridHead,
	headCell,
	gridBody,
	cell,
	day,
];
