---
title: Button
description: A component that if passed a `href` prop will render an anchor element instead of a button element.
---

<script>
	import { APISection, ComponentPreviewV2, ButtonDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="button-demo" comp="Avatar" nonExpandableItems={["App.svelte"]}>

{#snippet preview()}
<ButtonDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Button } from "bits-ui";
</script>

<Button.Root />
```

<APISection {schemas} />
