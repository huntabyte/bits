---
title: WithoutChildrenOrChild
description: A type helper to exclude the child ad children snippet props from a component.
---

The `WithoutChildrenOrChild` type helper is used to exclude the `child` and `children` props from a component. This is useful when you're building custom component wrappers that populate the `children` prop of a component and don't provide a way to pass a custom `children` or `child` snippet.

To learn more about the `child` snippet prop, check out the [delegation](/docs/child-snippet) documentation.

```svelte title="CustomAccordionTrigger.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";

	let {
		title,
		...restProps
	}: WithoutChildrenOrChild<
		Accordion.TriggerProps & {
			title: string;
		}
	> = $props();
</script>

<Accordion.Trigger>
	{title}
</Accordion.Trigger>
```

Now, the `CustomAccordionTrigger` component won't expose `children` or `child` props to the user, but will expose the other root component props.
