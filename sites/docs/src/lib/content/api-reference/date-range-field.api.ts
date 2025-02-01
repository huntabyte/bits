import type {
	DateRangeFieldInputPropsWithoutHTML,
	DateRangeFieldLabelPropsWithoutHTML,
	DateRangeFieldRootPropsWithoutHTML,
	DateRangeFieldSegmentPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createPropSchema,
	withChildProps,
} from "./helpers.js";
import { input as dateFieldInput, root as dateFieldRoot } from "./date-field.api.js";
import {
	DateOnRangeChangeProp,
	DateRangeProp,
	OnStartEndValueChangeProp,
} from "./extended-types/shared/index.js";
import { DateRangeFieldInputTypeProp } from "./extended-types/date-range-field/index.js";
import { DateFieldSegmentPartProp } from "./extended-types/date-field/index.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<DateRangeFieldRootPropsWithoutHTML>({
	title: "Root",
	description: "The root date field component.",
	props: {
		value: {
			type: {
				type: "DateRange",
				definition: DateRangeProp,
			},
			description: "The selected date range.",
			bindable: true,
		},
		onValueChange: createFunctionProp({
			definition: DateOnRangeChangeProp,
			description: "A function that is called when the selected date changes.",
		}),
		placeholder: dateFieldRoot.props!.placeholder,
		onPlaceholderChange: dateFieldRoot.props!.onPlaceholderChange,
		errorMessageId: dateFieldRoot.props!.errorMessageId,
		validate: dateFieldRoot.props!.validate,
		onInvalid: dateFieldRoot.props!.onInvalid,
		minValue: dateFieldRoot.props!.minValue,
		maxValue: dateFieldRoot.props!.maxValue,
		granularity: dateFieldRoot.props!.granularity,
		hideTimeZone: dateFieldRoot.props!.hideTimeZone,
		hourCycle: dateFieldRoot.props!.hourCycle,
		locale: dateFieldRoot.props!.locale,
		disabled: dateFieldRoot.props!.disabled,
		readonly: dateFieldRoot.props!.readonly,
		readonlySegments: dateFieldRoot.props!.readonlySegments,
		required: dateFieldRoot.props!.required,
		onStartValueChange: createFunctionProp({
			definition: OnStartEndValueChangeProp,
			description: "A function that is called when the start date changes.",
		}),
		onEndValueChange: createFunctionProp({
			definition: OnStartEndValueChangeProp,
			description: "A function that is called when the end date changes.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "date-range-field-root",
			description: "Present on the root element.",
		}),
	],
});

export const input = createApiSchema<DateRangeFieldInputPropsWithoutHTML>({
	title: "Input",
	description: "The container for the segments of the date field.",
	props: {
		type: createEnumProp({
			options: ["start", "end"],
			description: "The type of field to render (start or end).",
			required: true,
			definition: DateRangeFieldInputTypeProp,
		}),
		name: {
			type: C.STRING,
			description:
				"The name of the date field used for form submission. If provided, a hidden input element will be rendered alongside the date field.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
		children: dateFieldInput.props!.children,
		child: dateFieldInput.props!.child,
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

export const segment = createApiSchema<DateRangeFieldSegmentPropsWithoutHTML>({
	title: "Segment",
	description: "A segment of the date field.",
	props: {
		part: createPropSchema({
			type: {
				type: "SegmentPart",
				definition: DateFieldSegmentPartProp,
			},
			description: "The part of the date to render.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the element when the field is invalid",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the element when the field is disabled",
		}),
		createDataAttrSchema({
			name: "segment",
			description: "The type of segment the element represents.",
			definition: DateFieldSegmentPartProp,
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "date-field-segment",
			description: "Present on the element.",
		}),
	],
});

export const label = createApiSchema<DateRangeFieldLabelPropsWithoutHTML>({
	title: "Label",
	description: "The label for the date field.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the element when the field is invalid",
		}),
		createDataAttrSchema({
			name: "date-field-label",
			description: "Present on the element.",
		}),
	],
});

export const dateRangeField = [root, input, segment, label];
