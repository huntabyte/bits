import type {
	DatePickerCalendarPropsWithoutHTML,
	DatePickerInputPropsWithoutHTML,
	DatePickerRootPropsWithoutHTML,
} from "bits-ui";
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
import {
	input as dateFieldInput,
	root as dateFieldRoot,
	label,
	segment,
} from "./date-field.api.js";
import {
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createFunctionProp,
	createPropSchema,
	withChildProps,
} from "./helpers.js";
import { content, trigger } from "./popover.api.js";
import { OnOpenChangeProp } from "./extended-types/shared/index.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<DatePickerRootPropsWithoutHTML>({
	title: "Root",
	description: "The root date picker component.",
	props: {
		value: calendarRoot.props!.value,
		onValueChange: calendarRoot.props!.onValueChange,
		open: createBooleanProp({
			default: C.FALSE,
			description: "The open state of the popover content.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: OnOpenChangeProp,
			description: "A callback that fires when the open state changes.",
		}),
		placeholder: calendarRoot.props!.placeholder,
		onPlaceholderChange: calendarRoot.props!.onPlaceholderChange,
		isDateUnavailable: calendarRoot.props!.isDateUnavailable,
		isDateDisabled: calendarRoot.props!.isDateDisabled,
		validate: dateFieldRoot.props!.validate,
		onInvalid: dateFieldRoot.props!.onInvalid,
		required: dateFieldRoot.props!.required,
		errorMessageId: dateFieldRoot.props!.errorMessageId,
		readonlySegments: dateFieldRoot.props!.readonlySegments,
		disableDaysOutsideMonth: calendarRoot.props!.disableDaysOutsideMonth,
		closeOnDateSelect: createPropSchema({
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the popover when a date is selected.",
		}),
		pagedNavigation: calendarRoot.props!.pagedNavigation,
		preventDeselect: calendarRoot.props!.preventDeselect,
		weekStartsOn: calendarRoot.props!.weekStartsOn,
		weekdayFormat: calendarRoot.props!.weekdayFormat,
		calendarLabel: calendarRoot.props!.calendarLabel,
		fixedWeeks: calendarRoot.props!.fixedWeeks,
		maxValue: calendarRoot.props!.maxValue,
		minValue: calendarRoot.props!.minValue,
		locale: calendarRoot.props!.locale,
		numberOfMonths: calendarRoot.props!.numberOfMonths,
		disabled: calendarRoot.props!.disabled,
		readonly: dateFieldRoot.props!.readonly,
		hourCycle: dateFieldRoot.props!.hourCycle,
		granularity: dateFieldRoot.props!.granularity,
		hideTimeZone: dateFieldRoot.props!.hideTimeZone,
		initialFocus: calendarRoot.props!.initialFocus,
		children: childrenSnippet(),
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
			name: "date-picker-root",
			description: "Present on the root element.",
		}),
	],
});

const calendar = createApiSchema<DatePickerCalendarPropsWithoutHTML>({
	title: "Calendar",
	description: "The calendar component containing the grids of dates.",
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the calendar element when the calendar is invalid.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the calendar element when the calendar is disabled.",
		}),
		createDataAttrSchema({
			name: "readonly",
			description: "Present on the calendar element when the calendar is readonly.",
		}),
		createDataAttrSchema({
			name: "calendar-root",
			description: "Present on the calendar element.",
		}),
	],
});

const input = createApiSchema<DatePickerInputPropsWithoutHTML>({
	title: "Input",
	description: "The field input component which contains the segments of the date field.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
		name: dateFieldInput.props!.name,
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

export const datePicker = [
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
