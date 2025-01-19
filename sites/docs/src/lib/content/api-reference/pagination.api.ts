import type {
	PaginationNextButtonPropsWithoutHTML,
	PaginationPagePropsWithoutHTML,
	PaginationPrevButtonPropsWithoutHTML,
	PaginationRootPropsWithoutHTML,
} from "bits-ui";
import { pageItemProp } from "./extended-types/index.js";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	withChildProps,
} from "./helpers.js";
import {
	PaginationChildSnippetProps,
	PaginationChildrenSnippetProps,
	PaginationOnPageChangeProp,
} from "./extended-types/pagination/index.js";
import { OrientationProp } from "./extended-types/shared/index.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<PaginationRootPropsWithoutHTML>({
	title: "Root",
	description: "The root pagination component which contains all other pagination components.",
	props: {
		count: createNumberProp({
			description: "The total number of items.",
			required: true,
		}),
		page: createNumberProp({
			description:
				"The selected page. You can bind this to a variable to control the selected page from outside the component.",
			bindable: true,
		}),
		onPageChange: createFunctionProp({
			definition: PaginationOnPageChangeProp,
			description: "A function called when the selected page changes.",
		}),
		perPage: createNumberProp({
			description: "The number of items per page.",
			default: "1",
		}),
		siblingCount: createNumberProp({
			description: "The number of page triggers to show on either side of the current page.",
			default: "1",
		}),
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the pagination should loop through the items when reaching the end while navigating with the keyboard.",
		}),
		orientation: createEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			description:
				"The orientation of the pagination. This determines how keyboard navigation will work with the component.",
			definition: OrientationProp,
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			childDef: PaginationChildSnippetProps,
			childrenDef: PaginationChildrenSnippetProps,
		}),
	},
});

export const page = createApiSchema<PaginationPagePropsWithoutHTML>({
	title: "Page",
	description: "A button that triggers a page change.",
	props: {
		page: {
			type: pageItemProp,
			description: "The page item this component represents.",
		},
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "selected",
			description: "Present on the current page element.",
		}),
		createDataAttrSchema({
			name: "pagination-page",
			description: "Present on the page trigger element.",
		}),
	],
});

export const prevButton = createApiSchema<PaginationPrevButtonPropsWithoutHTML>({
	title: "PrevButton",
	description: "The previous button of the pagination.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "pagination-prev-button",
			description: "Present on the previous button element.",
		}),
	],
});

export const nextButton = createApiSchema<PaginationNextButtonPropsWithoutHTML>({
	title: "NextButton",
	description: "The next button of the pagination.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "pagination-next-button",
			description: "Present on the next button element.",
		}),
	],
});

export const pagination = [root, page, prevButton, nextButton];
