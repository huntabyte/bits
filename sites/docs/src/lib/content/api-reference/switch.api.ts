import type { SwitchRootPropsWithoutHTML, SwitchThumbPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createFunctionProp,
	createStringProp,
	withChildProps,
} from "./helpers.js";
import {
	SwitchCheckedDataAttr,
	SwitchRootChildSnippetProps,
	SwitchRootChildrenSnippetProps,
	SwitchRootOnCheckedChangeProp,
} from "./extended-types/switch/index.js";
import * as C from "$lib/content/constants.js";

const stateDataAttr = createDataAttrSchema({
	name: "state",
	description: "The switch's checked state.",
	definition: SwitchCheckedDataAttr,
});

const root = createApiSchema<SwitchRootPropsWithoutHTML>({
	title: "Root",
	description: "The root switch component used to set and manage the state of the switch.",
	props: {
		checked: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is checked.",
			bindable: true,
		}),
		onCheckedChange: createFunctionProp({
			definition: SwitchRootOnCheckedChangeProp,
			description: "A callback function called when the checked state of the switch changes.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		name: createStringProp({
			description:
				"The name of the hidden input element, used to identify the input in form submissions.",
		}),
		required: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is required to be checked.",
		}),
		value: createStringProp({
			description:
				"The value of the hidden input element to be used in form submissions when the switch is checked.",
		}),
		...withChildProps({
			elType: "HTMLButtonElement",
			childrenDef: SwitchRootChildrenSnippetProps,
			childDef: SwitchRootChildSnippetProps,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "checked",
			description: "Present when the switch is checked.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the switch is disabled.",
		}),
		createDataAttrSchema({
			name: "switch-root",
			description: "Present on the root element.",
		}),
	],
});

const thumb = createApiSchema<SwitchThumbPropsWithoutHTML>({
	title: "Thumb",
	description: "The thumb on the switch used to indicate the switch's state.",
	props: withChildProps({
		elType: "HTMLSpanElement",
		childrenDef: SwitchRootChildrenSnippetProps,
		childDef: SwitchRootChildSnippetProps,
	}),
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "checked",
			description: "Present when the switch is checked.",
		}),
		createDataAttrSchema({
			name: "switch-thumb",
			description: "Present on the thumb element.",
		}),
	],
});

export const switchData = [root, thumb];
