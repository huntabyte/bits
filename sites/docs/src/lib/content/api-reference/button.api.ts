import type { ButtonRootPropsWithoutHTML } from "bits-ui";
import { childrenSnippet, createApiSchema, createPropSchema, refProp } from "./helpers.js";
import * as C from "$lib/content/constants.js";
import type { HTMLButtonAttributes } from "svelte/elements";

export const root = createApiSchema<
	ButtonRootPropsWithoutHTML & { href: string; disabled: HTMLButtonAttributes["disabled"] }
>({
	title: "Root",
	description:
		"A component that can switch between a button and an anchor tag based on the `href`/`type` props.",
	props: {
		href: createPropSchema({
			type: C.STRING,
			description:
				"An optional prop that when passed converts the button into an anchor tag.",
		}),
		disabled: createPropSchema({
			type: C.BOOLEAN,
			description:
				"Whether or not the button is disabled. When disabled, the button cannot be interacted with.",
			default: "false",
		}),
		ref: refProp({ elType: "HTMLButtonElement" }),
		children: childrenSnippet(),
	},
	dataAttributes: [
		{
			name: "button-root",
			description: "Present on the button element.",
		},
	],
});

export const button = [root];
