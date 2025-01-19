import type { SeparatorRootPropsWithoutHTML } from "bits-ui";
import { OrientationProp } from "./extended-types/shared/index.js";
import {
	createApiSchema,
	createBooleanProp,
	createEnumProp,
	enums,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<SeparatorRootPropsWithoutHTML>({
	title: "Root",
	description: "An element used to separate content.",
	props: {
		orientation: createEnumProp({
			options: ["horizontal", "vertical"],
			default: "'horizontal'",
			description: "The orientation of the separator.",
			definition: OrientationProp,
		}),
		decorative: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether the separator is decorative or not, which will determine if it is announced by screen readers.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "orientation",
			description: "The orientation of the separator.",
			value: enums("horizontal", "vertical"),
			isEnum: true,
			definition: OrientationProp,
		},
		{
			name: "separator-root",
			description: "Present on the root element.",
		},
	],
});

export const separator = [root];
