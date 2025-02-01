export { default as Root } from "./components/pagination.svelte";
export { default as PrevButton } from "./components/pagination-prev-button.svelte";
export { default as NextButton } from "./components/pagination-next-button.svelte";
export { default as Page } from "./components/pagination-page.svelte";

export type {
	PaginationRootProps as RootProps,
	PaginationPrevButtonProps as PrevButtonProps,
	PaginationNextButtonProps as NextButtonProps,
	PaginationPageProps as PageProps,
} from "./types.js";
