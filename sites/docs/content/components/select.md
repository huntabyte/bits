---
title: Select
description: Enables users to choose from a list of options presented in a dropdown.
---

<script>
	import { APISection, ComponentPreviewV2, SelectDemo, SelectDemoCustomAnchor, SelectDemoMultiple, SelectDemoTransition, Callout } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="select-demo" comp="Select">

{#snippet preview()}
<SelectDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Select component provides users with a selectable list of options. It's designed to offer an enhanced selection experience with features like typeahead search, keyboard navigation, and customizable grouping. This component is particularly useful for scenarios where users need to choose from a predefined set of options, offering more functionality than a standard select element.

## Key Features

-   **Typeahead Search**: Users can quickly find options by typing
-   **Keyboard Navigation**: Full support for keyboard interactions, allowing users to navigate through options using arrow keys, enter to select, and more.
-   **Grouped Options**: Ability to organize options into logical groups, enhancing readability and organization of large option sets.
-   **Scroll Management**: Includes scroll up/down buttons for easy navigation in long lists.
-   **Accessibility**: Built-in ARIA attributes and keyboard support ensure compatibility with screen readers and adherence to accessibility standards.
-   **Portal Support**: Option to render the select content in a portal, preventing layout issues in complex UI structures.

## Architecture

The Select component is composed of several sub-components, each with a specific role:

-   **Root**: The main container component that manages the state and context for the combobox.
-   **Trigger**: The button or element that opens the dropdown list.
-   **Portal**: Responsible for portalling the dropdown content to the body or a custom target.
-   **Group**: A container for grouped items, used to group related items.
-   **GroupHeading**: A heading for a group of items, providing a descriptive label for the group.
-   **Item**: An individual item within the list.
-   **Separator**: A visual separator between items.
-   **Content**: The dropdown container that displays the items. It uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger.
-   **ContentStatic** (Optional): An alternative to the Content component, that enables you to opt-out of Floating UI and position the content yourself.
-   **Arrow**: An arrow element that points to the trigger when using the `Combobox.Content` component.

## Structure

Here's an overview of how the Select component is structured in code:

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
</script>

<Select.Root>
	<Select.Trigger />
	<Select.Portal>
		<Select.Content>
			<Select.ScrollUpButton />
			<Select.Viewport>
				<Select.Item />
				<Select.Group>
					<Select.GroupHeading />
					<Select.Item />
				</Select.Group>
				<Select.ScrollDownButton />
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
```

## Reusable Components

As you can see from the structure above, there are a number of pieces that make up the `Select` component. These pieces are provided to give you maximum flexibility and customization options, but can be a burden to write out everywhere you need to use a select in your application.

To ease this burden, it's recommended to create your own reusable select component that wraps the primitives and provides a more convenient API for your use cases.

Here's an example of how you might create a reusable `MySelect` component that receives a list of options and renders each of them as an item.

```svelte title="MySelect.svelte"
<script lang="ts">
	import { Select, type WithoutChildren } from "bits-ui";

	type Props = WithoutChildren<Select.RootProps> & {
		placeholder?: string;
		items: { value: string; label: string; disabled?: boolean }[];
		contentProps?: WithoutChildren<Select.ContentProps>;
		// any other specific component props if needed
	};

	let { value = $bindable(""), items, contentProps, placeholder, ...restProps }: Props = $props();

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);
</script>

<Select.Root bind:value {...restProps}>
	<Select.Trigger>
		{selectedLabel ? selectedLabel : placeholder}
	</Select.Trigger>
	<Select.Portal>
		<Select.Content {...contentProps}>
			<Select.ScrollUpButton>up</Select.ScrollUpButton>
			<Select.Viewport>
				{#each items as { value, label, disabled } (value)}
					<Select.Item {value} textValue={label} {disabled}>
						{#snippet children({ selected })}
							{selected ? "✅" : ""}
							<Select.ItemText>
								{item.label}
							</Select.ItemText>
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton>down</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
```

You can then use the `MySelect` component throughout your application like so:

```svelte
<script lang="ts">
	import MySelect from "$lib/components/MySelect.svelte";

	const items = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "cherry", label: "Cherry" },
	];

	let fruit = $state("apple");
</script>

<MySelect {items} bind:value={fruit} />
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Select's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<Select.Root bind:value={myValue}>
	<!-- ... -->
</Select.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via clicking on an item)
-   Allows external control (e.g., selecting an item via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
	let myValue = $state("");
</script>

<Select.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</Select.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
	let myValue = $state("");
</script>

<Select.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Select.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Select's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
	let myOpen = $state(false);
</script>

<button onclick={() => (myOpen = true)}> Open </button>

<Select.Root bind:open={myOpen}>
	<!-- ... -->
</Select.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myOpen` when the internal state changes (e.g., via clicking on the trigger/input)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
	let myOpen = $state(false);
</script>

<Select.Root
	open={myOpen}
	onOpenChange={(o) => {
		myOpen = o;
		// additional logic here.
	}}
>
	<!-- ... -->
</Select.Root>
```

#### Use Cases

-   Implementing custom behaviors on open change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
	let myOpen = $state(false);
</script>

<Select.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</Select.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Multiple Selection

The `type` prop can be set to `'multiple'` to allow multiple items to be selected at a time.

```svelte
<script lang="ts">
	import { Select } from "bits-ui";

	let value = $state<string[]>([]);
</script>

<Select.Root type="multiple" bind:value>
	<!-- ... -->
</Select.Root>
```

<ComponentPreviewV2 name="select-demo-multiple" comp="Select">

{#snippet preview()}
<SelectDemoMultiple />
{/snippet}

</ComponentPreviewV2>

## Opt-out of Floating UI

When you use the `Select.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `Select.ContentStatic` component.

```svelte {4,14}
<Select.Root>
	<Select.Trigger />
	<Select.Portal>
		<Select.ContentStatic>
			<Select.ScrollUpButton />
			<Select.Viewport>
				<Select.Item />
				<Select.Group>
					<Select.GroupHeading />
					<Select.Item />
				</Select.Group>
				<Select.ScrollDownButton />
			</Select.Viewport>
		</Select.ContentStatic>
	</Select.Portal>
</Select.Root>
```

When using this component, you'll need to handle the positioning of the content yourself. Keep in mind that using `Select.Portal` alongside `Select.ContentStatic` may result in some unexpected positioning behavior, feel free to not use the portal or work around it.

## Custom Anchor

By default, the `Select.Content` is anchored to the `Select.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector string or an `HTMLElement` to the `customAnchor` prop of the `Select.Content` component.

```svelte
<script lang="ts">
	import { Select } from "bits-ui";

	let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Select.Root>
	<Select.Trigger />
	<Select.Content {customAnchor}>
		<!-- ... -->
	</Select.Content>
</Select.Root>
```

<SelectDemoCustomAnchor />

## What is the Viewport?

The `Select.Viewport` component is used to determine the size of the content in order to determine whether or not the scroll up and down buttons should be rendered.

If you wish to set a minimum/maximum height for the select content, you should apply it to the `Select.Viewport` component.

## Scroll Up/Down Buttons

The `Select.ScrollUpButton` and `Select.ScrollDownButton` components are used to render the scroll up and down buttons when the select content is larger than the viewport.

You must use the `Select.Viewport` component when using the scroll buttons.

## Native Scrolling/Overflow

If you don't want to use the scroll buttons and prefer to use the standard scrollbar/overflow behavior, you can omit the `Select.Scroll[Up|Down]Button` components and the `Select.Viewport` component.

You'll need to set a height on the `Select.Content` component and appropriate `overflow` styles to enable scrolling.

## Scroll Lock

By default, when a user opens the select, scrolling outside the content will not be disabled. You can override this behavior by setting the `preventScroll` prop to `true`.

```svelte /preventScroll={false}/
<Select.Content preventScroll={true}>
	<!-- ... -->
</Select.Content>
```

## Highlighted Items

The Select component follows the [WAI-ARIA descendant pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) for highlighting items. This means that the `Select.Trigger` retains focus the entire time, even when navigating with the keyboard, and items are highlighted as the user navigates them.

### Styling Highlighted Items

You can use the `data-highlighted` attribute on the `Select.Item` component to style the item differently when it is highlighted.

### onHighlight / onUnhighlight

To trigger side effects when an item is highlighted or unhighlighted, you can use the `onHighlight` and `onUnhighlight` props.

```svelte
<Select.Item onHighlight={() => console.log('I am highlighted!')} onUnhighlight={() => console.log('I am unhighlighted!')} />
<!-- ... -->
</Select.Item>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Select.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { Select } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<Select.Content forceMount>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:fly>
					<!-- ... -->
				</div>
			</div>
		{/if}
	{/snippet}
</Select.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="select-demo-transition" comp="Select" containerClass="mt-4">

{#snippet preview()}
<SelectDemoTransition />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
