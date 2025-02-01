import type {
	ScrollAreaCornerPropsWithoutHTML,
	ScrollAreaRootPropsWithoutHTML,
	ScrollAreaScrollbarPropsWithoutHTML,
	ScrollAreaThumbPropsWithoutHTML,
	ScrollAreaViewportPropsWithoutHTML,
} from "bits-ui";
import {
	ScrollAreaTypeProp,
	ScrollAreaVisibleHiddenProp,
} from "./extended-types/scroll-area/index.js";
import { OrientationProp } from "./extended-types/shared/index.js";
import {
	childrenSnippet,
	createApiSchema,
	createDataAttrSchema,
	createEnumProp,
	createNumberProp,
	dirProp,
	forceMountProp,
	refProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";

export const root = createApiSchema<ScrollAreaRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The container of all scroll area components. Overflow is hidden on this element to prevent double scrollbars.",
	props: {
		type: createEnumProp({
			options: ["hover", "scroll", "auto", "always"],
			default: "'hover'",
			description: "The type of scroll area.",
			definition: ScrollAreaTypeProp,
		}),
		scrollHideDelay: createNumberProp({
			description:
				"The delay in milliseconds before the scroll area hides itself when using `'hover'` or `'scroll'` type.",
			default: "600",
		}),
		dir: dirProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "scroll-area-root",
			description: "Present on the root element.",
		}),
	],
});

export const viewport = createApiSchema<ScrollAreaViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"The component which wraps the content and is responsible for computing the scroll area size.",
	props: {
		ref: refProp({ elType: "HTMLDivElement" }),
		children: childrenSnippet(),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "scroll-area-viewport",
			description: "Present on the viewport element.",
		}),
	],
});

export const scrollbar = createApiSchema<ScrollAreaScrollbarPropsWithoutHTML>({
	title: "Scrollbar",
	description: "A scrollbar of the scroll area.",
	props: {
		orientation: createEnumProp({
			options: ["horizontal", "vertical"],
			description: "The orientation of the scrollbar.",
			required: true,
			definition: OrientationProp,
		}),
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "state",
			description: "The visibility state of the scrollbar",
			definition: ScrollAreaVisibleHiddenProp,
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "scroll-area-scrollbar-x",
			description: "Present on the `'horizontal'` scrollbar element.",
		}),
		createDataAttrSchema({
			name: "scroll-area-scrollbar-y",
			description: "Present on the `'vertical'` scrollbar element.",
		}),
	],
});

export const thumb = createApiSchema<ScrollAreaThumbPropsWithoutHTML>({
	title: "Thumb",
	description: "A thumb of a scrollbar in the scroll area.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "state",
			description: "The visibility state of the scrollbar",
			definition: ScrollAreaVisibleHiddenProp,
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "scroll-area-thumb-x",
			description: "Present on the `'horizontal'` thumb element.",
		}),
		createDataAttrSchema({
			name: "scroll-area-thumb-y",
			description: "Present on the `'vertical'` thumb element.",
		}),
	],
});

export const corner = createApiSchema<ScrollAreaCornerPropsWithoutHTML>({
	title: "Corner",
	description: "The corner element between the X and Y scrollbars.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "scroll-area-corner",
			description: "Present on the corner element.",
		}),
	],
});

export const scrollArea = [root, viewport, scrollbar, thumb, corner];
