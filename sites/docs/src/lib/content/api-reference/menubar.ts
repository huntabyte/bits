import type {
	MenubarArrowPropsWithoutHTML,
	MenubarCheckboxItemPropsWithoutHTML,
	MenubarContentPropsWithoutHTML,
	MenubarGroupLabelPropsWithoutHTML,
	MenubarGroupPropsWithoutHTML,
	MenubarItemPropsWithoutHTML,
	MenubarMenuPropsWithoutHTML,
	MenubarRadioGroupPropsWithoutHTML,
	MenubarRadioItemPropsWithoutHTML,
	MenubarRootPropsWithoutHTML,
	MenubarSeparatorPropsWithoutHTML,
	MenubarSubContentPropsWithoutHTML,
	MenubarSubPropsWithoutHTML,
	MenubarSubTriggerPropsWithoutHTML,
	MenubarTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createFunctionProp,
	createStringProp,
	dirProp,
	withChildProps,
} from "./helpers.js";
import { menu as m } from "./menu.js";
import OnStringValueChange from "./extended-types/shared/on-string-value-change.md";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<MenubarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root menubar component which manages & scopes the state of the menubar.",
	props: {
		value: createStringProp({
			description: "The value of the currently active menu.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: OnStringValueChange,
			description: "A callback function called when the active menu value changes.",
		}),
		dir: dirProp,
		loop: createBooleanProp({
			default: C.TRUE,
			description:
				"Whether or not to loop through the menubar menu triggers when navigating with the keyboard.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const menu = createApiSchema<MenubarMenuPropsWithoutHTML>({
	title: "Menu",
	description: "A menu within the menubar.",
	...m.root,
	props: {
		value: createStringProp({
			description:
				"The value of this menu within the menubar, used to identify it when determining which menu is active.",
		}),
		...m.root.props,
	},
});

export const trigger = createApiSchema<MenubarTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button element which toggles the dropdown menu.",
	...m.trigger,
});

export const content = createApiSchema<MenubarContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the dropdown menu is open.",
	...m.content,
});

export const item = createApiSchema<MenubarItemPropsWithoutHTML>({
	title: "Item",
	description: "A menu item within the dropdown menu.",
	...m.item,
});

export const separator = createApiSchema<MenubarSeparatorPropsWithoutHTML>({
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...m.separator,
});

export const arrow = createApiSchema<MenubarArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow which points to the dropdown menu's anchor/trigger point.",
	...m.arrow,
});

export const checkboxItem = createApiSchema<MenubarCheckboxItemPropsWithoutHTML>({
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...m.checkboxItem,
});

export const radioGroup = createApiSchema<MenubarRadioGroupPropsWithoutHTML>({
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...m.radioGroup,
});

export const radioItem = createApiSchema<MenubarRadioItemPropsWithoutHTML>({
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...m.radioItem,
});

export const sub = createApiSchema<MenubarSubPropsWithoutHTML>({
	title: "Sub",
	description:
		"A submenu belonging to the parent dropdown menu. Responsible for managing the state of the submenu.",
	...m.sub,
});

export const subTrigger = createApiSchema<MenubarSubTriggerPropsWithoutHTML>({
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu it is a child of.",
	...m.subTrigger,
});

export const subContent = createApiSchema<MenubarSubContentPropsWithoutHTML>({
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...m.subContent,
});

export const group = createApiSchema<MenubarGroupPropsWithoutHTML>({
	title: "Group",
	description:
		"A group of menu items. It should be passed an `aria-label` or have a child `Menu.GroupLabel` component to provide a label for a group of menu items.",
	...m.group,
});

export const groupLabel = createApiSchema<MenubarGroupLabelPropsWithoutHTML>({
	title: "GroupLabel",
	description:
		"A label which will be skipped when navigating with the keyboard. It is used to provide a label for a group of menu items and must be a child of either a `Menubar.Group` or `Menubar.RadioGroup` component.",
	...m.label,
});

export const menubar = [
	root,
	menu,
	trigger,
	content,
	item,
	checkboxItem,
	radioGroup,
	radioItem,
	separator,
	arrow,
	group,
	groupLabel,
	sub,
	subTrigger,
	subContent,
];
