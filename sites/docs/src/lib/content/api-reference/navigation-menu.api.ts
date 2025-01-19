import type {
	NavigationMenuContentPropsWithoutHTML,
	NavigationMenuIndicatorPropsWithoutHTML,
	NavigationMenuItemPropsWithoutHTML,
	NavigationMenuLinkPropsWithoutHTML,
	NavigationMenuListPropsWithoutHTML,
	NavigationMenuRootPropsWithoutHTML,
	NavigationMenuTriggerPropsWithoutHTML,
	NavigationMenuViewportPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	createStringProp,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	forceMountProp,
	withChildProps,
} from "./helpers.js";
import { OnStringValueChangeProp, OrientationProp } from "./extended-types/shared/index.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<NavigationMenuRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The root navigation menu component which manages & scopes the state of the navigation menu.",
	props: {
		value: createStringProp({
			description: "The value of the currently active menu.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: OnStringValueChangeProp,
			description: "A callback function called when the active menu value changes.",
		}),
		dir: dirProp,
		skipDelayDuration: createNumberProp({
			default: "300",
			description:
				"How much time a user has to enter another trigger without incurring a delay again.",
		}),
		delayDuration: createNumberProp({
			default: "200",
			description:
				"The duration from when the mouse enters a trigger until the content opens.",
		}),
		orientation: createEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			description: "The orientation of the menu.",
			definition: OrientationProp,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const list = createApiSchema<NavigationMenuListPropsWithoutHTML>({
	title: "List",
	description: "A menu within the menubar.",
	props: withChildProps({ elType: "HTMLUListElement" }),
});

export const item = createApiSchema<NavigationMenuItemPropsWithoutHTML>({
	title: "Item",
	description: "A list item within the navigation menu.",
	props: {
		value: createStringProp({
			description: "The value of the item.",
		}),
		...withChildProps({ elType: "HTMLLiElement" }),
	},
});

export const trigger = createApiSchema<NavigationMenuTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button element which toggles the dropdown menu.",
	props: {
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the trigger is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
});

export const content = createApiSchema<NavigationMenuContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the dropdown menu is open.",
	props: {
		...dismissibleLayerProps,
		...escapeLayerProps,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const link = createApiSchema<NavigationMenuLinkPropsWithoutHTML>({
	title: "Link",
	description: "A link within the navigation menu.",
	props: {
		active: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the link is active.",
		}),
		onSelect: createFunctionProp({
			definition: "() => void",
			description: "A callback function called when the link is selected.",
		}),
		...withChildProps({ elType: "HTMLAnchorElement" }),
	},
});

export const indicator = createApiSchema<NavigationMenuIndicatorPropsWithoutHTML>({
	title: "Indicator",
	description:
		"The indicator element for the navigation menu, which is used to indicate the current active item.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
});

export const viewport = createApiSchema<NavigationMenuViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"The viewport element for the navigation menu, which is used to contain the menu items.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const navigationMenu = [root, list, item, trigger, content, link, viewport, indicator];
