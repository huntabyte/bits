---
title: Label
description: Identifies or describes associated UI elements.
---

<script>
	import { APISection, ComponentPreviewV2, LabelDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="label-demo" comp="Label">

{#snippet preview()}
<LabelDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Label } from "bits-ui";
</script>

<Label.Root />
```

<APISection {schemas} />
