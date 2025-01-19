---
title: Slider
description: Allows users to select a value from a continuous range by sliding a handle.
---

<script>
	import { APISection, ComponentPreviewV2, SliderDemo, SliderDemoMultiple, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="slider-demo" comp="Slider">

{#snippet preview()}
<SliderDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";
</script>

<Slider.Root>
	<Slider.Range />
	<Slider.Thumb />
	<Slider.Tick />
</Slider.Root>
```

## Reusable Components

Bits UI provides primitives that enable you to build your own custom slider component that can be reused throughout your application.

Here's an example of how you might create a reusable `MySlider` component.

```svelte title="MyMultiSlider.svelte"
<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { Slider } from "bits-ui";

	type Props = WithoutChildren<ComponentProps<typeof Slider.Root>>;

	let { value = $bindable(), ref = $bindable(null), ...restProps }: Props = $props();
</script>

<!--
 Since we have to destructure the `value` to make it `$bindable`, we need to use `as any` here to avoid
 type errors from the discriminated union of `"single" | "multiple"`.
 (an unfortunate consequence of having to destructure bindable values)
  -->
<Slider.Root bind:value bind:ref {...restProps as any}>
	{#snippet children({ thumbs, ticks })}
		<Slider.Range />
		{#each thumbs as index}
			<Slider.Thumb {index} />
		{/each}

		{#each ticks as index}
			<Slider.Tick {index} />
		{/each}
	{/snippet}
</Slider.Root>
```

You can then use the `MySlider` component in your application like so:

```svelte
<script lang="ts">
	import MySlider from "$lib/components/MySlider.svelte";

	let multiValue = $state([5, 10]);
	let singleValue = $state(50);
</script>

<MySlider bind:value={multiValue} type="multiple" />
<MySlider bind:value={singleValue} type="single" />
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Slider's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";
	let myValue = $state(0);
</script>

<button onclick={() => (myValue = 20)}> Set value to 20 </button>

<Slider.Root bind:value={myValue} type="single">
	<!-- ... -->
</Slider.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., via dragging the thumb(s))
-   Allows external control (e.g., updating the value via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";
	let myValue = $state(0);
</script>

<Slider.Root
	type="single"
	value={myValue}
	onValueChange={(v) => {
		myValue = v;
		// additional logic here.
	}}
>
	<!-- ... -->
</Slider.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";
	let myValue = $state(0);
</script>

<Slider.Root type="single" bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Slider.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Value Commit

You can use the `onValueCommit` prop to be notified when the user finishes dragging the thumb and the value changes. This is different than the `onValueChange` callback because it waits until the user stops dragging before calling the callback, where the `onValueChange` callback is called as the user dragging.

```svelte
<Slider.Root
	onValueCommit={(v) => {
		console.log("user is done sliding!", v);
	}}
/>
```

## Multiple Thumbs and Ticks

If the `value` prop has more than one value, the slider will render multiple thumbs. You can also use the `ticks` snippet prop to render ticks at specific intervals

```svelte
<script lang="ts">
	import { Slider } from "bits-ui";

	// we have two numbers in the array, so the slider will render two thumbs
	let value = $state([5, 7]);
</script>

<Slider.Root type="multiple" min={0} max={10} step={1} bind:value>
	{#snippet children({ ticks, thumbs })}
		<Slider.Range />

		{#each thumbs as index}
			<Slider.Thumb {index} />
		{/each}

		{#each ticks as index}
			<Slider.Tick {index} />
		{/each}
	{/snippet}
</Slider.Root>
```

To determine the number of ticks that will be rendered, you can simply divide the `max` value by the `step` value.

## Single Type

Set the `type` prop to `"single"` to allow only one accordion item to be open at a time.

```svelte /type="single"/
<Slider.Root type="single" />
```

<ComponentPreviewV2 name="slider-demo" comp="Slider">

{#snippet preview()}
<SliderDemo />
{/snippet}

</ComponentPreviewV2>

## Multiple Type

Set the `type` prop to `"multiple"` to allow multiple accordion items to be open at the same time.

```svelte /type="multiple"/
<Slider.Root type="multiple" />
```

<ComponentPreviewV2 name="slider-demo-multiple" comp="Slider">

{#snippet preview()}
<SliderDemoMultiple />
{/snippet}

</ComponentPreviewV2>

## Vertical Orientation

You can use the `orientation` prop to change the orientation of the slider, which defaults to `"horizontal"`.

```svelte
<Slider.Root type="single" orientation="vertical">
	<!-- ... -->
</Slider.Root>
```

## RTL Support

You can use the `dir` prop to change the reading direction of the slider, which defaults to `"ltr"`.

```svelte
<Slider.Root type="single" dir="rtl">
	<!-- ... -->
</Slider.Root>
```

## Auto Sort

By default, the slider will sort the values from smallest to largest, so if you drag a smaller thumb to a larger value, the value of that thumb will be updated to the larger value.

You can disable this behavior by setting the `autoSort` prop to `false`.

```svelte
<Slider.Root type="multiple" autoSort={false}>
	<!-- ... -->
</Slider.Root>
```

## HTML Forms

Since there is a near endless number of possible values that a user can select, the slider does not render a hidden input element by default.

You'll need to determine how you want to submit the value(s) of the slider with a form.

Here's an example of how you might do that:

```svelte
<script lang="ts">
	import MySlider from "$lib/components/MySlider.svelte";

	let expectedIncome = $state([50, 100]);
	let desiredIncome = $state(50);
</script>

<form method="POST">
	<MySlider type="multiple" bind:value={expectedIncome} />
	<input type="hidden" name="expectedIncomeStart" value={expectedIncome[0]} />
	<input type="hidden" name="expectedIncomeEnd" value={expectedIncome[1]} />
	<MySlider type="single" bind:value={desiredIncome} />
	<input type="hidden" name="expectedIncomeEnd" value={desiredIncome} />
	<button type="submit">Submit</button>
</form>
```

<APISection {schemas} />
