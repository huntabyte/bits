```ts
type Page = {
	type: "page";
	value: number;
};

type Ellipsis = {
	type: "ellipsis";
};

type PageItem = (Page | Ellipsis) & {
	/**  A unique key to be used as the key in a svelte `#each` block. */
	key: string;
};

type ChildSnippetProps = {
	/** The items to iterate over and render for the pagination component */
	pages: PageItem[];
	/** The range of pages to render */
	range: { start: number; end: number };
	/** The currently active page */
	currentPage: number;
	props: Record<string, unknown>;
};
```
