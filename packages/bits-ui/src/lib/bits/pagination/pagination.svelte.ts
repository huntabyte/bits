import { useRefById } from "svelte-toolbelt";
import { Context } from "runed";
import type { Page, PageItem } from "./types.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { getDataOrientation } from "$lib/internal/attrs.js";
import { getElemDirection } from "$lib/internal/locale.js";
import { kbd } from "$lib/internal/kbd.js";
import { getDirectionalKeys } from "$lib/internal/get-directional-keys.js";
import { type Orientation, useId } from "$lib/shared/index.js";

const ROOT_ATTR = "data-pagination-root";
const PAGE_ATTR = "data-pagination-page";
const PREV_ATTR = "data-pagination-prev";
const NEXT_ATTR = "data-pagination-next";

type PaginationRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		count: number;
		perPage: number;
		siblingCount: number;
		orientation: Orientation;
		loop: boolean;
	}> &
		WritableBoxedValues<{
			page: number;
		}>
>;

class PaginationRootState {
	id: PaginationRootStateProps["id"];
	ref: PaginationRootStateProps["ref"];
	orientation: PaginationRootStateProps["orientation"];
	count: PaginationRootStateProps["count"];
	perPage: PaginationRootStateProps["perPage"];
	siblingCount: PaginationRootStateProps["siblingCount"];
	page: PaginationRootStateProps["page"];
	loop: PaginationRootStateProps["loop"];
	totalPages = $derived.by(() => {
		if (this.count.current === 0) return 1;
		return Math.ceil(this.count.current / this.perPage.current);
	});
	range = $derived.by(() => {
		const start = (this.page.current - 1) * this.perPage.current;
		const end = Math.min(start + this.perPage.current, this.count.current);
		return { start, end };
	});
	pages = $derived.by(() =>
		getPageItems({
			page: this.page.current,
			totalPages: this.totalPages,
			siblingCount: this.siblingCount.current,
		})
	);

	constructor(props: PaginationRootStateProps) {
		this.id = props.id;
		this.perPage = props.perPage;
		this.count = props.count;
		this.siblingCount = props.siblingCount;
		this.page = props.page;
		this.orientation = props.orientation;
		this.loop = props.loop;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	setPage(page: number) {
		this.page.current = page;
	}

	getPageTriggerNodes() {
		const node = this.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>("[data-pagination-page]"));
	}

	getButtonNode(type: "prev" | "next") {
		const node = this.ref.current;
		if (!node) return;
		return node.querySelector<HTMLElement>(`[data-pagination-${type}]`);
	}

	hasPrevPage = $derived.by(() => this.page.current > 1);
	hasNextPage = $derived.by(() => this.page.current < this.totalPages);

	prevPage() {
		this.page.current = Math.max(this.page.current - 1, 1);
	}

	nextPage() {
		this.page.current = Math.min(this.page.current + 1, this.totalPages);
	}

	snippetProps = $derived.by(() => ({
		pages: this.pages,
		range: this.range,
		currentPage: this.page.current,
	}));

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.orientation.current),
				[ROOT_ATTR]: "",
			}) as const
	);
}

//
// PAGE
//

type PaginationPageStateProps = WithRefProps<
	ReadableBoxedValues<{
		page: Page;
		disabled: boolean;
	}>
>;

class PaginationPageState {
	#id: PaginationPageStateProps["id"];
	#ref: PaginationPageStateProps["ref"];
	#root: PaginationRootState;
	#disabled: PaginationPageStateProps["disabled"];
	page: PaginationPageStateProps["page"];
	#isSelected = $derived.by(() => this.page.current.value === this.#root.page.current);

	constructor(props: PaginationPageStateProps, root: PaginationRootState) {
		this.#root = root;
		this.#id = props.id;
		this.page = props.page;
		this.#ref = props.ref;
		this.#disabled = props.disabled;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#disabled.current) return;
		if (e.button !== 0) return;
		this.#root.setPage(this.page.current.value);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#root.setPage(this.page.current.value);
		} else {
			handleTriggerKeydown(e, this.#ref.current, this.#root);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-label": `Page ${this.page.current.value}`,
				"data-value": `${this.page.current.value}`,
				"data-selected": this.#isSelected ? "" : undefined,
				[PAGE_ATTR]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);
}

//
// NEXT/PREV BUTTON
//

type PaginationButtonStateProps = WithRefProps<{
	type: "prev" | "next";
}> &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class PaginationButtonState {
	id: PaginationButtonStateProps["id"];
	#ref: PaginationButtonStateProps["ref"];
	#disabled: PaginationButtonStateProps["disabled"];
	#root: PaginationRootState;
	type = $state() as PaginationButtonStateProps["type"];

	constructor(props: PaginationButtonStateProps, root: PaginationRootState) {
		this.#root = root;
		this.id = props.id;
		this.type = props.type;
		this.#ref = props.ref;
		this.#disabled = props.disabled;

		useRefById({
			id: this.id,
			ref: this.#ref,
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#action() {
		this.type === "prev" ? this.#root.prevPage() : this.#root.nextPage();
	}

	#isDisabled = $derived.by(() => {
		if (this.#disabled.current) return true;
		if (this.type === "prev") return !this.#root.hasPrevPage;
		if (this.type === "next") return !this.#root.hasNextPage;
		return false;
	});

	onclick(e: BitsMouseEvent) {
		if (this.#disabled.current) return;
		if (e.button !== 0) return;
		this.#action();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#action();
		} else {
			handleTriggerKeydown(e, this.#ref.current, this.#root);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				[PREV_ATTR]: this.type === "prev" ? "" : undefined,
				[NEXT_ATTR]: this.type === "next" ? "" : undefined,
				disabled: this.#isDisabled,
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);
}

//
// HELPERS
//

/**
 * Shared logic for handling keyboard navigation on
 * pagination page triggers and prev/next buttons.
 *
 *
 * @param e - KeyboardEvent
 * @param node - The HTMLElement that triggered the event.
 * @param root - The root pagination state instance
 */
function handleTriggerKeydown(
	e: KeyboardEvent,
	node: HTMLElement | null,
	root: PaginationRootState
) {
	if (!node || !root.ref.current) return;
	const items = root.getPageTriggerNodes();
	const nextButton = root.getButtonNode("next");
	const prevButton = root.getButtonNode("prev");

	if (prevButton) {
		items.unshift(prevButton);
	}
	if (nextButton) {
		items.push(nextButton);
	}

	const currentIndex = items.indexOf(node);

	const dir = getElemDirection(root.ref.current);

	const { nextKey, prevKey } = getDirectionalKeys(dir, root.orientation.current);

	const loop = root.loop.current;

	const keyToIndex = {
		[nextKey]: currentIndex + 1,
		[prevKey]: currentIndex - 1,
		[kbd.HOME]: 0,
		[kbd.END]: items.length - 1,
	};

	let itemIndex = keyToIndex[e.key];
	if (itemIndex === undefined) return;
	e.preventDefault();

	if (itemIndex < 0 && loop) {
		itemIndex = items.length - 1;
	} else if (itemIndex === items.length && loop) {
		itemIndex = 0;
	}

	const itemToFocus = items[itemIndex];
	if (!itemToFocus) return;

	itemToFocus.focus();
}

type GetPageItemsProps = {
	page?: number;
	totalPages: number;
	siblingCount?: number;
};

/**
 * Returns an array of page items used to render out the
 * pagination page triggers.
 *
 * Credit: https://github.com/melt-ui/melt-ui
 */
function getPageItems({ page = 1, totalPages, siblingCount = 1 }: GetPageItemsProps): PageItem[] {
	const pageItems: PageItem[] = [];
	const pagesToShow = new Set([1, totalPages]);
	const firstItemWithSiblings = 3 + siblingCount;
	const lastItemWithSiblings = totalPages - 2 - siblingCount;

	if (firstItemWithSiblings > lastItemWithSiblings) {
		for (let i = 2; i <= totalPages - 1; i++) {
			pagesToShow.add(i);
		}
	} else if (page < firstItemWithSiblings) {
		for (let i = 2; i <= Math.min(firstItemWithSiblings, totalPages); i++) {
			pagesToShow.add(i);
		}
	} else if (page > lastItemWithSiblings) {
		for (let i = totalPages - 1; i >= Math.max(lastItemWithSiblings, 2); i--) {
			pagesToShow.add(i);
		}
	} else {
		for (
			let i = Math.max(page - siblingCount, 2);
			i <= Math.min(page + siblingCount, totalPages);
			i++
		) {
			pagesToShow.add(i);
		}
	}

	function addPage(value: number): void {
		pageItems.push({ type: "page", value, key: `page-${value}` });
	}

	function addEllipsis(): void {
		const id = useId();
		pageItems.push({ type: "ellipsis", key: `ellipsis-${id}` });
	}

	let lastNumber = 0;

	for (const p of Array.from(pagesToShow).sort((a, b) => a - b)) {
		if (p - lastNumber > 1) {
			addEllipsis();
		}
		addPage(p);
		lastNumber = p;
	}

	return pageItems;
}

const PaginationRootContext = new Context<PaginationRootState>("Pagination.Root");

export function usePaginationRoot(props: PaginationRootStateProps) {
	return PaginationRootContext.set(new PaginationRootState(props));
}

export function usePaginationPage(props: PaginationPageStateProps) {
	return new PaginationPageState(props, PaginationRootContext.get());
}

export function usePaginationButton(props: PaginationButtonStateProps) {
	return new PaginationButtonState(props, PaginationRootContext.get());
}
