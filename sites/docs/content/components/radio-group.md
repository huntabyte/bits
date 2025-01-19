---
title: Radio Group
description: Allows users to select a single option from a list of mutually exclusive choices.
---

<script>
	import { APISection, ComponentPreviewV2, RadioGroupDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="radio-group-demo" comp="RadioGroup">

{#snippet preview()}
<RadioGroupDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { RadioGroup } from "bits-ui";
</script>

<RadioGroup.Root>
	<RadioGroup.Item>
		{#snippet children({ checked })}
			{#if checked}
				✅
			{/if}
		{/snippet}
	</RadioGroup.Item>
</RadioGroup.Root>
```

## Reusable Components

It's recommended to use the `RadioGroup` primitives to create your own custom components that can be used throughout your application.

In the example below, we're creating a custom `MyRadioGroup` component that takes in an array of items and renders a radio group with those items along with a [`Label`](/docs/components/label) component for each item.

```svelte title="MyRadioGroup.svelte"
<script lang="ts">
	import { RadioGroup, Label, type WithoutChildrenOrChild, useId } from "bits-ui";

	type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	type Props = WithoutChildrenOrChild<RadioGroup.RootProps> & {
		items: Item[];
	};

	let { value = $bindable(""), ref = $bindable(null), items, ...restProps }: Props = $props();
</script>

<RadioGroup.Root bind:value bind:ref {...restProps}>
	{#each items as item}
		{@const id = useId()}
		<div>
			<RadioGroup.Item {id} value={item.value} disabled={item.disabled}>
				{#snippet children({ checked })}
					{#if checked}
						✅
					{/if}
				{/snippet}
			</RadioGroup.Item>
			<Label.Root for={id}>{item.label}</Label.Root>
		</div>
	{/each}
</RadioGroup.Root>
```

You can then use the `MyRadioGroup` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyRadioGroup from "$lib/components/MyRadioGroup.svelte";

	const myItems = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "coconut", label: "Coconut", disabled: true },
	];
</script>

<MyRadioGroup items={myItems} name="favoriteFruit" />
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Radio Group's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { RadioGroup } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<RadioGroup.Root bind:value={myValue}>
	<!-- ... -->
</RadioGroup.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via clicking on an item)
-   Allows external control (e.g., selecting an item via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { RadioGroup } from "bits-ui";
	let myValue = $state("");
</script>

<RadioGroup.Root
	value={myValue}
	onValueChange={(v) => {
		myValue = v;
		// additional logic here.
	}}
>
	<!-- ... -->
</RadioGroup.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { RadioGroup } from "bits-ui";
	let myValue = $state("");
</script>

<RadioGroup.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</RadioGroup.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## HTML Forms

If you set the `name` prop on the `RadioGroup.Root` component, a hidden input element will be rendered to submit the value of the radio group to a form.

```svelte /name="favoriteFruit"/
<RadioGroup.Root name="favoriteFruit">
	<!-- ... -->
</RadioGroup.Root>
```

### Required

To make the hidden input element `required` you can set the `required` prop on the `RadioGroup.Root` component.

```svelte /required/
<RadioGroup.Root required>
	<!-- ... -->
</RadioGroup.Root>
```

## Disabling Items

You can disable a radio group item by setting the `disabled` prop to `true`.

```svelte /disabled/
<RadioGroup.Item value="apple" disabled>Apple</RadioGroup.Item>
```

## Orientation

The `orientation` prop is used to determine the orientation of the radio group, which influences how keyboard navigation will work.

When the `orientation` is set to `'vertical'`, the radio group will navigate through the items using the `ArrowUp` and `ArrowDown` keys. When the `orientation` is set to `'horizontal'`, the radio group will navigate through the items using the `ArrowLeft` and `ArrowRight` keys.

```svelte /orientation="vertical"/ /orientation="horizontal"/
<RadioGroup.Root orientation="vertical">
	<!-- ... -->
</RadioGroup.Root>

<RadioGroup.Root orientation="horizontal">
	<!-- ... -->
</RadioGroup.Root>
```

<APISection {schemas} />
