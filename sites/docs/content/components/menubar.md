---
title: Menubar
description: Organizes and presents a collection of menu options or actions within a horizontal bar.
---

<script>
	import { APISection, ComponentPreviewV2, MenubarDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="menubar-demo" comp="Menubar">

{#snippet preview()}
<MenubarDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Menubar } from "bits-ui";
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger />
		<Menubar.Portal>
			<Menubar.Content>
				<Menubar.Group>
					<Menubar.GroupHeading />
					<Menubar.Item />
				</Menubar.Group>

				<Menubar.Item />

				<Menubar.CheckboxItem>
					{#snippet children({ checked })}
						{checked ? "✅" : ""}
					{/snippet}
				</Menubar.CheckboxItem>

				<Menubar.RadioGroup>
					<Menubar.GroupHeading />
					<Menubar.RadioItem>
						{#snippet children({ checked })}
							{checked ? "✅" : ""}
						{/snippet}
					</Menubar.RadioItem>
				</Menubar.RadioGroup>

				<Menubar.Sub>
					<Menubar.SubTrigger />
					<Menubar.SubContent />
				</Menubar.Sub>

				<Menubar.Separator />
				<Menubar.Arrow />
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
</Menubar.Root>
```

## Reusable Components

If you're planning to use Menubar in multiple places, you can create reusable components that wrap the different parts of the Menubar.

In the following example, we're creating a reusable `MyMenubarMenu` component that contains the trigger, content, and items of a menu.

```svelte title="MyMenubarMenu.svelte"
<script lang="ts">
	import { Menubar, type WithoutChildrenOrChild } from "bits-ui";

	type Props = WithoutChildrenOrChild<Menubar.MenuProps> & {
		triggerText: string;
		items: { label: string; value: string; onSelect?: () => void }[];
		contentProps?: WithoutChildrenOrChild<Menubar.ContentProps>;
		// other component props if needed
	};

	let { triggerText, items, contentProps, ...restProps }: Props = $props();
</script>

<Menubar.Menu {...restProps}>
	<Menubar.Trigger>
		{triggerText}
	</Menubar.Trigger>
	<Menubar.Content {...contentProps}>
		<Menubar.Group aria-label={triggerText}>
			{#each items as item}
				<Menubar.Item textValue={item.label} onSelect={item.onSelect}>
					{item.label}
				</Menubar.Item>
			{/each}
		</Menubar.Group>
	</Menubar.Content>
</Menubar.Menu>
```

Now, we can use the `MyMenubarMenu` component within a `Menubar.Root` component to render out the various menus.

```svelte
<script lang="ts">
	import { Menubar } from "bits-ui";
	import MyMenubarMenu from "./MyMenubarMenu.svelte";

	const sales = [
		{ label: "Michael Scott", value: "michael" },
		{ label: "Dwight Schrute", value: "dwight" },
		{ label: "Jim Halpert", value: "jim" },
		{ label: "Stanley Hudson", value: "stanley" },
		{ label: "Phyllis Vance", value: "phyllis" },
		{ label: "Pam Beesly", value: "pam" },
		{ label: "Andy Bernard", value: "andy" },
	];

	const hr = [
		{ label: "Toby Flenderson", value: "toby" },
		{ label: "Holly Flax", value: "holly" },
		{ label: "Jan Levinson", value: "jan" },
	];

	const accounting = [
		{ label: "Angela Martin", value: "angela" },
		{ label: "Kevin Malone", value: "kevin" },
		{ label: "Oscar Martinez", value: "oscar" },
	];

	const menubarMenus = [
		{ title: "Sales", items: sales },
		{ title: "HR", items: hr },
		{ title: "Accounting", items: accounting },
	];
</script>

<Menubar.Root>
	{#each menubarMenus as { title, items }}
		<CustomMenubar triggerText={title} {items} />
	{/each}
</Menubar.Root>
```

## Value State

Bits UI provides flexible options for controlling and synchronizing the menubar's active value state. The `value` represents the currently opened menu within the menubar.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the menubar's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Menubar } from "bits-ui";
	let activeValue = $state("");
</script>

<button onclick={() => (activeValue = "menu-1")}>Open Menubar Menu</button>
<Menubar.Root bind:value={activeValue}>
	<Menubar.Menu value="menu-1">
		<!-- ... -->
	</Menubar.Menu>
	<Menubar.Menu value="menu-2">
		<!-- ... -->
	</Menubar.Menu>
</Menubar.Root>
```

### Change Handler

You can also use the `onValueChange` prop to update local state when the menubar's active menu changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the menus open or close.

```svelte {3,7-11}
<script lang="ts">
	import { Menubar } from "bits-ui";
	let activeValue = $state("");
</script>

<Menubar.Root
	value={activeValue}
	onOpenChange={(value) => {
		activeValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</Menubar.Root>
```

## Checkbox Items

You can use the `Menubar.CheckboxItem` component to create a `menuitemcheckbox` element to add checkbox functionality to menu items.

```svelte
<script lang="ts">
	import { Menubar } from "bits-ui";

	let notifications = $state(true);
</script>

<Menubar.CheckboxItem bind:checked={notifications}>
	{#snippet children({ checked, indeterminate })}
		{#if indeterminate}
			-
		{:else if checked}
			✅
		{/if}
		Notifications
	{/snippet}
</Menubar.CheckboxItem>
```

## Radio Groups

You can combine the `Menubar.RadioGroup` and `Menubar.RadioItem` components to create a radio group within a menu.

```svelte
<script lang="ts">
	import { Menubar } from "bits-ui";

	const values = ["one", "two", "three"];
	let value = $state("one");
</script>

<Menubar.RadioGroup bind:value>
	{#each values as value}
		<Menubar.RadioItem {value}>
			{#snippet children({ checked })}
				{#if checked}
					✅
				{/if}
				{value}
			{/snippet}
		</Menubar.RadioItem>
	{/each}
</Menubar.RadioGroup>
```

## Nested Menus

You can create nested menus using the `Menubar.Sub` component to create complex menu structures.

```svelte /Menubar.Sub/
<script lang="ts">
	import { Menubar } from "bits-ui";
</script>

<Menubar.Content>
	<Menubar.Item>Item 1</Menubar.Item>
	<Menubar.Item>Item 2</Menubar.Item>
	<Menubar.Sub>
		<Menubar.SubTrigger>Open Sub Menu</Menubar.SubTrigger>
		<Menubar.SubContent>
			<Menubar.Item>Sub Item 1</Menubar.Item>
			<Menubar.Item>Sub Item 2</Menubar.Item>
		</Menubar.SubContent>
	</Menubar.Sub>
</Menubar.Content>
```

<!-- <MenubarDemoNested /> -->

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Menubar.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { Menubar } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<Menubar.Content forceMount>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:fly>
					<Menubar.Item>Item 1</Menubar.Item>
					<Menubar.Item>Item 2</Menubar.Item>
				</div>
			</div>
		{/if}
	{/snippet}
</Menubar.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<APISection {schemas} />
