```ts
type ChildSnippetProps = {
	// Props for the positioning wrapper
	// Do not style this element -
	// styling should be applied to the content element
	wrapperProps: Record<string, unknown>;

	// Props for your content element
	// Apply your custom styles here
	props: Record<string, unknown>;

	// Content visibility state
	// Use this for conditional rendering with
	// Svelte transitions
	open: boolean;
};
```
