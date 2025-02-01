---
title: Combobox
description: Enables users to pick from a list of options displayed in a dropdown.
---

<script>
	import { APISection, ComponentPreviewV2, ComboboxDemo, ComboboxDemoTransition, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="combobox-demo" comp="Combobox">

{#snippet preview()}
<ComboboxDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Combobox component combines the functionality of an input field with a dropdown list of selectable options. It provides users with the ability to search, filter, and select from a predefined set of choices.

## Key Features

-   **Keyboard Navigation**: Full support for keyboard interactions, allowing users to navigate and select options without using a mouse.
-   **Customizable Rendering**: Flexible architecture for rendering options, including support for grouped items.
-   **Accessibility**: Built with ARIA attributes and keyboard interactions to ensure screen reader compatibility and accessibility standards.
-   **Portal Support**: Ability to render the dropdown content in a portal, preventing layout issues in complex UI structures.

## Architecture

The Combobox component is composed of several sub-components, each with a specific role:

-   **Root**: The main container component that manages the state and context for the combobox.
-   **Input**: The input field that allows users to enter search queries.
-   **Trigger**: The button or element that opens the dropdown list.
-   **Portal**: Responsible for portalling the dropdown content to the body or a custom target.
-   **Group**: A container for grouped items, used to group related items.
-   **GroupHeading**: A heading for a group of items, providing a descriptive label for the group.
-   **Item**: An individual item within the list.
-   **Separator**: A visual separator between items.
-   **Content**: The dropdown container that displays the items. It uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger.
-   **ContentStatic**: An alternative to the Content component, that enables you to opt-out of Floating UI and position the content yourself.
-   **Arrow**: An arrow element that points to the trigger when using the `Combobox.Content` component.

## Structure

Here's an overview of how the Combobox component is structured in code:

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
</script>

<Combobox.Root>
	<Combobox.Input />
	<Combobox.Trigger />
	<Combobox.Portal>
		<Combobox.Content>
			<Combobox.Group>
				<Combobox.GroupHeading />
				<Combobox.Item />
			</Combobox.Group>
			<Combobox.Item />
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
```

## Reusable Components

It's recommended to use the `Combobox` primitives to build your own custom combobox component that can be reused throughout your application.

```svelte title="CustomCombobox.svelte"
<script lang="ts">
	import { Combobox, type WithoutChildrenOrChild, mergeProps } from "bits-ui";

	type Item = { value: string; label: string };

	type Props = Combobox.RootProps & {
		items: Item[];
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
	};

	let {
		items,
		value = $bindable(),
		open = $bindable(false),
		inputProps,
		contentProps,
		...restProps
	}: Props = $props();

	let searchValue = $state("");

	const filteredItems = $derived.by(() => {
		if (searchValue === "") return items;
		return items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
	});

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		searchValue = e.currentTarget.value;
	}

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) searchValue = "";
	}

	const mergedRootProps = $derived(mergeProps(restProps, { onOpenChange: handleOpenChange }));
	const mergedInputProps = $derived(mergeProps(inputProps, { oninput: handleInput }));
</script>

<Combobox.Root bind:value bind:open {...mergedRootProps}>
	<Combobox.Input {...mergedInputProps} />
	<Combobox.Trigger>Open</Combobox.Trigger>
	<Combobox.Portal>
		<Combobox.Content {...contentProps}>
			{#each filteredItems as item, i (i + item.value)}
				<Combobox.Item value={item.value} label={item.label}>
					{#snippet children({ selected })}
						{item.label}
						{selected ? "✅" : ""}
					{/snippet}
				</Combobox.Item>
			{:else}
				<span> No results found </span>
			{/each}
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
```

```svelte title="+page.svelte"
<script lang="ts">
	import { CustomCombobox } from "$lib/components";

	const items = [
		{ value: "mango", label: "Mango" },
		{ value: "watermelon", label: "Watermelon" },
		{ value: "apple", label: "Apple" },
		// ...
	];
</script>

<CustomCombobox {items} />
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Combobox's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<Combobox.Root bind:value={myValue}>
	<!-- ... -->
</Combobox.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via clicking on an item)
-   Allows external control (e.g., selecting an item via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
	let myValue = $state("");
</script>

<Combobox.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</Combobox.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
	let myValue = $state("");
</script>

<Combobox.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Combobox.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Combobox's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
	let myOpen = $state(false);
</script>

<button onclick={() => (myOpen = true)}> Open </button>

<Combobox.Root bind:open={myOpen}>
	<!-- ... -->
</Combobox.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myOpen` when the internal state changes (e.g., via clicking on the trigger/input)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
	let myOpen = $state(false);
</script>

<Combobox.Root
	open={myOpen}
	onOpenChange={(o) => {
		myOpen = o;
		// additional logic here.
	}}
>
	<!-- ... -->
</Combobox.Root>
```

#### Use Cases

-   Implementing custom behaviors on open change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
	let myOpen = $state(false);
</script>

<Combobox.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</Combobox.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Opt-out of Floating UI

When you use the `Combobox.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `Combobox.ContentStatic` component.

```svelte {4,14}
<Combobox.Root>
	<Combobox.Trigger />
	<Combobox.Input />
	<Combobox.Portal>
		<Combobox.ContentStatic>
			<Combobox.ScrollUpButton />
			<Combobox.Viewport>
				<Combobox.Item />
				<Combobox.Group>
					<Combobox.GroupHeading />
					<Combobox.Item />
				</Combobox.Group>
				<Combobox.ScrollDownButton />
			</Combobox.Viewport>
		</Combobox.ContentStatic>
	</Combobox.Portal>
</Combobox.Root>
```

When using this component, you'll need to handle the positioning of the content yourself. Keep in mind that using `Combobox.Portal` alongside `Combobox.ContentStatic` may result in some unexpected positioning behavior, feel free to not use the portal or work around it.

## Custom Anchor

By default, the `Combobox.Content` is anchored to the `Combobox.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector string or an `HTMLElement` to the `customAnchor` prop of the `Combobox.Content` component.

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";

	let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Combobox.Root>
	<Combobox.Trigger />
	<Combobox.Input />
	<Combobox.Content {customAnchor}>
		<!-- ... -->
	</Combobox.Content>
</Combobox.Root>
```

## What is the Viewport?

The `Combobox.Viewport` component is used to determine the size of the content in order to determine whether or not the scroll up and down buttons should be rendered.

If you wish to set a minimum/maximum height for the select content, you should apply it to the `Combobox.Viewport` component.

## Scroll Up/Down Buttons

The `Combobox.ScrollUpButton` and `Combobox.ScrollDownButton` components are used to render the scroll up and down buttons when the select content is larger than the viewport.

You must use the `Combobox.Viewport` component when using the scroll buttons.

## Native Scrolling/Overflow

If you don't want to use the scroll buttons and prefer to use the standard scrollbar/overflow behavior, you can omit the `Combobox.Scroll[Up|Down]Button` components and the `Combobox.Viewport` component.

You'll need to set a height on the `Combobox.Content` component and appropriate `overflow` styles to enable scrolling.

## Scroll Lock

By default, when a user opens the Combobox, scrolling outside the content will be disabled. You can override this behavior by setting the `preventScroll` prop to `false`.

```svelte /preventScroll={false}/
<Combobox.Content preventScroll={false}>
	<!-- ... -->
</Combobox.Content>
```

## Highlighted Items

The Combobox component follows the [WAI-ARIA descendant pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) for highlighting items. This means that the `Combobox.Input` retains focus the entire time, even when navigating with the keyboard, and items are highlighted as the user navigates them.

### Styling Highlighted Items

You can use the `data-highlighted` attribute on the `Combobox.Item` component to style the item differently when it is highlighted.

### onHighlight / onUnhighlight

To trigger side effects when an item is highlighted or unhighlighted, you can use the `onHighlight` and `onUnhighlight` props.

```svelte
<Combobox.Item onHighlight={() => console.log('I am highlighted!')} onUnhighlight={() => console.log('I am unhighlighted!')} />
<!-- ... -->
</Combobox.Item>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Combobox.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { Combobox } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<Combobox.Content forceMount>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:fly>
					<!-- ... -->
				</div>
			</div>
		{/if}
	{/snippet}
</Combobox.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="combobox-demo-transition" comp="Select" containerClass="mt-4">

{#snippet preview()}
<ComboboxDemoTransition />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
