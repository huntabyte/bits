import type { LabelRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";

export const root = createApiSchema<LabelRootPropsWithoutHTML>({
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: withChildProps({ elType: "HTMLLabelElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "label-root",
			description: "Present on the root element.",
		}),
	],
});

export const label = [root];
