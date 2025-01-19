---
title: Progress
description: Visualizes the progress or completion status of a task or process.
---

<script>
	import { APISection, ComponentPreviewV2, ProgressDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="progress-demo" comp="Progress">

{#snippet preview()}
<ProgressDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Progress } from "bits-ui";
</script>

<Progress.Root />
```

<APISection {schemas} />
