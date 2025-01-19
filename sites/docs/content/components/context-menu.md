---
title: Context Menu
description: Displays options or actions relevant to a specific context or selected item, triggered by a right-click.
---

<script>
	import { APISection, ComponentPreviewV2, ContextMenuDemo, ContextMenuDemoTransition, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="context-menu-demo" comp="ContextMenu">

{#snippet preview()}
<ContextMenuDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger />
	<ContextMenu.Portal>
		<ContextMenu.Content>
			<ContextMenu.Group>
				<ContextMenu.GroupHeading />
				<ContextMenu.Item />
			</ContextMenu.Group>

			<ContextMenu.Item />

			<ContextMenu.CheckboxItem>
				{#snippet children({ checked })}
					{checked ? "✅" : ""}
				{/snippet}
			</ContextMenu.CheckboxItem>

			<ContextMenu.RadioGroup>
				<ContextMenu.GroupHeading />
				<ContextMenu.RadioItem>
					{#snippet children({ checked })}
						{checked ? "✅" : ""}
					{/snippet}
				</ContextMenu.RadioItem>
			</ContextMenu.RadioGroup>

			<ContextMenu.Sub>
				<ContextMenu.SubTrigger />
				<ContextMenu.SubContent />
			</ContextMenu.Sub>

			<ContextMenu.Separator />
			<ContextMenu.Arrow />
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
```

## Reusable Components

If you're planning to use Context Menu in multiple places, you can create a reusable component that wraps the Context Menu component.

This example shows you how to create a Context Menu component that accepts a few custom props that make it more capable.

```svelte title="CustomContextMenu.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { ContextMenu, type WithoutChild } from "bits-ui";
	type Props = ContextMenu.Props & {
		trigger: Snippet;
		items: string[];
		contentProps?: WithoutChild<ContextMenu.Content.Props>;
		// other component props if needed
	};
	let {
		open = $bindable(false),
		children,
		trigger,
		items,
		contentProps,
		...restProps
	}: Props = $props();
</script>

<ContextMenu.Root bind:open {...restProps}>
	<ContextMenu.Trigger>
		{@render trigger()}
	</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content {...contentProps}>
			<ContextMenu.Group>
				<ContextMenu.GroupHeading>Select an Office</ContextMenu.GroupHeading>
				{#each items as item}
					<ContextMenu.Item textValue={item}>
						{item}
					</ContextMenu.Item>
				{/each}
			</ContextMenu.Group>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
```

You can then use the `CustomContextMenu` component like this:

```svelte
<script lang="ts">
	import CustomContextMenu from "./CustomContextMenu.svelte";
</script>

<CustomContextMenu items={["Dunder Mifflin", "Vance Refrigeration", "Michael Scott Paper Company"]}>
	{#snippet triggerArea()}
		<div class="grid size-20 place-items-center rounded-lg border border-dashed p-4">
			Right-click me
		</div>
	{/snippet}
</CustomContextMenu>
```

Alternatively, you can define the snippet(s) separately and pass them as props to the component:

```svelte
<script lang="ts">
	import CustomContextMenu from "./CustomContextMenu.svelte";
</script>

{#snippet triggerArea()}
	<div class="grid size-20 place-items-center rounded-lg border border-dashed p-4">
		Right-click me
	</div>
{/snippet}

<CustomContextMenu
	items={["Dunder Mifflin", "Vance Refrigeration", "Michael Scott Paper Company"]}
	{triggerArea}
/>
```

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Context Menu's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { ContextMenu } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Context Menu</button>

<ContextMenu.Root bind:open={isOpen}>
	<!-- ... -->
</ContextMenu.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the menu closes/opens (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { ContextMenu } from "bits-ui";
	let isOpen = $state(false);
</script>

<ContextMenu.Root
	open={isOpen}
	onOpenChange={(o) => {
		isOpen = o;
		// additional logic here.
	}}
>
	<!-- ... -->
</ContextMenu.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { ContextMenu } from "bits-ui";
	let myOpen = $state(false);
</script>

<ContextMenu.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</ContextMenu.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Checkbox Items

You can use the `ContextMenu.CheckboxItem` component to create a `menuitemcheckbox` element to add checkbox functionality to menu items.

```svelte
<script lang="ts">
	import { ContextMenu } from "bits-ui";

	let notifications = $state(true);
</script>

<ContextMenu.CheckboxItem bind:checked={notifications}>
	{#snippet children({ checked, indeterminate })}
		{#if indeterminate}
			-
		{:else if checked}
			✅
		{/if}
		Notifications
	{/snippet}
</ContextMenu.CheckboxItem>
```

See the [CheckboxItem API](#contextmenucheckboxitem) for more information.

## Radio Groups

You can combine the `ContextMenu.RadioGroup` and `ContextMenu.RadioItem` components to create a radio group within a menu.

```svelte
<script lang="ts">
	import { ContextMenu } from "bits-ui";

	const values = ["one", "two", "three"];
	let value = $state("one");
</script>

<ContextMenu.RadioGroup bind:value>
	{#each values as value}
		<ContextMenu.RadioItem {value}>
			{#snippet children({ checked })}
				{#if checked}
					✅
				{/if}
				{value}
			{/snippet}
		</ContextMenu.RadioItem>
	{/each}
</ContextMenu.RadioGroup>
```

See the [RadioGroup](#contextmenuradiogroup) and [RadioItem](#contextmenuradioitem) APIs for more information.

## Nested Menus

You can create nested menus using the `ContextMenu.Sub` component to create complex menu structures.

```svelte /ContextMenu.Sub/
<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<ContextMenu.Content>
	<ContextMenu.Item>Item 1</ContextMenu.Item>
	<ContextMenu.Item>Item 2</ContextMenu.Item>
	<ContextMenu.Sub>
		<ContextMenu.SubTrigger>Open Sub Menu</ContextMenu.SubTrigger>
		<ContextMenu.SubContent>
			<ContextMenu.Item>Sub Item 1</ContextMenu.Item>
			<ContextMenu.Item>Sub Item 2</ContextMenu.Item>
		</ContextMenu.SubContent>
	</ContextMenu.Sub>
</ContextMenu.Content>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `ContextMenu.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { ContextMenu } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<ContextMenu.Content forceMount>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:fly>
					<ContextMenu.Item>Item 1</ContextMenu.Item>
					<ContextMenu.Item>Item 2</ContextMenu.Item>
				</div>
			</div>
		{/if}
	{/snippet}
</ContextMenu.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="context-menu-demo-transition" comp="ContextMenu" containerClass="mt-4">

{#snippet preview()}
<ContextMenuDemoTransition />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
