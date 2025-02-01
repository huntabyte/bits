---
title: Switch
description: A toggle control enabling users to switch between "on" and "off" states.
---

<script>
	import { APISection, ComponentPreviewV2, SwitchDemo, SwitchDemoCustom, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="switch-demo" comp="Switch">

{#snippet preview()}
<SwitchDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Switch component provides an intuitive and accessible toggle control, allowing users to switch between two states, typically "on" and "off". This component is commonly used for enabling or disabling features, toggling settings, or representing boolean values in forms. The Switch offers a more visual and interactive alternative to traditional checkboxes for binary choices.

## Key Features

-   **Accessibility**: Built with WAI-ARIA guidelines in mind, ensuring keyboard navigation and screen reader support.
-   **State Management**: Internally manages the on/off state, with options for controlled and uncontrolled usage.
-   **Style-able**: Data attributes allow for smooth transitions between states and custom styles.
-   **HTML Forms**: Can render a hidden input element for form submissions.

## Architecture

The Switch component is composed of two main parts:

-   **Root**: The main container component that manages the state and behavior of the switch.
-   **Thumb**: The "movable" part of the switch that indicates the current state.

## Structure

Here's an overview of how the Switch component is structured in code:

```svelte
<script lang="ts">
	import { Switch } from "bits-ui";
</script>

<Switch.Root>
	<Switch.Thumb />
</Switch.Root>
```

## Reusable Components

It's recommended to use the `Switch` primitives to create your own custom switch component that can be used throughout your application.

In the example below, we're using the `Checkbox` and [`Label`](/docs/components/label) components to create a custom switch component.

```svelte title="MySwitch.svelte"
<script lang="ts">
	import { Switch, Label, useId, type WithoutChildrenOrChild } from "bits-ui";

	let {
		id = useId(),
		checked = $bindable(false),
		ref = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Switch.RootProps> & {
		labelText: string;
	} = $props();
</script>

<Switch.Root bind:checked bind:ref {id} {...restProps}>
	<Switch.Thumb />
</Switch.Root>
<Label.Root for={id}>{labelText}</Label.Root>
```

You can then use the `MySwitch` component in your application like so:

```svelte
<script lang="ts">
	import MySwitch from "$lib/components/MySwitch.svelte";

	let notifications = $state(true);
</script>

<MySwitch bind:checked={notifications} labelText="Enable notifications" />
```

## Managing Checked State

Bits UI offers several approaches to manage and synchronize the Switch's checked state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:checked` directive. This method automatically keeps your local state in sync with the switch's internal state.

```svelte
<script lang="ts">
	import { Switch } from "bits-ui";
	let myChecked = $state(true);
</script>

<button onclick={() => (myChecked = false)}> uncheck </button>

<Switch.Root bind:checked={myChecked} />
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myChecked` when the switch changes (e.g., via clicking on the switch)
-   Allows external control (e.g., checking via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onCheckedChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Switch } from "bits-ui";
	let myChecked = $state(false);
</script>

<Switch.Root
	checked={myChecked}
	onCheckedChange={(checked) => {
		myChecked = checked;
		// additional logic here.
	}}
/>
```

#### Use Cases

-   Implementing custom behaviors on checked/unchecked
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Switch } from "bits-ui";
	let myChecked = $state(false);
</script>

<Switch.Root bind:checked={() => myChecked, (newChecked) => (myChecked = newChecked)}>
	<!-- ... -->
</Switch.Root>
```

#### When to Use

-   Implementing complex checked/unchecked logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Disabled State

You can disable the switch by setting the `disabled` prop to `true`.

```svelte /disabled/
<Switch.Root disabled>
	<!-- ...-->
</Switch.Root>
```

<SwitchDemoCustom disabled labelText="Do not disturb" />

## HTML Forms

If you pass the `name` prop to `Switch.Root`, a hidden input element will be rendered to submit the value of the switch to a form.

By default, the input will be submitted with the default checkbox value of `'on'` if the switch is checked.

```svelte /name="dnd"/
<Switch.Root name="dnd">
	<!-- ... -->
</Switch.Root>
```

### Custom Input Value

If you'd prefer to submit a different value, you can use the `value` prop to set the value of the hidden input.

For example, if you wanted to submit a string value, you could do the following:

```svelte /value="hello"/
<Switch.Root name="dnd" value="hello">
	<!-- ... -->
	<Switch.Thumb />
</Switch.Root>
```

### Required

If you want to make the switch required, you can use the `required` prop.

```svelte /required/
<Switch.Root required>
	<!-- ... -->
</Switch.Root>
```

This will apply the `required` attribute to the hidden input element, ensuring that proper form submission is enforced.

<APISection {schemas} />
