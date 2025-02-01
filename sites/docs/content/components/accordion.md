---
title: Accordion
description: Organizes content into collapsible sections, allowing users to focus on one or more sections at a time.
---

<script>
	import { APISection, ComponentPreviewV2, AccordionDemo, AccordionDemoTransitions, AccordionDemoCustom, Callout } from '$lib/components/index.js'
	export let schemas
</script>

<ComponentPreviewV2 name="accordion-demo" comp="Accordion">

{#snippet preview()}
<AccordionDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Accordion component is a versatile UI element that organizes content into collapsible sections, enabling users to focus on specific information while reducing visual clutter. It's particularly useful for presenting large amounts of related content in a compact, navigable format.

## Key Features

-   **Customizable Behavior**: Can be configured for single or multiple open sections.
-   **Accessibility**: ARIA attributes for screen reader compatibility and keyboard navigation.
-   **Transition Support**: CSS variables and data attributes for smooth transitions between states.
-   **Flexible State Management**: Supports controlled and uncontrolled state, take control if needed.
-   **Compound Component Structure**: Provides a set of sub-components that work together to create a fully-featured accordion.

## Architecture

The Accordion component is composed of several sub-components, each with a specific role:

-   **Root**: The root element that wraps all accordion items and manages the overall state.
-   **Item**: Individual sections within the accordion.
-   **Trigger**: The button that toggles the visibility of the content.
-   **Header**: The title or heading of each item.
-   **Content**: The expandable/collapsible body of each item.

## Structure

Here's an overview of how the Accordion component is structured in code:

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

## Reusable Components

If you're planning to use the `Accordion` component throughout your application, it's recommended to create reusable wrapper components to reduce the amount of code you need to write each time.

For each individual item, you need an `Accordion.Item`, `Accordion.Header`, `Accordion.Trigger` and `Accordion.Content` component. We can combine these into a single `MyAccordionItem` component that makes it easier to reuse.

```svelte title="MyAccordionItem.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";

	type Props = WithoutChildrenOrChild<Accordion.ItemProps> & {
		title: string;
		content: string;
	};

	let { title, content, ...restProps }: Props = $props();
</script>

<Accordion.Item {...restProps}>
	<Accordion.Header>
		<Accordion.Trigger>{item.title}</Accordion.Trigger>
	</Accordion.Header>
	<Accordion.Content>
		{content}
	</Accordion.Content>
</Accordion.Item>
```

We used the [`WithoutChildrenOrChild`](/docs/type-helpers/without-children-or-child) type helper to omit the `child` and `children` snippet props from `Accordion.ItemProps`, since we are opting out of using [delegation](/docs/child-snippet) and are already taking care of rendering the children as text via the `content` prop.

For our `MyAccordion` component, we'll accept all the props that `Accordion.Root` accepts, as well as an additional `items` prop that will be used to render the `MyAccordionItem` components.

```svelte title="MyAccordion.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
	import MyAccordionItem from "$lib/components/MyAccordionItem.svelte";

	type Item = {
		value?: string;
		title: string;
		content: string;
		disabled?: boolean;
	};

	let {
		value = $bindable(),
		ref = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Accordion.RootProps> & {
		items: Item[];
	} = $props();
</script>

<!--
 Since we have to destructure the `value` to make it `$bindable`, we need to use `as any` here to avoid
 type errors from the discriminated union of `"single" | "multiple"`.
 (an unfortunate consequence of having to destructure bindable values)
  -->
<Accordion.Root bind:value bind:ref {...restProps as any}>
	{#each items as item, i (item.title + i)}
		<MyAccordionItem {...item} />
	{/each}
</Accordion.Root>
```

```svelte title="+page.svelte"
<script lang="ts">
	import { MyAccordion, MyAccordionItem } from "$lib/components";
</script>

<MyAccordion type="single">
	<MyAccordionItem title="Item 1">Content 1</MyAccordionItem>
	<MyAccordionItem title="Item 2">Content 2</MyAccordionItem>
	<MyAccordionItem title="Item 3">Content 3</MyAccordionItem>
</MyAccordion>
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Accordion's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the accordion's internal state.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
	let myValue = $state<string[]>([]);
</script>

<button
	onclick={() => {
		myValue = ["item-1", "item-2"];
	}}
>
	Open Items 1 and 2
</button>

<Accordion.Root type="multiple" bind:value={myValue}>
	<Accordion.Item value="item-1">
		<!-- ... -->
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<!-- ... -->
	</Accordion.Item>
	<Accordion.Item value="item-3">
		<!-- ... -->
	</Accordion.Item>
</Accordion.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the accordion changes (e.g., via clicking on an item's trigger)
-   Allows external control (e.g., opening an item via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
	let myValue = $state<string[]>([]);
</script>

<Accordion.Root
	type="multiple"
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<Accordion.Item value="item-1">
		<!-- ... -->
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<!-- ... -->
	</Accordion.Item>
	<Accordion.Item value="item-3">
		<!-- ... -->
	</Accordion.Item>
</Accordion.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
	let myValue = $state("");
</script>

<Accordion.Root type="single" bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Accordion.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Single Type

Set the `type` prop to `"single"` to allow only one accordion item to be open at a time.

```svelte /type="single"/
<CustomAccordion type="single" />
```

<AccordionDemoCustom type="single" />

## Multiple Type

Set the `type` prop to `"multiple"` to allow multiple accordion items to be open at the same time.

```svelte /type="multiple"/
<CustomAccordion type="multiple" />
```

<AccordionDemoCustom type="multiple" />

## Default Open Items

To set default open items, pass them as the `value` prop, which will be an array if the `type` is `"multiple"`, or a string if the `type` is `"single"`.

```svelte /value={["A", "C"]}/
<CustomAccordion value={["A", "C"]} type="multiple" />
```

<AccordionDemoCustom value={["A", "C"]} type="multiple" />

## Disable Items

To disable an individual accordion item, set the `disabled` prop to `true`. This will prevent users from interacting with the item.

```svelte {2}
<Accordion.Root type="single">
	<Accordion.Item value="item-1" disabled>
		<!-- ... -->
	</Accordion.Item>
</Accordion.Root>
```

## Svelte Transitions

The Accordion component can be enhanced with Svelte's built-in transition effects or other animation libraries.

### Using `forceMount` and `child` Snippets

To apply Svelte transitions to Accordion components, use the `forceMount` prop in combination with the `child` snippet. This approach gives you full control over the mounting behavior and animation of the `Accordion.Content`.

```svelte
<Accordion.Content forceMount={true}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:slide={{ duration: 1000 }}>
				This is the accordion content that will transition in and out.
			</div>
		{/if}
	{/snippet}
</Accordion.Content>
```

In this example:

-   The `forceMount` prop ensures the components are always in the DOM.
-   The `child` snippet provides access to the open state and component props.
-   Svelte's `#if` block controls when the content is visible.
-   Transition directives (`transition:fade` and `transition:fly`) apply the animations.

<ComponentPreviewV2 name="accordion-demo-transitions" comp="Accordion">

{#snippet preview()}
<AccordionDemoTransitions />
{/snippet}

</ComponentPreviewV2>

### Best Practices

For cleaner code and better maintainability, consider creating custom reusable components that encapsulate this transition logic.

```svelte title="MyAccordionContent.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
	import type { Snippet } from "svelte";
	import { fade } from "svelte/transition";

	let {
		ref = $bindable(null),
		duration = 200,
		children,
		...restProps
	}: WithoutChildrenOrChild<Accordion.ContentProps> & {
		duration?: number;
		children: Snippet;
	} = $props();
</script>

<Accordion.Content forceMount bind:ref {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:fade={{ duration }}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Accordion.Content>
```

You can then use the `MyAccordionContent` component alongside the other `Accordion` primitives throughout your application:

```svelte
<Accordion.Root>
	<Accordion.Item value="A">
		<Accordion.Header>
			<Accordion.Trigger>A</Accordion.Trigger>
		</Accordion.Header>
		<MyAccordionContent duration={300}>
			<!-- ... -->
		</MyAccordionContent>
	</Accordion.Item>
</Accordion.Root>
```

<APISection {schemas} />
