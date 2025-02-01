import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";

type PaginationSnippetProps = {
	pages: PageItem[];
	range: { start: number; end: number };
	currentPage: number;
};

export type PaginationRootPropsWithoutHTML = WithChild<
	{
		/**
		 * The total number of items to be paginated.
		 */
		count: number;

		/**
		 * The number of items per page.
		 *
		 * @defaultValue 1
		 */
		perPage?: number;

		/**
		 * The number of visible items before and after the current page.
		 *
		 * @defaultValue 1
		 */
		siblingCount?: number;

		/**
		 * The current page number.
		 *
		 * @defaultValue 1
		 */
		page?: number;

		/**
		 * A callback function called when the page changes.
		 */
		onPageChange?: OnChangeFn<number>;

		/**
		 * Whether keyboard navigation should loop back to the
		 * first or last page trigger when reaching either end.
		 *
		 * @defaultValue false
		 */
		loop?: boolean;

		/**
		 * The orientation of the pagination component. Used to
		 * determine how keyboard navigation should work between
		 * pages.
		 *
		 * @defaultValue "horizontal"
		 */
		orientation?: "horizontal" | "vertical";
	},
	PaginationSnippetProps
>;

export type PaginationRootProps = PaginationRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, PaginationRootPropsWithoutHTML>;

export type PaginationPagePropsWithoutHTML = WithChild<{
	page: Page;
}>;

export type PaginationPageProps = PaginationPagePropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, PaginationPagePropsWithoutHTML>;

export type PaginationPrevButtonPropsWithoutHTML = WithChild;

export type PaginationPrevButtonProps = PaginationPrevButtonPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, PaginationPrevButtonPropsWithoutHTML>;

export type PaginationNextButtonPropsWithoutHTML = WithChild;

export type PaginationNextButtonProps = PaginationNextButtonPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, PaginationNextButtonPropsWithoutHTML>;

export type Page = {
	type: "page";
	value: number;
};

export type Ellipsis = {
	type: "ellipsis";
};

export type PageItem = (Page | Ellipsis) & {
	/**
	 * A unique key to be used as the key in a svelte `#each` block.
	 */
	key: string;
};
