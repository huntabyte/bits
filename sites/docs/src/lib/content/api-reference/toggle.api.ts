import type { ToggleRootPropsWithoutHTML } from "bits-ui";
import {
	ToggleRootOnPressedChangeProp,
	ToggleRootStateDataAttr,
} from "./extended-types/toggle/index.js";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createFunctionProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<ToggleRootPropsWithoutHTML>({
	title: "Root",
	description: "The toggle button.",
	props: {
		pressed: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the toggle button is pressed.",
			bindable: true,
		}),
		onPressedChange: createFunctionProp({
			definition: ToggleRootOnPressedChangeProp,
			description: "A callback function called when the pressed state of the toggle changes.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "state",
			description: "Whether the toggle is in the on or off state.",
			definition: ToggleRootStateDataAttr,
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the toggle is disabled.",
		}),
		createDataAttrSchema({
			name: "toggle-root",
			description: "Present on the root element.",
		}),
	],
});

export const toggle = [root];
