import type { AspectRatioRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	createNumberProp,
	withChildProps,
} from "./helpers.js";

const root = createApiSchema<AspectRatioRootPropsWithoutHTML>({
	title: "Root",
	description: "The aspect ratio component.",
	props: {
		ratio: createNumberProp({
			description: "The desired aspect ratio.",
			default: "1",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "aspect-ratio-root",
			description: "Present on the root element.",
		}),
	],
});

export const aspectRatio = [root];
