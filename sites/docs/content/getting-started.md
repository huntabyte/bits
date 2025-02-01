---
title: Getting Started
description: Learn how to get started using Bits in your app.
---

## Installation

Install bits using your favorite package manager.

```bash
npm install bits-ui
```

You can then import and start using them in your app.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
</script>

<Accordion.Root>
	<Accordion.Item>
		<Accordion.Header>
			<Accordion.Trigger>First</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>First accordion content</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item>
		<Accordion.Header>
			<Accordion.Trigger>Second</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>Second accordion content</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item>
		<Accordion.Header>
			<Accordion.Trigger>Third</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>Third accordion content</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
```
