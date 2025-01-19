---
title: Navigation Menu
description: A list of links that allow users to navigate between pages of a website.
navLabel: New
---

<script>
	import { APISection, ComponentPreviewV2, NavigationMenuDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="navigation-menu-demo" comp="Navigation Menu">

{#snippet preview()}
<NavigationMenuDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { NavigationMenu } from "bits-ui";
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger />
			<NavigationMenu.Content />
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger />
			<NavigationMenu.Content>
				<NavigationMenu.Link />
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link />
		</NavigationMenu.Item>
		<NavigationMenu.Indicator />
	</NavigationMenu.List>
	<NavigationMenu.Viewport />
</NavigationMenu.Root>
```

<APISection {schemas} />
