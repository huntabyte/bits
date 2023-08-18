---
title: Accordion
description: Organizes content in collapsible sections, enabling users to expand or collapse them as needed.
---

<script>
	import { APISection } from '@/components'
	export let schemas
</script>

## Structure

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
</script>

<Accordion.Root>
	<Accordion.Item>
		<Accordion.Header>
			<Accordion.Trigger />
		</Accordion.Header>
		<Accordion.Content />
	</Accordion.Item>
</Accordion.Root>
```

<APISection {schemas} />
