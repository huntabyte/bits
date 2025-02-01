---
title: Separator
description: Visually separates content or UI elements for clarity and organization.
---

<script>
	import { APISection, ComponentPreviewV2, SeparatorDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="separator-demo" comp="Separator">

{#snippet preview()}
<SeparatorDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Separator } from "bits-ui";
</script>

<Separator.Root />
```

<APISection {schemas} />
