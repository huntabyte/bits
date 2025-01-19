---
title: Tabs
description: Organizes content into distinct sections, allowing users to switch between them.
---

<script>
	import { APISection, ComponentPreviewV2, TabsDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="tabs-demo" comp="Tabs">

{#snippet preview()}
<TabsDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Tabs } from "bits-ui";
</script>

<Tabs.Root>
	<Tabs.List>
		<Tabs.Trigger />
	</Tabs.List>
	<Tabs.Content />
</Tabs.Root>
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the component's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Tabs } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "tab-1")}> Activate tab 1 </button>

<Tabs.Root bind:value={myValue}>
	<!-- -->
</Tabs.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via clicking on an tab's trigger)
-   Allows external control (e.g., switching tabs via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Tabs } from "bits-ui";
	let myValue = $state("");
</script>

<Tabs.Root
	value={myValue}
	onValueChange={(v) => {
		myValue = v;
		// additional logic here.
	}}
>
	<!-- ... -->
</Tabs.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Tabs } from "bits-ui";
	let myValue = $state("");
</script>

<Tabs.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Tabs.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Orientation

The `orientation` prop is used to determine the orientation of the `Tabs` component, which influences how keyboard navigation will work.

When the `orientation` is set to `'horizontal'`, the `ArrowLeft` and `ArrowRight` keys will move the focus to the previous and next tab, respectively. When the `orientation` is set to `'vertical'`, the `ArrowUp` and `ArrowDown` keys will move the focus to the previous and next tab, respectively.

```svelte
<Tabs.Root orientation="horizontal">
	<!-- ... -->
</Tabs.Root>

<Tabs.Root orientation="vertical">
	<!-- ... -->
</Tabs.Root>
```

## Activation Mode

By default, the `Tabs` component will automatically activate the tab associated with a trigger when that trigger is focused. This behavior can be disabled by setting the `activationMode` prop to `'manual'`.

When set to `'manual'`, the user will need to activate the tab by pressing the trigger.

```svelte /activationMode="manual"/
<Tabs.Root activationMode="manual">
	<!-- ... -->
</Tabs.Root>
```

<APISection {schemas} />
