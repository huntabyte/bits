import {
	arrowProps,
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createCSSVarSchema,
	createDataAttrSchema,
	createEnumDataAttr,
	createEnumProp,
	createFunctionProp,
	createObjectProp,
	createStringProp,
	createUnionProp,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	onCloseAutoFocusProp,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type {
	SelectArrowPropsWithoutHTML,
	SelectContentPropsWithoutHTML,
	SelectContentStaticPropsWithoutHTML,
	SelectGroupHeadingPropsWithoutHTML,
	SelectGroupPropsWithoutHTML,
	SelectItemPropsWithoutHTML,
	SelectRootPropsWithoutHTML,
	SelectScrollDownButtonPropsWithoutHTML,
	SelectScrollUpButtonPropsWithoutHTML,
	SelectTriggerPropsWithoutHTML,
	SelectViewportPropsWithoutHTML,
} from "bits-ui";
import { ComboboxScrollAlignmentProp } from "./extended-types/combobox/index.js";
import { FloatingContentChildSnippetProps } from "./extended-types/floating/index.js";
import { ItemsProp } from "./extended-types/select/index.js";
import {
	NoopProp,
	OnChangeStringOrArrayProp,
	OnOpenChangeProp,
	OpenChildSnippetProps,
	OpenChildrenSnippetProps,
	OpenClosedProp,
	SingleOrMultipleProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";

const stateDataAttr = createEnumDataAttr({
	name: "state",
	options: ["open", "closed"],
	description: "The select's open state.",
	definition: OpenClosedProp,
});

export const root = createApiSchema<SelectRootPropsWithoutHTML>({
	title: "Root",
	description: "The root select component which manages & scopes the state of the select.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			description: "The type of selection to use for the select.",
			required: true,
			definition: SingleOrMultipleProp,
		}),
		value: createUnionProp({
			options: ["string", "string[]"],
			default: "",
			description:
				"The value of the select. When the type is `'single'`, this should be a string. When the type is `'multiple'`, this should be an array of strings.",
			bindable: true,
			definition: StringOrArrayStringProp,
		}),
		onValueChange: createFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback that is fired when the select value changes. When the type is `'single'`, the argument will be a string. When the type is `'multiple'`, the argument will be an array of strings.",
		}),
		open: createBooleanProp({
			default: C.FALSE,
			description: "The open state of the select menu.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: OnOpenChangeProp,
			description: "A callback that is fired when the select menu's open state changes.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the select component is disabled.",
		}),
		name: createStringProp({
			description:
				"The name to apply to the hidden input element for form submission. If provided, a hidden input element will be rendered to submit the value of the select.",
		}),
		required: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the select menu is required.",
		}),
		scrollAlignment: createEnumProp({
			options: ["nearest", "center"],
			default: "'nearest'",
			description: "The alignment of the highlighted item when scrolling.",
			definition: ComboboxScrollAlignmentProp,
		}),
		loop: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the select menu should loop through items.",
		}),
		allowDeselect: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the user can deselect the selected item by pressing it in a single select.",
		}),
		items: createObjectProp({
			definition: ItemsProp,
			description:
				"Optionally provide an array of `value` and `label` pairs that will be used to match and trigger selection when the trigger is focused and a key is pressed while the content is closed. Additionally, this will be used for form autofill when the type is single.",
		}),
		children: childrenSnippet(),
	},
});

export const content = createApiSchema<SelectContentPropsWithoutHTML>({
	title: "Content",
	description: "The element which contains the select's items.",
	props: {
		...floatingProps(),
		...escapeLayerProps,
		...dismissibleLayerProps,
		onCloseAutoFocus: onCloseAutoFocusProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the select should loop through items when reaching the end.",
		}),
		forceMount: forceMountProp,
		preventScroll: {
			...preventScrollProp,
			default: C.FALSE,
		},
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: OpenChildrenSnippetProps,
			childDef: FloatingContentChildSnippetProps,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "select-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		createCSSVarSchema({
			name: "--bits-select-content-transform-origin",
			description: "The transform origin of the select content element.",
		}),
		createCSSVarSchema({
			name: "--bits-select-content-available-width",
			description: "The available width of the select content element.",
		}),
		createCSSVarSchema({
			name: "--bits-select-content-available-height",
			description: "The available height of the select content element.",
		}),
		createCSSVarSchema({
			name: "--bits-select-anchor-width",
			description: "The width of the select trigger element.",
		}),
		createCSSVarSchema({
			name: "--bits-select-anchor-height",
			description: "The height of the select trigger element.",
		}),
	],
});

export const contentStatic = createApiSchema<SelectContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description: "The element which contains the select's items. (Static/No Floating UI)",
	props: {
		...escapeLayerProps,
		...dismissibleLayerProps,
		...focusScopeProps,
		preventScroll: preventScrollProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the select should loop through items when reaching the end.",
		}),
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: OpenChildrenSnippetProps,
			childDef: OpenChildSnippetProps,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "select-content",
			description: "Present on the content element.",
		}),
	],
});

export const item = createApiSchema<SelectItemPropsWithoutHTML>({
	title: "Item",
	description: "A select item, which must be a child of the `select.Content` component.",
	props: {
		value: createStringProp({
			description: "The value of the item.",
			required: true,
		}),
		label: createStringProp({
			description:
				"The label of the item, which is what the list will be filtered by using typeahead behavior.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the select item is disabled. This will prevent interaction/selection.",
		}),
		onHighlight: createFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is highlighted.",
		}),
		onUnhighlight: createFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is unhighlighted.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "value",
			description: "The value of the select item.",
			value: "string",
		}),
		createDataAttrSchema({
			name: "label",
			description: "The label of the select item.",
			value: "string",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the item is disabled.",
		}),
		createDataAttrSchema({
			name: "highlighted",
			description:
				"Present when the item is highlighted, which is either via keyboard navigation of the menu or hover.",
		}),
		createDataAttrSchema({
			name: "selected",
			description: "Present when the item is selected.",
		}),
		createDataAttrSchema({
			name: "select-item",
			description: "Present on the item element.",
		}),
	],
});

export const trigger = createApiSchema<SelectTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A button which toggles the select's open state.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "placeholder",
			description: "Present when the select does not have a value.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the select is disabled.",
		}),
		createDataAttrSchema({
			name: "select-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const viewport = createApiSchema<SelectViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"An optional element to track the scroll position of the select for rendering the scroll up/down buttons.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "select-viewport",
			description: "Present on the viewport element.",
		}),
	],
});

export const scrollUpButton = createApiSchema<SelectScrollUpButtonPropsWithoutHTML>({
	title: "ScrollUpButton",
	description:
		"An optional scroll up button element to improve the scroll experience within the select. Should be used in conjunction with the `select.Viewport` component.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "select-scroll-up-button",
			description: "Present on the scroll up button element.",
		}),
	],
});

export const scrollDownButton = createApiSchema<SelectScrollDownButtonPropsWithoutHTML>({
	title: "ScrollDownButton",
	description:
		"An optional scroll down button element to improve the scroll experience within the select. Should be used in conjunction with the `select.Viewport` component.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "select-scroll-down-button",
			description: "Present on the scroll down button element.",
		}),
	],
});

export const group = createApiSchema<SelectGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group of related select items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "select-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupHeading = createApiSchema<SelectGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for the parent select group. This is used to describe a group of related select items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "select-group-heading",
			description: "Present on the group heading element.",
		}),
	],
});

export const arrow = createApiSchema<SelectArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the content when open.",
	props: arrowProps,
	dataAttributes: [
		createDataAttrSchema({
			name: "arrow",
			description: "Present on the arrow element.",
		}),
	],
});

export const select = [
	root,
	trigger,
	content,
	contentStatic,
	item,
	viewport,
	scrollUpButton,
	scrollDownButton,
	group,
	groupHeading,
	arrow,
];
