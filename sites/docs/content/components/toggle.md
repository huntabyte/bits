---
title: Toggle
description: A control element that switches between two states, providing a binary choice.
---

<script>
	import { APISection, ComponentPreviewV2, ToggleDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="toggle-demo" comp="Toggle">

{#snippet preview()}
<ToggleDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Toggle } from "bits-ui";
</script>

<Toggle.Root />
```

## Managing Pressed State

Bits UI offers several approaches to manage and synchronize the Toggle's pressed state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:pressed` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Toggle } from "bits-ui";
	let myPressed = $state(true);
</script>

<button onclick={() => (myPressed = false)}> un-press </button>

<Toggle.Root bind:pressed={myPressed} />
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myPressed` when the switch changes (e.g., via clicking on the toggle)
-   Allows external control (e.g., pressing/toggling via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onPressedChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Toggle } from "bits-ui";
	let myPressed = $state(false);
</script>

<Toggle.Root
	checked={myPressed}
	onPressedChange={(p) => {
		myPressed = p;
		// additional logic here.
	}}
/>
```

#### Use Cases

-   Implementing custom behaviors on pressed/unpressed
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Toggle } from "bits-ui";
	let myPressed = $state(false);
</script>

<Toggle.Root bind:pressed={() => myPressed, (newPressed) => (myPressed = newPressed)}>
	<!-- ... -->
</Toggle.Root>
```

#### When to Use

-   Implementing complex checked/unchecked logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

<APISection {schemas} />
