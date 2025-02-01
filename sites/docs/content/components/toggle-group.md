---
title: Toggle Group
description: Groups multiple toggle controls, allowing users to enable one or multiple options.
---

<script>
	import { APISection, ComponentPreviewV2, ToggleGroupDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="toggle-group-demo" comp="ToggleGroup">

{#snippet preview()}
<ToggleGroupDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { ToggleGroup } from "bits-ui";
</script>

<ToggleGroup.Root>
	<ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
	<ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

## Single & Multiple

The `ToggleGroup` component supports two `type` props, `'single'` and `'multiple'`. When the `type` is set to `'single'`, the `ToggleGroup` will only allow a single item to be selected at a time, and the type of the `value` prop will be a string.

When the `type` is set to `'multiple'`, the `ToggleGroup` will allow multiple items to be selected at a time, and the type of the `value` prop will be an array of strings.

## Managing Value State

Bits UI offers several approaches to manage and synchronize the component's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { ToggleGroup } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "item-1")}> Press item 1 </button>

<ToggleGroup.Root type="single" bind:value={myValue}>
	<!-- -->
</ToggleGroup.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via clicking on an item)
-   Allows external control (e.g., toggling an item via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { ToggleGroup } from "bits-ui";
	let myValue = $state("");
</script>

<ToggleGroup.Root
	type="single"
	value={myValue}
	onValueChange={(v) => {
		myValue = v;
		// additional logic here.
	}}
>
	<!-- ... -->
</ToggleGroup.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { ToggleGroup } from "bits-ui";
	let myValue = $state("");
</script>

<ToggleGroup.Root type="single" bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</ToggleGroup.Root>
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
