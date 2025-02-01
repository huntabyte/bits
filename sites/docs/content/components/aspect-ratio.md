---
title: Aspect Ratio
description: Displays content while maintaining a specified aspect ratio, ensuring consistent visual proportions.
---

<script>
	import { APISection, ComponentPreviewV2, AspectRatioDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="aspect-ratio-demo" comp="Aspect Ratio" nonExpandableItems={["App.svelte"]}>

{#snippet preview()}
<AspectRatioDemo />
{/snippet}

</ComponentPreviewV2>

## Architecture

-   **Root**: The root component which contains the aspect ratio logic

## Structure

Here's an overview of how the Aspect Ratio component is structured in code:

```svelte
<script lang="ts">
	import { AspectRatio } from "bits-ui";
</script>

<AspectRatio.Root />
```

## Reusable Component

If you plan on using a lot of `AspectRatio` components throughout your application, you can create a reusable component that combines the `AspectRatio.Root` and whatever other elements you'd like to render within it. In the following example, we're creating a reusable `MyAspectRatio` component that takes in a `src` prop and renders an `img` element with the `src` prop.

```svelte title="MyAspectRatio.svelte"
<script lang="ts">
	import { AspectRatio, type WithoutChildrenOrChild } from "bits-ui";

	let {
		src,
		alt,
		ref = $bindable(null),
		imageRef = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<AspectRatio.RootProps> & {
		src: string;
		alt: string;
		imageRef?: HTMLImageElement | null;
	} = $props();
</script>

<AspectRatio.Root {...restProps} bind:ref>
	<img {src} {alt} bind:this={imageRef} />
</AspectRatio.Root>
```

You can then use the `MyAspectRatio` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyAspectRatio from "$lib/components/MyAspectRatio.svelte";
</script>

<MyAspectRatio src="https://example.com/image.jpg" alt="an abstract painting" ratio={4 / 3} />
```

## Custom Ratio

Use the `ratio` prop to set a custom aspect ratio for the image.

```svelte /ratio/
<AspectRatio.Root ratio={16 / 9}>
	<!-- ... -->
</AspectRatio.Root>
```

<APISection {schemas} />
