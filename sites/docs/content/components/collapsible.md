---
title: Collapsible
description: Conceals or reveals content sections, enhancing space utilization and organization.
---

<script>
	import { APISection, ComponentPreviewV2, CollapsibleDemo, CollapsibleDemoTransitions, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="collapsible-demo" comp="Collapsible">

{#snippet preview()}
<CollapsibleDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Collapsible component enables you to create expandable and collapsible content sections. It provides an efficient way to manage space and organize information in user interfaces, enabling users to show or hide content as needed.

## Key Features

-   **Accessibility**: ARIA attributes for screen reader compatibility and keyboard navigation.
-   **Transition Support**: CSS variables and data attributes for smooth transitions between states.
-   **Flexible State Management**: Supports controlled and uncontrolled state, take control if needed.
-   **Compound Component Structure**: Provides a set of sub-components that work together to create a fully-featured collapsible.

## Architecture

The Accordion component is composed of a few sub-components, each with a specific role:

-   **Root**: The parent container that manages the state and context for the collapsible functionality.
-   **Trigger**: The interactive element (e.g., button) that toggles the expanded/collapsed state of the content.
-   **Content**: The container for the content that will be shown or hidden based on the collapsible state.

## Structure

Here's an overview of how the Collapsible component is structured in code:

```svelte
<script lang="ts">
	import { Collapsible } from "bits-ui";
</script>

<Collapsible.Root>
	<Collapsible.Trigger />
	<Collapsible.Content />
</Collapsible.Root>
```

## Reusable Components

It's recommended to use the `Collapsible` primitives to create your own custom collapsible component that can be used throughout your application.

```svelte title="MyCollapsible.svelte"
<script lang="ts">
	import { Collapsible, type WithoutChild } from "bits-ui";

	type Props = WithoutChild<Collapsible.RootProps> & {
		buttonText: string;
	};

	let {
		open = $bindable(false),
		ref = $bindable(null),
		buttonText,
		children,
		...restProps
	}: Props = $props();
</script>

<Collapsible.Root bind:open bind:ref {...restProps}>
	<Collapsible.Trigger>{buttonText}</Collapsible.Trigger>
	<Collapsible.Content>
		{@render children?.()}
	</Collapsible.Content>
</Collapsible.Root>
```

You can then use the `MyCollapsible` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyCollapsible from "$lib/components/MyCollapsible.svelte";
</script>

<MyCollapsible buttonText="Open Collapsible">Here is my collapsible content.</MyCollapsible>
```

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Collapsible's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the Collapsible's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Collapsible } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Collapsible</button>

<Collapsible.Root bind:open={isOpen}>
	<!-- ... -->
</Collapsible.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the collapsible closes (e.g., via trigger press)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { Collapsible } from "bits-ui";
	let isOpen = $state(false);
</script>

<Collapsible.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</Collapsible.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Collapsible } from "bits-ui";
	let myOpen = $state(false);
</script>

<Collapsible.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</Collapsible.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Svelte Transitions

The Collapsible component can be enhanced with Svelte's built-in transition effects or other animation libraries.

### Using `forceMount` and `child` Snippets

To apply Svelte transitions to Collapsible components, use the `forceMount` prop in combination with the `child` snippet. This approach gives you full control over the mounting behavior and animation of the `Collapsible.Content`.

```svelte /forceMount/ /transition:fade/ /transition:fly/
<script lang="ts">
	import { Collapsible } from "bits-ui";
	import { fade } from "svelte/transition";
</script>

<Collapsible.Root>
	<Collapsible.Trigger>Open</Collapsible.Trigger>
	<Collapsible.Content forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:fade>
					<!-- ... -->
				</div>
			{/if}
		{/snippet}
	</Collapsible.Content>
</Collapsible.Root>
```

In this example:

-   The `forceMount` prop ensures the content is always in the DOM.
-   The `child` snippet provides access to the open state and component props.
-   Svelte's `#if` block controls when the content is visible.
-   Transition directive (`transition:fade`) apply the animations.

### Best Practices

For cleaner code and better maintainability, consider creating custom reusable components that encapsulate this transition logic.

```svelte title="MyCollapsibleContent.svelte"
<script lang="ts">
	import { Collapsible, type WithoutChildrenOrChild } from "bits-ui";
	import { fade } from "svelte/transition";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		duration = 200,
		children,
		...restProps
	}: WithoutChildrenOrChild<Collapsible.ContentProps> & {
		duration?: number;
		children?: Snippet;
	} = $props();
</script>

<Collapsible.Content forceMount bind:ref {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:fade={{ duration }}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Collapsible.Content>
```

You can then use the `MyCollapsibleContent` component alongside the other `Collapsible` primitives throughout your application:

```svelte
<script lang="ts">
	import { Collapsible } from "bits-ui";
	import { MyCollapsibleContent } from "$lib/components";
</script>

<Collapsible.Root>
	<Collapsible.Trigger>Open</Collapsible.Trigger>
	<MyCollapsibleContent duration={300}>
		<!-- ... -->
	</MyCollapsibleContent>
</Collapsible.Root>
```

<APISection {schemas} />
