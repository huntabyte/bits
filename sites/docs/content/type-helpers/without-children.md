---
title: WithoutChildren
description: A type helper to exclude the children snippet prop from a component.
---

The `WithoutChildren` type helper is used to exclude the `children` snippet prop from a component. This is useful when you're building custom component wrappers that populate the `children` prop of a component.

```svelte title="CustomAccordion.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildren } from "bits-ui";

	let { value, onValueChange, ...restProps }: WithoutChildren<Accordion.RootProps> = $props();
</script>

<Accordion.Root {...restProps}>
	<Accordion.Item {value} {onValueChange}>
		<Accordion.Header />
		<Accordion.Trigger />
		<Accordion.Content />
	</Accordion.Item>
</Accordion.Root>
```

In the example above, we're using the `WithoutChildren` type helper to exclude the `children` snippet prop from the `Accordion.Root` component. This ensures our exposed props are consistent with what is being used internally.
