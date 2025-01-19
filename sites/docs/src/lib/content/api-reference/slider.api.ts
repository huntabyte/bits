import type {
	SliderRangePropsWithoutHTML,
	SliderRootPropsWithoutHTML,
	SliderThumbPropsWithoutHTML,
	SliderTickPropsWithoutHTML,
} from "bits-ui";
import { SliderRootOnValueChangeProp } from "./extended-types/slider/index.js";
import { OrientationProp, SingleOrMultipleProp } from "./extended-types/shared/index.js";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	createUnionProp,
	dirProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<SliderRootPropsWithoutHTML>({
	title: "Root",
	description: "The root slider component which contains the remaining slider components.",
	props: {
		type: createUnionProp({
			options: ["'single'", "'multiple'"],
			description:
				"The type of the slider. If set to `'multiple'`, the slider will allow multiple thumbs and the `value` will be an array of numbers.",
			required: true,
			definition: SingleOrMultipleProp,
		}),
		value: {
			default: "0",
			type: "number",
			description:
				"The current value of the slider. If the `type` is set to `'multiple'`, this should be an array of numbers and will default to an empty array.",
			bindable: true,
		},
		onValueChange: createFunctionProp({
			definition: SliderRootOnValueChangeProp,
			description: "A callback function called when the value state of the slider changes.",
		}),
		onValueCommit: createFunctionProp({
			definition: SliderRootOnValueChangeProp,
			description:
				"A callback function called when the user finishes dragging the thumb and the value changes. This is different than the `onValueChange` callback because it waits until the user stops dragging before calling the callback, where the `onValueChange` callback is called immediately after the user starts dragging.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		max: createNumberProp({
			default: "100",
			description: "The maximum value of the slider.",
		}),
		min: createNumberProp({
			default: "0",
			description: "The minimum value of the slider.",
		}),
		orientation: createEnumProp({
			options: ["horizontal", "vertical"],
			default: "'horizontal'",
			description: "The orientation of the slider.",
			definition: OrientationProp,
		}),
		step: createNumberProp({
			default: "1",
			description: "The step value of the slider.",
		}),
		dir: dirProp,
		autoSort: createBooleanProp({
			default: C.TRUE,
			description:
				"Whether to automatically sort the values in the array when moving thumbs past one another. This is only applicable to the `'multiple'` type.",
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "orientation",
			definition: OrientationProp,
			description: "The orientation of the slider.",
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "slider-root",
			description: "Present on the root element.",
		}),
	],
});

const thumb = createApiSchema<SliderThumbPropsWithoutHTML>({
	title: "Thumb",
	description: "A thumb on the slider.",
	props: {
		index: createNumberProp({
			description:
				"The index of the thumb in the array of thumbs provided by the `thumbs` `children` snippet prop.",
			required: true,
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the thumb is disabled.",
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "slider-thumb",
			description: "Present on the thumb elements.",
		}),
	],
});

const range = createApiSchema<SliderRangePropsWithoutHTML>({
	title: "Range",
	description: "The range of the slider.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "slider-range",
			description: "Present on the range elements.",
		}),
	],
});

const tick = createApiSchema<SliderTickPropsWithoutHTML>({
	title: "Tick",
	description: "A tick mark on the slider.",
	props: {
		index: createNumberProp({
			description:
				"The index of the tick in the array of ticks provided by the `ticks` `children` snippet prop.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "bounded",
			description: "Present when the tick is bounded.",
		}),
		createDataAttrSchema({
			name: "slider-tick",
			description: "Present on the tick elements.",
		}),
	],
});

export const slider = [root, range, thumb, tick];
