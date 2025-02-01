---
title: Dropdown Menu
description: Displays a menu of items that users can select from when triggered.
---

<script>
	import { APISection, ComponentPreviewV2, DropdownMenuDemo, DropdownMenuDemoTransition, Callout } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="dropdown-menu-demo" comp="DropdownMenu">

{#snippet preview()}
<DropdownMenuDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger />

	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading />
			<DropdownMenu.Item />
		</DropdownMenu.Group>

		<DropdownMenu.Group>
			<DropdownMenu.Item />
		</DropdownMenu.Group>

		<DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxIndicator />
		</DropdownMenu.CheckboxItem>

		<DropdownMenu.RadioGroup>
			<DropdownMenu.RadioItem>
				<DropdownMenu.RadioIndicator />
			</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>

		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger />
			<DropdownMenu.SubContent />
		</DropdownMenu.Sub>

		<DropdownMenu.Separator />
		<DropdownMenu.Arrow />
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

## Reusable Components

If you're planning to use Dropdown Menu in multiple places, you can create a reusable component that wraps the Dropdown Menu component.

This example shows you how to create a Dropdown Menu component that accepts a few custom props that make it more capable.

```svelte title="MyDropdownMenu.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { DropdownMenu, type WithoutChild } from "bits-ui";

	type Props = DropdownMenu.Props & {
		buttonText: string;
		items: string[];
		contentProps?: WithoutChild<DropdownMenu.Content.Props>;
		// other component props if needed
	};

	let {
		open = $bindable(false),
		children,
		buttonText,
		items,
		contentProps,
		...restProps
	}: Props = $props();
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger>
		{buttonText}
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content {...contentProps}>
			<DropdownMenu.Group aria-label={buttonText}>
				{#each items as item}
					<DropdownMenu.Item textValue={item}>
						{item}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
```

You can then use the `MyDropdownMenu` component like this:

```svelte
<script lang="ts">
	import MyDropdownMenu from "./MyDropdownMenu.svelte";
</script>

<MyDropdownMenu
	buttonText="Select a manager"
	items={["Michael Scott", "Dwight Schrute", "Jim Halpert"]}
/>
```

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Dropdown Menu's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Context Menu</button>

<DropdownMenu.Root bind:open={isOpen}>
	<!-- ... -->
</DropdownMenu.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the menu closes/opens (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let isOpen = $state(false);
</script>

<DropdownMenu.Root
	open={isOpen}
	onOpenChange={(o) => {
		isOpen = o;
		// additional logic here.
	}}
>
	<!-- ... -->
</DropdownMenu.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let myOpen = $state(false);
</script>

<DropdownMenu.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</DropdownMenu.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Groups

To group related menu items, you can use the `DropdownMenu.Group` component along with either a `DropdownMenu.GroupHeading` or an `aria-label` attribute on the `DropdownMenu.Group` component.

```svelte
<DropdownMenu.Group>
	<DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
	<DropdownMenu.Item>New</DropdownMenu.Item>
	<DropdownMenu.Item>Open</DropdownMenu.Item>
	<DropdownMenu.Item>Save</DropdownMenu.Item>
	<DropdownMenu.Item>Save As</DropdownMenu.Item>
</DropdownMenu.Group>
<!-- or -->
<DropdownMenu.Group aria-label="file">
	<DropdownMenu.Item>New</DropdownMenu.Item>
	<DropdownMenu.Item>Open</DropdownMenu.Item>
	<DropdownMenu.Item>Save</DropdownMenu.Item>
	<DropdownMenu.Item>Save As</DropdownMenu.Item>
</DropdownMenu.Group>
```

### Group Heading

The `DropdownMenu.GroupHeading` component must be a child of either a `DropdownMenu.Group` or `DropdownMenu.RadioGroup` component. If used on its own, an error will be thrown during development.

```svelte
<DropdownMenu.Group>
	<DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
	<!-- ... items here -->
</DropdownMenu.Group>

<!-- or -->

<DropdownMenu.RadioGroup>
	<DropdownMenu.GroupHeading>Favorite color</DropdownMenu.GroupHeading>
	<!-- ... radio items here -->
</DropdownMenu.RadioGroup>
```

## Checkbox Items

You can use the `DropdownMenu.CheckboxItem` component to create a `menuitemcheckbox` element to add checkbox functionality to menu items.

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let notifications = $state(true);
</script>

<DropdownMenu.CheckboxItem bind:checked={notifications}>
	{#snippet children({ checked, indeterminate })}
		{#if indeterminate}
			-
		{:else if checked}
			✅
		{/if}
		Notifications
	{/snippet}
</DropdownMenu.CheckboxItem>
```

The `checked` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `checked` prop.

## Radio Groups

You can combine the `DropdownMenu.RadioGroup` and `DropdownMenu.RadioItem` components to create a radio group within a menu.

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	const values = ["one", "two", "three"];
	let value = $state("one");
</script>

<DropdownMenu.RadioGroup bind:value>
	<DropdownMenu.GroupHeading>Favorite number</DropdownMenu.GroupHeading>
	{#each values as value}
		<DropdownMenu.RadioItem {value}>
			{#snippet children({ checked })}
				{#if checked}
					✅
				{/if}
				{value}
			{/snippet}
		</DropdownMenu.RadioItem>
	{/each}
</DropdownMenu.RadioGroup>
```

The `value` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `value` prop.

## Nested Menus

You can create nested menus using the `DropdownMenu.Sub` component to create complex menu structures.

```svelte /DropdownMenu.Sub/
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
</script>

<DropdownMenu.Content>
	<DropdownMenu.Item>Item 1</DropdownMenu.Item>
	<DropdownMenu.Item>Item 2</DropdownMenu.Item>
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>Open Sub Menu</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent>
			<DropdownMenu.Item>Sub Item 1</DropdownMenu.Item>
			<DropdownMenu.Item>Sub Item 2</DropdownMenu.Item>
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
</DropdownMenu.Content>
```

<!-- <DropdownMenuDemoNested /> -->

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `DropdownMenu.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<DropdownMenu.Content forceMount>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:fly>
					<DropdownMenu.Item>Item 1</DropdownMenu.Item>
					<DropdownMenu.Item>Item 2</DropdownMenu.Item>
				</div>
			</div>
		{/if}
	{/snippet}
</DropdownMenu.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="dropdown-menu-demo-transition" comp="DropdownMenu" containerClass="mt-4">

{#snippet preview()}
<DropdownMenuDemoTransition />
{/snippet}

</ComponentPreviewV2>

## Custom Anchor

By default, the `DropdownMenu.Content` is anchored to the `DropdownMenu.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector `string` or an `HTMLElement` to the `customAnchor` prop of the `DropdownMenu.Content` component.

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<DropdownMenu.Root>
	<DropdownMenu.Trigger />
	<DropdownMenu.Content {customAnchor}>
		<!-- ... -->
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

<APISection {schemas} />
