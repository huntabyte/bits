import type {
	CheckboxGroupLabelPropsWithoutHTML,
	CheckboxGroupPropsWithoutHTML,
	CheckboxRootPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumDataAttr,
	createFunctionProp,
	createPropSchema,
	createStringProp,
	withChildProps,
} from "./helpers.js";
import {
	CheckboxGroupOnValueChangeProp,
	CheckboxRootChildSnippetProps,
	CheckboxRootChildrenSnippetProps,
	CheckboxRootOnCheckedChangeProp,
	CheckboxRootOnIndeterminateChangeProp,
	CheckboxRootStateDataAttr,
} from "./extended-types/checkbox/index.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<CheckboxRootPropsWithoutHTML>({
	title: "Root",
	description: "The button component used to toggle the state of the checkbox.",
	props: {
		checked: createBooleanProp({
			default: C.FALSE,
			description:
				"The checkbox button's checked state. This can be a boolean or the string 'indeterminate', which would typically display a dash in the checkbox.",
			bindable: true,
		}),
		onCheckedChange: createFunctionProp({
			definition: CheckboxRootOnCheckedChangeProp,
			description:
				"A callback that is fired when the checkbox button's checked state changes.",
		}),
		indeterminate: createBooleanProp({
			default: C.FALSE,
			description: "Whether the checkbox is an indeterminate state or not.",
			bindable: true,
		}),
		onIndeterminateChange: createFunctionProp({
			definition: CheckboxRootOnIndeterminateChangeProp,
			description: "A callback that is fired when the indeterminate state changes.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the checkbox button is disabled. This prevents the user from interacting with it.",
		}),
		required: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the checkbox is required.",
		}),
		name: createStringProp({
			description:
				"The name of the checkbox. If provided a hidden input will be render to use for form submission. If not provided, the hidden input will not be rendered.",
		}),
		value: createStringProp({
			description:
				"The value of the checkbox. This is what is submitted with the form when the checkbox is checked.",
		}),
		...withChildProps({
			elType: "HTMLButtonElement",
			childDef: CheckboxRootChildSnippetProps,
			childrenDef: CheckboxRootChildrenSnippetProps,
		}),
	},
	dataAttributes: [
		createEnumDataAttr({
			name: "state",
			options: ["checked", "unchecked", "indeterminate"],
			description: "The checkbox's state of checked, unchecked, or indeterminate.",
			definition: CheckboxRootStateDataAttr,
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the checkbox is disabled.",
		}),
		createDataAttrSchema({
			name: "checkbox-root",
			description: "Present on the root element.",
		}),
	],
});

export const group = createApiSchema<CheckboxGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group that synchronizes its value state with its descendant checkboxes.",
	props: {
		value: createPropSchema({
			description:
				"The value of the group. This is an array of the values of the checked checkboxes within the group.",
			bindable: true,
			default: "[]",
			type: "string[]",
		}),
		onValueChange: createFunctionProp({
			definition: CheckboxGroupOnValueChangeProp,
			description: "A callback that is fired when the checkbox group's value state changes.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the checkbox group is disabled. If `true`, all checkboxes within the group will be disabled. To disable a specific checkbox in the group, pass the `disabled` prop to the checkbox.",
		}),
		required: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the checkbox group is required for form submission.",
		}),
		name: createStringProp({
			description:
				"The name of the checkbox group. If provided a hidden input will be rendered to use for form submission.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
		}),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the checkbox group is disabled.",
		}),
		createDataAttrSchema({
			name: "checkbox-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupLabel = createApiSchema<CheckboxGroupLabelPropsWithoutHTML>({
	title: "GroupLabel",
	description: "An accessible label for the checkbox group.",
	props: withChildProps({
		elType: "HTMLLabelElement",
	}),
	dataAttributes: [
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the checkbox group is disabled.",
		}),
		createDataAttrSchema({
			name: "checkbox-group-label",
			description: "Present on the label element.",
		}),
	],
});

export const checkbox = [root, group, groupLabel];
