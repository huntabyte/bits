import { DateValueProp } from "./shared/index.js";
import type { PropType } from "$lib/types/index.js";
import { PaginationPageItemProp } from "./pagination/index.js";

export const dateValueProp: PropType = {
	type: "DateValue",
	definition: DateValueProp,
};

export const pageItemProp: PropType = {
	type: "PageItem",
	definition: PaginationPageItemProp,
};
