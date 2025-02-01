import type {
	AlertDialogActionPropsWithoutHTML,
	AlertDialogCancelPropsWithoutHTML,
	AlertDialogContentPropsWithoutHTML,
	AlertDialogDescriptionPropsWithoutHTML,
	AlertDialogOverlayPropsWithoutHTML,
	AlertDialogPortalPropsWithoutHTML,
	AlertDialogRootPropsWithoutHTML,
	AlertDialogTitlePropsWithoutHTML,
	AlertDialogTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	HeaderLevelProp,
	OnOpenChangeProp,
	OpenClosedProp,
} from "./extended-types/shared/index.js";
import {
	DialogContentChildSnippetProps,
	DialogOverlayChildSnippetProps,
} from "./extended-types/dialog/index.js";
import {
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createFunctionProp,
	createUnionProp,
	dismissibleLayerProps,
	escapeLayerProps,
	focusScopeProps,
	forceMountProp,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	restoreScrollDelayProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const stateDataAttr = createDataAttrSchema({
	name: "state",
	definition: OpenClosedProp,
	description: "The state of the alert dialog.",
	isEnum: true,
});

const root = createApiSchema<AlertDialogRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to set and manage the state of the alert dialog.",
	props: {
		open: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the alert dialog is open.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: OnOpenChangeProp,
			description: "A callback function called when the open state changes.",
		}),
		children: childrenSnippet(),
	},
});

const action = createApiSchema<AlertDialogActionPropsWithoutHTML>({
	title: "Action",
	description:
		"The button responsible for taking an action within the alert dialog. This button does not close the dialog out of the box. See the [Form Submission](#form-submission) documentation for more information.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "alert-dialog-action",
			description: "Present on the action element.",
		}),
	],
});

const cancel = createApiSchema<AlertDialogCancelPropsWithoutHTML>({
	title: "Cancel",
	description: "A button used to close the alert dialog without taking an action.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "alert-dialog-cancel",
			description: "Present on the cancel element.",
		}),
	],
});

const content = createApiSchema<AlertDialogContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed within the alert dialog modal.",
	props: {
		...dismissibleLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		forceMount: forceMountProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: preventScrollProp,
		restoreScrollDelay: restoreScrollDelayProp,
		...withChildProps({
			elType: "HTMLDivElement",
			childDef: DialogContentChildSnippetProps,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "alert-dialog-content",
			description: "Present on the content element.",
		}),
	],
});

const title = createApiSchema<AlertDialogTitlePropsWithoutHTML>({
	title: "Title",
	description: "An accessible title for the alert dialog.",
	props: {
		level: createUnionProp({
			definition: HeaderLevelProp,
			options: ["1", "2", "3", "4", "5", "6"],
			description:
				"The heading level of the title. This will be set as the `aria-level` attribute.",
			default: "3",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "alert-dialog-title",
			description: "Present on the title element.",
		}),
	],
});

const description = createApiSchema<AlertDialogDescriptionPropsWithoutHTML>({
	title: "Description",
	description: "An accessible description for the alert dialog.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "alert-dialog-description",
			description: "Present on the description element.",
		}),
	],
});

const trigger = createApiSchema<AlertDialogTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The element which opens the alert dialog on press.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "alert-dialog-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

const overlay = createApiSchema<AlertDialogOverlayPropsWithoutHTML>({
	title: "Overlay",
	description: "An overlay which covers the body when the alert dialog is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			childDef: DialogOverlayChildSnippetProps,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "alert-dialog-overlay",
			description: "Present on the overlay element.",
		}),
	],
});

const portal = createApiSchema<AlertDialogPortalPropsWithoutHTML>({
	title: "Portal",
	description: "A portal which renders the alert dialog into the body when it is open.",
	props: portalProps,
});

export const alertDialog = [
	root,
	trigger,
	content,
	overlay,
	portal,
	action,
	cancel,
	title,
	description,
];
