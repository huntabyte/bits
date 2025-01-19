import type { Component } from "svelte";
import {
	ChildDefaultSnippetProps,
	DateOnRangeChangeProp,
	DateRangeProp,
	DirProp,
	EscapeKeydownBehaviorProp,
	InteractOutsideBehaviorProp,
	OnEscapeKeydownProp,
	OnFocusOutsideProp,
	OnInteractOutsideProp,
	OrientationProp,
} from "./extended-types/shared/index.js";
import {
	FloatingAlignProp,
	FloatingCollisionBoundaryProp,
	FloatingCollisionPaddingProp,
	FloatingCustomAnchorProp,
	FloatingSideProp,
	FloatingStickyProp,
	FloatingStrategyProp,
	FloatingUpdatePositionStrategyProp,
} from "./extended-types/floating/index.js";
import { PortalToProp } from "./extended-types/portal/index.js";

import type { APISchema, CSSVarSchema, DataAttrSchema, PropSchema } from "$lib/types/api.js";
import * as C from "$lib/content/constants.js";

type ElementKind =
	| "HTMLDivElement"
	| "HTMLButtonElement"
	| "HTMLSpanElement"
	| "HTMLAnchorElement"
	| "HTMLTableCellElement"
	| "HTMLTableSectionElement"
	| "HTMLTableRowElement"
	| "HTMLTableElement"
	| "HTMLLabelElement"
	| "HTMLHeadingElement"
	| "HTMLImageElement"
	| "HTMLInputElement"
	| "HTMLUListElement"
	| "HTMLLiElement"
	| "HTMLElement";

type SharedPropOptions = {
	description: string;
	required?: boolean;
	bindable?: boolean;
	default?: string;
};

export function createApiSchema<T>(schema: APISchema<T>) {
	return schema;
}

export function createPropSchema(schema: PropSchema) {
	return schema;
}

export function createDataAttrSchema(schema: DataAttrSchema) {
	return schema;
}

export function createUnionProp({
	options,
	description,
	required = false,
	bindable = false,
	default: defaultProp,
	definition,
}: { options: string[]; definition?: Component } & SharedPropOptions): PropSchema {
	return {
		type: {
			type: C.UNION,
			definition: definition ?? union(...options),
		},
		description,
		required,
		bindable,
		default: defaultProp,
	};
}

export function createEnumProp({
	options,
	description,
	required = false,
	bindable = false,
	default: defaultProp,
	definition,
}: { options: string[]; definition?: Component } & SharedPropOptions): PropSchema {
	return {
		type: {
			type: C.ENUM,
			definition: definition ?? enums(...options),
		},
		description,
		required,
		bindable,
		default: defaultProp,
	};
}

export function createObjectProp({
	definition,
	description,
	required = false,
	bindable = false,
	default: defaultProp,
}: { definition: string } & SharedPropOptions): PropSchema {
	return {
		type: {
			type: C.OBJECT,
			definition,
		},
		description,
		required,
		bindable,
		default: defaultProp,
	};
}

export function createFunctionProp({
	definition,
	description,
	required = false,
	bindable = false,
	default: defaultProp,
}: { definition: string | Component } & SharedPropOptions): PropSchema {
	return {
		type: {
			type: C.FUNCTION,
			definition,
		},
		description,
		required,
		bindable,
		default: defaultProp,
	};
}

export function createBooleanProp({
	required = false,
	bindable = false,
	description,
	default: defaultProp,
}: SharedPropOptions): PropSchema {
	return {
		type: C.BOOLEAN,
		required,
		bindable,
		default: defaultProp,
		description,
	};
}

export function createStringProp({
	required = false,
	bindable = false,
	description,
	default: defaultProp,
}: SharedPropOptions): PropSchema {
	return {
		type: C.STRING,
		required,
		bindable,
		default: defaultProp,
		description,
	};
}

export function createNumberProp({
	required = false,
	bindable = false,
	description,
	default: defaultProp,
}: SharedPropOptions): PropSchema {
	return {
		type: C.NUMBER,
		required,
		bindable,
		default: defaultProp,
		description,
	};
}

type EnumDataAttrOptions = {
	name: string;
	description: string;
	options: string[];
	definition?: Component;
};

export function createEnumDataAttr(options: EnumDataAttrOptions): DataAttrSchema {
	return {
		name: options.name,
		value: enums(...options.options),
		description: options.description,
		definition: options.definition,
		isEnum: true,
	};
}

type CSSVarOptions = {
	name: string;
	description: string;
};

export function createCSSVarSchema(options: CSSVarOptions): CSSVarSchema {
	return {
		name: options.name,
		description: options.description,
	};
}

export const arrowProps = {
	width: createNumberProp({
		default: "8",
		description: "The width of the arrow in pixels.",
	}),
	height: createNumberProp({
		default: "8",
		description: "The height of the arrow in pixels.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
};

export const portalProps = {
	to: createUnionProp({
		definition: PortalToProp,
		options: ["string", "HTMLElement", "null", "undefined"],
		description: `Where to render the content when it is open. Defaults to the body. Can be disabled by passing \`null\``,
		default: "body",
	}),
	disabled: createBooleanProp({
		description:
			"Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.",
		default: C.FALSE,
	}),
	children: childrenSnippet(),
};

export function union(...types: string[]): string {
	return escape(types.join(" | "));
}

export function enums(...values: string[]): string {
	return values.map((value) => `'${value}'`).join(" | ");
}

export function seeFloating(content: string, link: string) {
	return `${content} [Floating UI reference](${link}).`;
}

export function escape(str: string): string {
	const entities = [
		[/</g, "&lt;"],
		[/>/g, "&gt;"],
		[/\{/g, "&#123;"],
		[/\}/g, "&#125;"],
	] as const;
	for (let i = 0; i < entities.length; i += 1) {
		str = str.replace(entities[i][0], entities[i][1]);
	}
	return str;
}

export function childSnippet(definition?: string | Component): PropSchema {
	return {
		type: {
			type: C.SNIPPET,
			definition: definition || ChildDefaultSnippetProps,
		},
		description:
			"Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.",
	};
}

export function childrenSnippet(definition?: string | Component): PropSchema {
	if (definition) {
		return {
			type: {
				type: C.SNIPPET,
				definition,
			},
			description: "The children content to render.",
		};
	}

	return {
		type: C.SNIPPET,
		description: "The children content to render.",
	};
}

export function refProp({ elType = "HTMLElement" }: { elType?: ElementKind }): PropSchema {
	return {
		type: elType,
		description:
			"The underlying DOM element being rendered. You can bind to this to get a reference to the element.",
		bindable: true,
	};
}

export function withChildProps({
	elType = "HTMLElement",
	childrenDef,
	childDef = ChildDefaultSnippetProps,
}: {
	elType: ElementKind;
	childrenDef?: string | Component;
	childDef?: string | Component;
}) {
	const trueChildrenDef = childrenDef
		? typeof childrenDef === "string"
			? escape(childrenDef)
			: childrenDef
		: undefined;

	const trueChildDef = childDef
		? typeof childDef === "string"
			? escape(childDef)
			: childDef
		: undefined;

	return {
		ref: refProp({ elType }),
		children: childrenSnippet(trueChildrenDef),
		child: childSnippet(trueChildDef),
	} as const;
}

export function floatingSideProp(defaultSide = "bottom"): PropSchema {
	return createEnumProp({
		options: ["top", "bottom", "left", "right"],
		default: defaultSide,
		description:
			"The preferred side of the anchor to render the floating element against when open. Will be reversed when collisions occur.",
		definition: FloatingSideProp,
	});
}

export const floatingSideOffsetProp = createNumberProp({
	description: "The distance in pixels from the anchor to the floating element.",
	default: "0",
});

export function floatingAlignProp(defaultAlign = "start"): PropSchema {
	return createEnumProp({
		options: ["start", "center", "end"],
		default: defaultAlign,
		description:
			"The preferred alignment of the anchor to render the floating element against when open. This may change when collisions occur.",
		definition: FloatingAlignProp,
	});
}

export const floatingAlignOffsetProp = createNumberProp({
	description: "The distance in pixels from the anchor to the floating element.",
	default: "0",
});

export const floatingArrowPaddingProp = createNumberProp({
	description:
		"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
	default: "0",
});

export const floatingAvoidCollisionsProp = createBooleanProp({
	description:
		"When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.",
	default: C.TRUE,
});

export const floatingCollisionBoundaryProp = createUnionProp({
	options: ["Element", "null"],
	description: "A boundary element or array of elements to check for collisions against.",
	definition: FloatingCollisionBoundaryProp,
});

export const floatingCollisionPaddingProp = createUnionProp({
	options: ["number", "Partial<Record<Side, number>>"],
	description:
		"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
	default: "0",
	definition: FloatingCollisionPaddingProp,
});

export const floatingStickyProp = createEnumProp({
	options: ["partial", "always"],
	description:
		"The sticky behavior on the align axis. `'partial'` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst `'always'` will keep the content in the boundary regardless.",
	default: "partial",
	definition: FloatingStickyProp,
});

export const floatingHideWhenDetachedProp = createBooleanProp({
	description:
		"When `true`, hides the content when it is detached from the DOM. This is useful for when you want to hide the content when the user scrolls away.",
	default: C.TRUE,
});

export const floatingUpdatePositionStrategyProp = createEnumProp({
	options: ["optimized", "always"],
	description:
		"The strategy to use when updating the position of the content. When `'optimized'` the content will only be repositioned when the trigger is in the viewport. When `'always'` the content will be repositioned whenever the position changes.",
	default: "optimized",
	definition: FloatingUpdatePositionStrategyProp,
});

export const floatingStrategyProp = createEnumProp({
	options: ["fixed", "absolute"],
	description:
		"The positioning strategy to use for the floating element. When `'fixed'` the element will be positioned relative to the viewport. When `'absolute'` the element will be positioned relative to the nearest positioned ancestor.",
	default: "fixed",
	definition: FloatingStrategyProp,
});

export const floatingCustomAnchorProp = createUnionProp({
	options: ["string", "HTMLElement", "Measurable", "null"],
	description:
		"Use an element other than the trigger to anchor the content to. If provided, the content will be anchored to the provided element instead of the trigger.",
	default: "null",
	definition: FloatingCustomAnchorProp,
});

export const preventScrollProp = createBooleanProp({
	description:
		"When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.",
	default: C.TRUE,
});

export const restoreScrollDelayProp = createNumberProp({
	description:
		"The delay in milliseconds before the scrollbar is restored after closing the dialog. This is only applicable when using the `child` snippet for custom transitions and `preventScroll` and `forceMount` are `true`. You should set this to a value greater than the transition duration to prevent content from shifting during the transition.",
	default: "null",
});

export function floatingProps(props?: {
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}) {
	return {
		side: floatingSideProp(props?.side),
		sideOffset: floatingSideOffsetProp,
		align: floatingAlignProp(props?.align),
		alignOffset: floatingAlignOffsetProp,
		arrowPadding: floatingArrowPaddingProp,
		avoidCollisions: floatingAvoidCollisionsProp,
		collisionBoundary: floatingCollisionBoundaryProp,
		collisionPadding: floatingCollisionPaddingProp,
		sticky: floatingStickyProp,
		hideWhenDetached: floatingHideWhenDetachedProp,
		updatePositionStrategy: floatingUpdatePositionStrategyProp,
		strategy: floatingStrategyProp,
		preventScroll: preventScrollProp,
		customAnchor: floatingCustomAnchorProp,
	} as const;
}

export const dismissibleOnInteractOutsideProp = createFunctionProp({
	definition: OnInteractOutsideProp,
	description:
		"Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.",
});

export const dismissibleOnFocusOutsideProp = createFunctionProp({
	definition: OnFocusOutsideProp,
	description:
		"Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.",
});

export const dismissibleInteractOutsideBehaviorProp: PropSchema = createEnumProp({
	definition: InteractOutsideBehaviorProp,
	options: ["close", "ignore", "defer-otherwise-close", "defer-otherwise-ignore"],
	default: "close",
	description:
		"The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.",
});

export const dismissibleLayerProps = {
	onInteractOutside: dismissibleOnInteractOutsideProp,
	onFocusOutside: dismissibleOnFocusOutsideProp,
	interactOutsideBehavior: dismissibleInteractOutsideBehaviorProp,
} as const;

export const escapeEscapeKeydownBehaviorProp: PropSchema = createEnumProp({
	definition: EscapeKeydownBehaviorProp,
	options: ["close", "ignore", "defer-otherwise-close", "defer-otherwise-ignore"],
	default: "close",
	description:
		"The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.",
});

export const escapeOnEscapeKeydownProp: PropSchema = createFunctionProp({
	definition: OnEscapeKeydownProp,
	description:
		"Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.",
});

export const escapeLayerProps = {
	onEscapeKeydown: escapeOnEscapeKeydownProp,
	escapeKeydownBehavior: escapeEscapeKeydownBehaviorProp,
} as const;

export const forceMountProp = createBooleanProp({
	description:
		"Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.",
	default: C.FALSE,
});

export const onOpenAutoFocusProp = createFunctionProp({
	definition: OnFocusOutsideProp,
	description:
		"Event handler called when auto-focusing the content as it is opened. Can be prevented.",
});

export const onCloseAutoFocusProp = createFunctionProp({
	definition: OnFocusOutsideProp,
	description:
		"Event handler called when auto-focusing the content as it is closed. Can be prevented.",
});

export const trapFocusProp = createBooleanProp({
	description: "Whether or not to trap the focus within the content when open.",
	default: C.TRUE,
});

export const focusScopeProps = {
	onOpenAutoFocus: onOpenAutoFocusProp,
	onCloseAutoFocus: onCloseAutoFocusProp,
	trapFocus: trapFocusProp,
} as const;

export const preventOverflowTextSelectionProp = createBooleanProp({
	description:
		"When `true`, prevents the text selection from overflowing the bounds of the element.",
	default: C.TRUE,
});

export const dirProp = createEnumProp({
	definition: DirProp,
	options: ["ltr", "rtl"],
	description: "The reading direction of the app.",
	default: "'ltr'",
});

export const orientationDataAttr = createEnumDataAttr({
	name: "orientation",
	options: ["vertical", "horizontal"],
	description: "The orientation of the component.",
	definition: OrientationProp,
});

export const disabledDataAttr: DataAttrSchema = {
	name: "disabled",
	value: "''",
	description: "Present when the component is disabled.",
};

export const valueDateRangeProp: PropSchema = createPropSchema({
	type: {
		type: "DateRange",
		definition: DateRangeProp,
	},
	description: "The selected date range.",
	bindable: true,
});

export const valueDateRangeChangeFn: PropSchema = createFunctionProp({
	definition: DateOnRangeChangeProp,
	description: "A function that is called when the selected date range changes.",
});
