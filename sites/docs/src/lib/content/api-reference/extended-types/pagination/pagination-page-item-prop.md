```ts
export type Page = {
	type: "page";
	/** The page number the `PageItem` represents */
	value: number;
};

export type Ellipsis = {
	type: "ellipsis";
};

export type PageItem = (Page | Ellipsis) & {
	/** Unique key for the item, for svelte #each block */
	key: string;
};
```
