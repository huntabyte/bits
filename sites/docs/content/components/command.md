---
title: Command
description: A command menu component that can be used to search, filter, and select items.
navLabel: New
---

<script>
	import { APISection, ComponentPreviewV2, CommandDemo, CommandDemoDialog, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="command-demo" comp="Command">

{#snippet preview()}
<CommandDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Command component, also known as a command menu, is designed to provide users with a quick and efficient way to search, filter, and select items within an application. It combines the functionality of a search input with a dynamic, filterable list of commands or options, making it ideal for applications that require fast navigation or action execution.

## Key Features

-   **Dynamic Filtering**: As users type in the input field, the list of commands or items is instantly filtered and sorted based on an (overridable) scoring algorithm.
-   **Keyboard Navigation**: Full support for keyboard interactions, allowing users to quickly navigate and select items without using a mouse.
-   **Grouped Commands**: Ability to organize commands into logical groups, enhancing readability and organization.
-   **Empty and Loading States**: Built-in components to handle scenarios where no results are found or when results are being loaded.
-   **Accessibility**: Designed with ARIA attributes and keyboard interactions to ensure screen reader compatibility and accessibility standards.

## Architecture

The Command component is composed of several sub-components, each with a specific role:

-   **Root**: The main container that manages the overall state and context of the command menu.
-   **Input**: The text input field where users can type to search or filter commands.
-   **List**: The container for the list of commands or items.
-   **Viewport**: The visible area of the command list, which applies CSS variables to handle dynamic resizing/animations based on the height of the list.
-   **Empty**: A component to display when no results are found.
-   **Loading**: A component to display while results are being fetched or processed.
-   **Group**: A container for a group of items within the command menu.
-   **GroupHeading**: A header element to provide an accessible label for a group of items.
-   **GroupItems**: A container for the items within a group.
-   **Item**: Individual selectable command or item.
-   **LinkItem**: A variant of `Command.Item` specifically for link-based actions.
-   **Separator**: A visual separator to divide different sections of the command list.

## Structure

Here's an overview of how the Command component is structured in code:

```svelte
<script lang="ts">
	import { Command } from "bits-ui";
</script>

<Command.Root>
	<Combobox.Input />
	<Command.List>
		<Command.Viewport>
			<Command.Empty />
			<Command.Loading />
			<Command.Group>
				<Command.GroupHeading />
				<Command.GroupItems>
					<Command.Item />
					<Command.LinkItem />
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator />
			<Command.Item />
			<Command.LinkItem />
		</Command.Viewport>
	</Command.List>
</Command.Root>
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Command's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Command } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<Command.Root bind:value={myValue}>
	<!-- ... -->
</Command.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via clicking on an item)
-   Allows external control (e.g., selecting an item via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Command } from "bits-ui";
	let myValue = $state("");
</script>

<Command.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</Command.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Command } from "bits-ui";
	let myValue = $state("");
</script>

<Command.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Command.Root>
```

#### When to Use

-   Implementing complex value change logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## In a Modal

You can combine the `Command` component with the `Dialog` component to display the command menu within a modal.

<br>

<ComponentPreviewV2 name="command-demo-dialog" comp="Command" size="xs">

{#snippet preview()}
<CommandDemoDialog />
{/snippet}

</ComponentPreviewV2>

## Filtering

### Custom Filter

By default, the `Command` component uses a scoring algorithm to determine how the items should be sorted/filtered. You can provide a custom filter function to override this behavior.

The function should return a number between `0` and `1`, with `1` being a perfect match, and `0` being no match, resulting in the item being hidden entirely.

The following example shows how you might implement a strict substring match filter:

```svelte
<script lang="ts">
	import { Command } from "bits-ui";

	function customFilter(value: string, search: string, keywords?: string[]): number {
		return value.includes(search) ? 1 : 0;
	}
</script>

<Command.Root filter={customFilter}>
	<!-- ... -->
</Command.Root>
```

### Disable Filtering

You can disable filtering by setting the `shouldFilter` prop to `false`.

```svelte
<Command.Root shouldFilter={false}>
	<!-- ... -->
</Command.Root>
```

This is useful when you have a lot of custom logic, need to fetch items asynchronously, or just want to handle filtering yourself. You'll be responsible for iterating over the items and determining which ones should be shown.

## Item Selection

You can use the `onSelect` prop to handle the selection of items.

```svelte
<Command.Item onSelect={() => console.log("selected something!")} />
```

## Links

If you want one of the items to get all the benefits of a link (prefetching, etc.), you should use the `Command.LinkItem` component instead of the `Command.Item` component. The only difference is that the `Command.LinkItem` component will render an `a` element instead of a `div` element.

```svelte
<Command.LinkItem href="/some/path">
	<!-- ... -->
</Command.LinkItem>
```

<APISection {schemas} />
