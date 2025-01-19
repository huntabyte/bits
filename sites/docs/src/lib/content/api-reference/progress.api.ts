import type { ProgressRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	createNumberProp,
	withChildProps,
} from "./helpers.js";
import { ProgressStateAttr } from "./extended-types/progress/index.js";

export const root = createApiSchema<ProgressRootPropsWithoutHTML>({
	title: "Root",
	description: "The progress bar component.",
	props: {
		max: createNumberProp({
			default: "100",
			description:
				"The maximum value of the progress bar. Used to calculate the percentage of the progress bar.",
		}),
		value: createNumberProp({
			default: "0",
			description: "The current value of the progress bar.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "value",
			description: "The current value of the progress bar.",
		}),
		createDataAttrSchema({
			name: "state",
			definition: ProgressStateAttr,
			description: "The current state of the progress bar.",
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "max",
			description: "The maximum value of the progress bar.",
		}),
		createDataAttrSchema({
			name: "progress-root",
			description: "Present on the root element.",
		}),
	],
});

export const progress = [root];
