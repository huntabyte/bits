import type {
	TooltipArrowPropsWithoutHTML,
	TooltipContentPropsWithoutHTML,
	TooltipContentStaticPropsWithoutHTML,
	TooltipProviderPropsWithoutHTML,
	TooltipRootPropsWithoutHTML,
	TooltipTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	OnOpenChangeProp,
	OpenChildSnippetProps,
	OpenChildrenSnippetProps,
} from "./extended-types/shared/index.js";
import { FloatingContentChildSnippetProps } from "./extended-types/floating/index.js";
import {
	arrowProps,
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumDataAttr,
	createFunctionProp,
	createNumberProp,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingProps,
	forceMountProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const openClosedDataAttr = createEnumDataAttr({
	name: "state",
	description: "Whether the tooltip is open or closed.",
	options: ["open", "closed"],
});

const delayDuration = createNumberProp({
	default: "700",
	description:
		"The amount of time in milliseconds to delay opening the tooltip when hovering over the trigger.",
});

const disableHoverableContent = createBooleanProp({
	default: C.FALSE,
	description:
		"Whether or not to disable the hoverable content. This is useful when the content contains interactive elements.",
});

const disabled = createBooleanProp({
	default: C.FALSE,
	description: "Whether or not the tooltip is disabled.",
});

const disableCloseOnTriggerClick = createBooleanProp({
	default: C.FALSE,
	description:
		"Whether or not to close the tooltip when pressing the escape key. This is useful when the content contains interactive elements.",
});

const skipDelayDuration = createNumberProp({
	default: "300",
	description:
		"The amount of time in milliseconds to delay opening the tooltip when the user has used their mouse to hover over the trigger.",
});

const ignoreNonKeyboardFocus = createBooleanProp({
	default: C.FALSE,
	description:
		"Whether or not to ignore the tooltip when the focus is not on the trigger. This is useful when the content contains interactive elements.",
});

export const provider: APISchema<TooltipProviderPropsWithoutHTML> = {
	title: "Provider",
	description:
		"A provider component which contains shared state and logic for the tooltips within its subtree.",
	props: {
		delayDuration,
		disableHoverableContent,
		disabled,
		disableCloseOnTriggerClick,
		skipDelayDuration,
		ignoreNonKeyboardFocus,
		children: childrenSnippet(),
	},
};

export const root = createApiSchema<TooltipRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The root component containing the parts of the tooltip. Must be a descendant of a `Tooltip.Provider` component.",
	props: {
		open: createBooleanProp({
			default: C.FALSE,
			description: "The open state of the tooltip component.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: OnOpenChangeProp,
			description: "A callback that fires when the open state changes.",
		}),
		disabled,
		delayDuration,
		disableHoverableContent,
		disableCloseOnTriggerClick,
		ignoreNonKeyboardFocus,
		children: childrenSnippet(),
	},
});

export const trigger = createApiSchema<TooltipTriggerPropsWithoutHTML>({
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the tooltip on hover or focus.",
	props: {
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the tooltip trigger is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "tooltip-trigger",
			description: "Present on the tooltip trigger element.",
		}),
	],
});

export const content = createApiSchema<TooltipContentPropsWithoutHTML>({
	title: "Content",
	description: "The contents of the tooltip which are displayed when the tooltip is open.",
	props: {
		...floatingProps(),
		...dismissibleLayerProps,
		...escapeLayerProps,
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: OpenChildrenSnippetProps,
			childDef: FloatingContentChildSnippetProps,
		}),
	},
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "tooltip-content",
			description: "Present on the tooltip content element.",
		}),
	],
});

export const contentStatic = createApiSchema<TooltipContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description:
		"The contents of the tooltip which are displayed when the tooltip is open. (Static/No Floating UI)",
	props: {
		...dismissibleLayerProps,
		...escapeLayerProps,
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: OpenChildrenSnippetProps,
			childDef: OpenChildSnippetProps,
		}),
	},
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "tooltip-content",
			description: "Present on the tooltip content element.",
		}),
	],
});

export const arrow = createApiSchema<TooltipArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the tooltip is open.",
	props: arrowProps,
	dataAttributes: [
		createDataAttrSchema({
			name: "arrow",
			description: "Present on the arrow element.",
		}),
		createDataAttrSchema({
			name: "tooltip-arrow",
			description: "Present on the arrow element.",
		}),
	],
});

export const tooltip = [provider, root, trigger, content, contentStatic, arrow];
