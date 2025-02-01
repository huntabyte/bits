import type {
	AccordionContentPropsWithoutHTML,
	AccordionHeaderPropsWithoutHTML,
	AccordionItemPropsWithoutHTML,
	AccordionRootPropsWithoutHTML,
	AccordionTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createCSSVarSchema,
	createDataAttrSchema,
	createEnumDataAttr,
	createEnumProp,
	createFunctionProp,
	createStringProp,
	createUnionProp,
	disabledDataAttr,
	forceMountProp,
	orientationDataAttr,
	withChildProps,
} from "./helpers.js";
import {
	HeaderLevelProp,
	OnChangeStringOrArrayProp,
	OpenClosedProp,
	OrientationProp,
	SingleOrMultipleProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";
import {
	ContentChildSnippetProps,
	ContentChildrenSnippetProps,
} from "./extended-types/accordion/index.js";
import * as C from "$lib/content/constants.js";

const stateDataAttr = createEnumDataAttr({
	name: "state",
	description: "Whether the accordion item is open or closed.",
	options: ["open", "closed"],
	definition: OpenClosedProp,
});

const root = createApiSchema<AccordionRootPropsWithoutHTML>({
	title: "Root",
	description: "The root accordion component used to set and manage the state of the accordion.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			definition: SingleOrMultipleProp,
			description:
				"The type of accordion. If set to `'multiple'`, the accordion will allow multiple items to be open at the same time. If set to `single`, the accordion will only allow a single item to be open.",
			required: true,
		}),
		value: createUnionProp({
			options: ["string[]", "string"],
			definition: StringOrArrayStringProp,
			description:
				"The value of the currently active accordion item. If `type` is `'single'`, this should be a string. If `type` is `'multiple'`, this should be an array of strings.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback function called when the active accordion item value changes. If the `type` is `'single'`, the argument will be a string. If `type` is `'multiple'`, the argument will be an array of strings.",
		}),
		disabled: createBooleanProp({
			description:
				"Whether or not the accordion is disabled. When disabled, the accordion cannot be interacted with.",
			default: C.FALSE,
		}),
		loop: createBooleanProp({
			description:
				"Whether or not the accordion should loop through items when reaching the end.",
			default: C.FALSE,
		}),
		orientation: createEnumProp({
			options: ["vertical", "horizontal"],
			definition: OrientationProp,
			description: "The orientation of the accordion.",
			default: "vertical",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		orientationDataAttr,
		disabledDataAttr,
		createDataAttrSchema({
			name: "accordion-root",
			description: "Present on the root element.",
		}),
	],
});

const item = createApiSchema<AccordionItemPropsWithoutHTML>({
	title: "Item",
	description: "An accordion item.",
	props: {
		disabled: createBooleanProp({
			description: "Whether or not the accordion item is disabled.",
			default: C.FALSE,
		}),
		value: createStringProp({
			description:
				"The value of the accordion item. This is used to identify when the item is open or closed. If not provided, a unique ID will be generated for this value.",
			default: "A random unique ID",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		stateDataAttr,
		disabledDataAttr,
		orientationDataAttr,
		createDataAttrSchema({
			name: "accordion-item",
			description: "Present on the item element.",
		}),
	],
});

const trigger = createApiSchema<AccordionTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button responsible for toggling the accordion item.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		orientationDataAttr,
		disabledDataAttr,
		createDataAttrSchema({
			name: "accordion-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

const content = createApiSchema<AccordionContentPropsWithoutHTML>({
	title: "Content",
	description: "The accordion item content, which is displayed when the item is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: ContentChildrenSnippetProps,
			childDef: ContentChildSnippetProps,
		}),
	},
	dataAttributes: [
		orientationDataAttr,
		disabledDataAttr,
		createDataAttrSchema({
			name: "accordion-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		createCSSVarSchema({
			name: "--bits-accordion-content-height",
			description: "The height of the accordion content element.",
		}),
		createCSSVarSchema({
			name: "--bits-accordion-content-width",
			description: "The width of the accordion content element.",
		}),
	],
});

const header = createApiSchema<AccordionHeaderPropsWithoutHTML>({
	title: "Header",
	description: "The header of the accordion item.",
	props: {
		level: createUnionProp({
			options: ["1", "2", "3", "4", "5", "6"],
			definition: HeaderLevelProp,
			description:
				"The heading level of the header. This will be set as the `aria-level` attribute.",
			default: "3",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		orientationDataAttr,
		disabledDataAttr,
		createEnumDataAttr({
			name: "heading-level",
			description: "The heading level of the element.",
			options: ["1", "2", "3", "4", "5", "6"],
			definition: HeaderLevelProp,
		}),
		createDataAttrSchema({
			name: "accordion-header",
			description: "Present on the header element.",
		}),
	],
});

export const accordion = [root, item, header, trigger, content];
