import type { ToggleGroupItemPropsWithoutHTML, ToggleGroupRootPropsWithoutHTML } from "bits-ui";
import {
	OnChangeStringOrArrayProp,
	OrientationProp,
	SingleOrMultipleProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";
import { ToggleRootStateDataAttr } from "./extended-types/toggle/index.js";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createStringProp,
	createUnionProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<ToggleGroupRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which contains the toggle group items.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			definition: SingleOrMultipleProp,
			description: "The type of toggle group.",
			required: true,
		}),
		value: createUnionProp({
			options: ["string", "string[]"],
			definition: StringOrArrayStringProp,
			description:
				"The value of the toggle group. If the `type` is `'multiple'`, this will be an array of strings, otherwise it will be a string.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback function called when the value of the toggle group changes. The type of the value is dependent on the type of the toggle group.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		loop: createBooleanProp({
			default: C.TRUE,
			description: "Whether or not the toggle group should loop when navigating.",
		}),
		orientation: createEnumProp({
			options: [C.HORIZONTAL, C.VERTICAL],
			default: C.HORIZONTAL,
			definition: OrientationProp,
			description: "The orientation of the toggle group.",
		}),
		rovingFocus: createBooleanProp({
			default: C.TRUE,
			description: "Whether or not the toggle group should use roving focus when navigating.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "orientation",
			definition: OrientationProp,
			description: "The orientation of the toggle group.",
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "toggle-group-root",
			description: "Present on the root element.",
		}),
	],
});

const item = createApiSchema<ToggleGroupItemPropsWithoutHTML>({
	title: "Item",
	description: "An individual toggle item within the group.",
	props: {
		value: createStringProp({
			description: "The value of the item.",
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
			description: "Whether the toggle item is in the on or off state.",
			definition: ToggleRootStateDataAttr,
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "value",
			description: "The value of the toggle item.",
		}),
		createDataAttrSchema({
			name: "orientation",
			description: "The orientation of the toggle group.",
			definition: OrientationProp,
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the toggle item is disabled.",
		}),
		createDataAttrSchema({
			name: "toggle-group-item",
			description: "Present on the toggle group item.",
		}),
	],
});

export const toggleGroup = [root, item];
