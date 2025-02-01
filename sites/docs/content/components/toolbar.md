---
title: Toolbar
description: Displays frequently used actions or tools in a compact, easily accessible bar.
---

<script>
	import { APISection, ComponentPreviewV2, ToolbarDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="toolbar-demo" comp="Toolbar">

{#snippet preview()}
<ToolbarDemo slot="preview" />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Toolbar } from "bits-ui";
</script>

<Toolbar.Root>
	<Toolbar.Group>
		<Toolbar.GroupItem />
	</Toolbar.Group>
	<Toolbar.Link />
	<Toolbar.Button />
</Toolbar.Root>
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the component's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Toolbar } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "item-1")}> Press item 1 </button>

<Toolbar.Root>
	<Toolbar.Group type="single" bind:value={myValue}>
		<!-- ... -->
	</Toolbar.Group>
</Toolbar.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via clicking on an item)
-   Allows external control (e.g., toggling an item via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Toolbar } from "bits-ui";
	let myValue = $state("");
</script>

<Toolbar.Root>
	<Toolbar.Group
		type="single"
		value={myValue}
		onValueChange={(v) => {
			myValue = v;
			// additional logic here.
		}}
	>
		<!-- ... -->
	</Toolbar.Group>
</Toolbar.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Toolbar } from "bits-ui";
	let myValue = $state("");
</script>

<Toolbar.Root>
	<Toolbar.Group type="single" bind:value={() => myValue, (newValue) => (myValue = newValue)}>
		<!-- ... -->
	</Toolbar.Group>
</Toolbar.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

<APISection {schemas} />
