---
title: Scroll Area
description: Provides a consistent scroll area across platforms.
---

<script>
	import { APISection, ComponentPreviewV2, ScrollAreaDemo, ScrollAreaDemoCustom } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="scroll-area-demo" comp="Scroll Area">

{#snippet preview()}
<ScrollAreaDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { ScrollArea } from "bits-ui";
</script>

<ScrollArea.Root>
	<ScrollArea.Viewport>
		<!-- Scrollable content here -->
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar orientation="vertical">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar orientation="horizontal">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
```

## Reusable Components

If you're planning to use the Scroll Area throughout your application, it's recommended to create a reusable component to reduce the amount of code you need to write each time.

This example shows you how to create a Scroll Area component that accepts a few custom props that make it more capable.

```svelte title="MyScrollArea.svelte"
<script lang="ts">
	import { ScrollArea, type WithoutChild } from "bits-ui";

	type Props = WithoutChild<ScrollArea.RootProps> & {
		orientation: "vertical" | "horizontal" | "both";
		viewportClasses?: string;
	};

	let {
		ref = $bindable(null),
		orientation = "vertical",
		viewportClasses,
		children,
		...restProps
	}: Props = $props();
</script>

{#snippet Scrollbar({ orientation }: { orientation: "vertical" | "horizontal" })}
	<ScrollArea.Scrollbar {orientation}>
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
{/snippet}

<ScrollArea.Root bind:ref {...restProps}>
	<ScrollArea.Viewport class={viewportClasses}>
		{@render children?.()}
	</ScrollArea.Viewport>
	{#if orientation === "vertical" || orientation === "both"}
		{@render Scrollbar({ orientation: "vertical" })}
	{/if}
	{#if orientation === "horizontal" || orientation === "both"}
		{@render Scrollbar({ orientation: "horizontal" })}
	{/if}
	<ScrollArea.Corner />
</ScrollArea.Root>
```

We'll use this custom component in the following examples to demonstrate how to customize the behavior of the Scroll Area.

## Scroll Area Types

### Hover

The `hover` type is the default type of the scroll area, demonstrated in the featured example above. It only shows scrollbars when the user hovers over the scroll area and the content is larger than the viewport.

```svelte {1}
<MyScrollArea type="hover">
	<!-- ... -->
</MyScrollArea>
```

<ScrollAreaDemoCustom type="hover" />

### Scroll

The `scroll` type displays the scrollbars when the user scrolls the content. This is similar to the behavior of MacOS.

```svelte {1}
<MyScrollArea type="scroll">
	<!-- ... -->
</MyScrollArea>
```

<ScrollAreaDemoCustom type="scroll" />

### Auto

The `auto` type behaves similarly to your typical browser scrollbars. When the content is larger than the viewport, the scrollbars will appear and remain visible at all times.

```svelte {1}
<MyScrollArea type="auto">
	<!-- ... -->
</MyScrollArea>
```

<ScrollAreaDemoCustom type="auto" />

### Always

The `always` type behaves as if you set `overflow: scroll` on the scroll area. Scrollbars will always be visible, even when the content is smaller than the viewport. We've also set the `orientation` prop on the `MyScrollArea` to `'both'` to ensure both scrollbars are rendered.

```svelte {1}
<MyScrollArea type="always" orientation="both">
	<!-- ... -->
</MyScrollArea>
```

<ScrollAreaDemoCustom type="always" orientation="both" />

## Customizing the Hide Delay

You can customize the hide delay of the scrollbars using the `scrollHideDelay` prop.

```svelte {1}
<MyScrollArea scrollHideDelay={10}>
	<!-- ... -->
</MyScrollArea>
```

<ScrollAreaDemoCustom scrollHideDelay={10} />

<APISection {schemas} />
