import type {
	DropdownMenuCheckboxItemPropsWithoutHTML,
	DropdownMenuContentPropsWithoutHTML,
	DropdownMenuContentStaticPropsWithoutHTML,
	DropdownMenuGroupHeadingPropsWithoutHTML,
	DropdownMenuGroupPropsWithoutHTML,
	DropdownMenuItemPropsWithoutHTML,
	DropdownMenuRadioGroupPropsWithoutHTML,
	DropdownMenuRadioItemPropsWithoutHTML,
	DropdownMenuRootPropsWithoutHTML,
	DropdownMenuSeparatorPropsWithoutHTML,
	DropdownMenuSubContentPropsWithoutHTML,
	DropdownMenuSubContentStaticPropsWithoutHTML,
	DropdownMenuSubPropsWithoutHTML,
	DropdownMenuSubTriggerPropsWithoutHTML,
	DropdownMenuTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	childrenSnippet,
	createBooleanProp,
	createDataAttrSchema,
	createFunctionProp,
	createStringProp,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	withChildProps,
} from "./helpers.js";
import {
	NoopProp,
	OnOpenChangeProp,
	OnStringValueChangeProp,
	OpenChildSnippetProps,
	OpenChildrenSnippetProps,
	OpenClosedProp,
	RadioItemChildSnippetProps,
	RadioItemChildrenSnippetProps,
} from "./extended-types/shared/index.js";
import { MenuCheckedStateAttr } from "./extended-types/menu/index.js";
import { RadioGroupStateAttr } from "./extended-types/radio-group/index.js";
import {
	CheckboxRootChildSnippetProps,
	CheckboxRootChildrenSnippetProps,
	CheckboxRootOnCheckedChangeProp,
	CheckboxRootOnIndeterminateChangeProp,
} from "./extended-types/checkbox/index.js";
import { FloatingContentChildSnippetProps } from "./extended-types/floating/index.js";
import type { APISchema, DataAttrSchema, PropObj } from "$lib/types/index.js";
import * as C from "$lib/content/constants.js";
import { enums } from "$lib/content/api-reference/helpers.js";
import { omit } from "$lib/utils/omit.js";

const sharedItemProps = {
	textValue: createStringProp({
		description: "The text value of the checkbox menu item. This is used for typeahead.",
	}),
	onSelect: createFunctionProp({
		definition: NoopProp,
		description: "A callback that is fired when the menu item is selected.",
	}),
	closeOnSelect: createBooleanProp({
		default: C.TRUE,
		description: "Whether or not the menu item should close when selected.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} as const;

const props = {
	open: createBooleanProp({
		default: C.FALSE,
		description: "The open state of the  menu.",
		bindable: true,
	}),
	onOpenChange: createFunctionProp({
		definition: OnOpenChangeProp,
		description: "A callback that is fired when the menu's open state changes.",
	}),
	dir: dirProp,
	children: childrenSnippet(),
} satisfies PropObj<DropdownMenuRootPropsWithoutHTML>;

const subProps = {
	open: createBooleanProp({
		default: C.FALSE,
		description: "The open state of the submenu.",
		bindable: true,
	}),
	onOpenChange: createFunctionProp({
		definition: OnOpenChangeProp,
		description: "A callback that is fired when the submenu's open state changes.",
	}),
	children: childrenSnippet(),
} satisfies PropObj<DropdownMenuSubPropsWithoutHTML>;

const contentProps = {
	...floatingProps(),
	...escapeLayerProps,
	...dismissibleLayerProps,
	...focusScopeProps,
	forceMount: forceMountProp,
	preventOverflowTextSelection: preventOverflowTextSelectionProp,
	dir: dirProp,
	loop: createBooleanProp({
		default: C.FALSE,
		description:
			"Whether or not to loop through the menu items in when navigating with the keyboard.",
	}),
	...withChildProps({
		elType: "HTMLDivElement",
		childrenDef: OpenChildrenSnippetProps,
		childDef: FloatingContentChildSnippetProps,
	}),
} satisfies PropObj<DropdownMenuContentPropsWithoutHTML>;

const contentStaticProps = {
	...escapeLayerProps,
	...dismissibleLayerProps,
	...focusScopeProps,
	preventScroll: preventScrollProp,
	forceMount: forceMountProp,
	preventOverflowTextSelection: preventOverflowTextSelectionProp,
	dir: dirProp,
	loop: createBooleanProp({
		default: C.FALSE,
		description:
			"Whether or not to loop through the menu items in when navigating with the keyboard.",
	}),
	...withChildProps({
		elType: "HTMLDivElement",
		childrenDef: OpenChildrenSnippetProps,
		childDef: OpenChildSnippetProps,
	}),
} satisfies PropObj<DropdownMenuContentStaticPropsWithoutHTML>;

const subContentProps = contentProps satisfies PropObj<
	Omit<DropdownMenuSubContentPropsWithoutHTML, "style">
>;

const subContentStaticProps = {
	...escapeLayerProps,
	...dismissibleLayerProps,
	...focusScopeProps,
	forceMount: forceMountProp,
	preventOverflowTextSelection: preventOverflowTextSelectionProp,
	dir: dirProp,
	loop: createBooleanProp({
		default: C.TRUE,
		description:
			"Whether or not to loop through the menu items when reaching the end of the list when using the keyboard.",
	}),
	...withChildProps({
		elType: "HTMLDivElement",
		childrenDef: OpenChildrenSnippetProps,
		childDef: OpenChildSnippetProps,
	}),
} satisfies PropObj<DropdownMenuSubContentStaticPropsWithoutHTML>;

const checkboxItemProps = {
	disabled: createBooleanProp({
		default: C.FALSE,
		description:
			"Whether or not the checkbox menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.",
	}),
	checked: createBooleanProp({
		default: C.FALSE,
		description: "The checkbox menu item's checked state.",
		bindable: true,
	}),
	onCheckedChange: createFunctionProp({
		definition: CheckboxRootOnCheckedChangeProp,
		description:
			"A callback that is fired when the checkbox menu item's checked state changes.",
	}),
	indeterminate: createBooleanProp({
		default: C.FALSE,
		description: "Whether the checkbox menu item is in an indeterminate state or not.",
		bindable: true,
	}),
	onIndeterminateChange: createFunctionProp({
		definition: CheckboxRootOnIndeterminateChangeProp,
		description: "A callback that is fired when the indeterminate state changes.",
	}),
	...omit(sharedItemProps, "child", "children"),
	...withChildProps({
		elType: "HTMLDivElement",
		childrenDef: CheckboxRootChildrenSnippetProps,
		childDef: CheckboxRootChildSnippetProps,
	}),
} satisfies PropObj<DropdownMenuCheckboxItemPropsWithoutHTML>;

const radioGroupProps = {
	value: createStringProp({
		description: "The value of the currently checked radio menu item.",
		bindable: true,
	}),
	onValueChange: createFunctionProp({
		definition: OnStringValueChangeProp,
		description: "A callback that is fired when the radio group's value changes.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} satisfies PropObj<DropdownMenuRadioGroupPropsWithoutHTML>;

const radioItemProps = {
	value: createStringProp({
		description:
			"The value of the radio item. When checked, the parent `RadioGroup`'s value will be set to this value.",
		required: true,
	}),
	disabled: createBooleanProp({
		description:
			"Whether or not the radio menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.",
		default: C.FALSE,
	}),
	...omit(sharedItemProps, "child", "children"),
	...withChildProps({
		elType: "HTMLDivElement",
		childrenDef: RadioItemChildrenSnippetProps,
		childDef: RadioItemChildSnippetProps,
	}),
} satisfies PropObj<DropdownMenuRadioItemPropsWithoutHTML>;

const itemProps = {
	disabled: createBooleanProp({
		default: C.FALSE,
		description: "Whether or not the menu item is disabled.",
	}),
	...sharedItemProps,
} satisfies PropObj<DropdownMenuItemPropsWithoutHTML>;

const subTriggerProps = {
	disabled: createBooleanProp({
		default: C.FALSE,
		description: "Whether or not the submenu trigger is disabled.",
	}),
	...sharedItemProps,
} satisfies PropObj<DropdownMenuSubTriggerPropsWithoutHTML>;

const triggerProps = {
	disabled: createBooleanProp({
		default: C.FALSE,
		description: "Whether or not the menu trigger is disabled.",
	}),
	...withChildProps({ elType: "HTMLButtonElement" }),
} satisfies PropObj<DropdownMenuTriggerPropsWithoutHTML>;

const groupProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuGroupPropsWithoutHTML>;

const groupHeadingProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuGroupHeadingPropsWithoutHTML>;

const separatorProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuSeparatorPropsWithoutHTML>;

const STATE: DataAttrSchema = {
	name: "state",
	value: enums("open", "closed"),
	description: "The open state of the menu or submenu the element controls or belongs to.",
	isEnum: true,
	definition: OpenClosedProp,
};

type DataAttrs = APISchema["dataAttributes"];

const triggerAttrs: DataAttrs = [
	STATE,
	createDataAttrSchema({
		name: "menu-trigger",
		description: "Present on the trigger element.",
	}),
];

const contentAttrs: DataAttrs = [
	STATE,
	createDataAttrSchema({
		name: "menu-content",
		description: "Present on the content element.",
	}),
];

const arrowAttrs: DataAttrs = [
	STATE,
	createDataAttrSchema({
		name: "menu-arrow",
		description: "Present on the arrow element.",
	}),
];

const sharedItemAttrs: DataAttrs = [
	createDataAttrSchema({
		name: "orientation",
		value: "'vertical'",
	}),
	createDataAttrSchema({
		name: "highlighted",
		description: "Present when the menu item is highlighted.",
	}),
	createDataAttrSchema({
		name: "disabled",
		description: "Present when the menu item is disabled.",
	}),
];

const itemAttrs: DataAttrs = [
	...sharedItemAttrs,
	createDataAttrSchema({
		name: "menu-item",
		description: "Present on the item element.",
	}),
];

const groupAttrs: DataAttrs = [
	createDataAttrSchema({
		name: "menu-group",
		description: "Present on the group element.",
	}),
];

const labelAttrs: DataAttrs = [
	createDataAttrSchema({
		name: "menu-group-heading",
		description: "Present on the group heading element.",
	}),
];

const checkboxItemAttrs: DataAttrs = [
	...sharedItemAttrs,
	createDataAttrSchema({
		name: "state",
		definition: MenuCheckedStateAttr,
		description: "The checkbox menu item's checked state.",
		isEnum: true,
	}),
];

const radioGroupAttrs: DataAttrs = [
	createDataAttrSchema({
		name: "menu-radio-group",
		description: "Present on the radio group element.",
	}),
];

const radioItemAttrs: DataAttrs = [
	...sharedItemAttrs,
	createDataAttrSchema({
		name: "state",
		definition: RadioGroupStateAttr,
		description: "The radio menu item's checked state.",
		isEnum: true,
	}),
	createDataAttrSchema({
		name: "value",
		description: "The value of the radio item.",
	}),
	createDataAttrSchema({
		name: "menu-radio-item",
		description: "Present on the radio item element.",
	}),
];

const separatorAttrs: DataAttrs = [
	createDataAttrSchema({
		name: "orientation",
		value: "'vertical'",
		description: "The orientation of the separator.",
	}),
	createDataAttrSchema({
		name: "menu-separator",
		description: "Present on the separator element.",
	}),
];

const subContentAttrs: DataAttrs = [
	STATE,
	createDataAttrSchema({
		name: "menu-sub-content",
		description: "Present on the submenu content element.",
	}),
];

const subTriggerAttrs: DataAttrs = [
	...sharedItemAttrs,
	STATE,
	createDataAttrSchema({
		name: "menu-sub-trigger",
		description: "Present on the submenu trigger element.",
	}),
];

export const trigger = {
	props: triggerProps,
	dataAttributes: triggerAttrs,
};

export const content = {
	props: contentProps,
	dataAttributes: contentAttrs,
};

export const contentStatic = {
	props: contentStaticProps,
	dataAttributes: contentAttrs,
};

export const arrow = {
	props: arrowProps,
	dataAttributes: arrowAttrs,
};

export const item = {
	props: itemProps,
	dataAttributes: itemAttrs,
};

export const group = {
	props: groupProps,
	dataAttributes: groupAttrs,
};

export const label = {
	props: groupHeadingProps,
	dataAttributes: labelAttrs,
};

export const separator = {
	props: separatorProps,
	dataAttributes: separatorAttrs,
};

export const checkboxItem = {
	props: checkboxItemProps,
	dataAttributes: checkboxItemAttrs,
};

export const radioGroup = {
	props: radioGroupProps,
	dataAttributes: radioGroupAttrs,
};

export const radioItem = {
	props: radioItemProps,
	dataAttributes: radioItemAttrs,
};

export const subTrigger = {
	props: subTriggerProps,
	dataAttributes: subTriggerAttrs,
};

export const subContent = {
	props: subContentProps,
	dataAttributes: subContentAttrs,
};

export const subContentStatic = {
	props: subContentStaticProps,
	dataAttributes: subContentAttrs,
};

export const sub = {
	props: subProps,
};

export const root = {
	props,
};

const portal = {
	props: portalProps,
};

export const menu = {
	root,
	trigger,
	content,
	contentStatic,
	item,
	checkboxItem,
	radioGroup,
	radioItem,
	separator,
	arrow,
	group,
	label,
	sub,
	subTrigger,
	subContent,
	subContentStatic,
	portal,
};
