```ts
type PinInputCell = {
	/** The character displayed in the cell. */
	char: string | null | undefined;
	/** Whether the cell is active. */
	isActive: boolean;
	/** Whether the cell has a fake caret. */
	hasFakeCaret: boolean;
};

type SnippetProps = {
	cells: PinInputCell[];
	props: Record<string, unknown>;
};
```
