---
title: WithoutChild
description: A type helper to exclude the child snippet prop from a component.
---

The `WithoutChild` type helper is used to exclude the `child` snippet prop from a component. This is useful when you're building custom component wrappers that populate the `children` prop of a component and don't provide a way to pass a custom `child` snippet.

To learn more about the `child` snippet prop, check out the [delegation](/docs/child-snippet) documentation.

```svelte title="CustomAccordionHeader.svelte"
<script lang="ts">
	import { Accordion, type WithoutChild } from "bits-ui";

	let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
</script>

<Accordion.Header {...restProps}>
	<Accordion.Trigger>
		{@render children?.()}
	</Accordion.Trigger>
</Accordion.Header>
```
