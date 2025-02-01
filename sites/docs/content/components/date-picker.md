---
title: Date Picker
description: Facilitates the selection of dates through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreviewV2, DatePickerDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-picker-demo" comp="Date Picker">

{#snippet preview()}
<DatePickerDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Structure

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
</script>

<DatePicker.Root>
	<DatePicker.Label />
	<DatePicker.Input>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				<DatePicker.Segment {part}>
					{value}
				</DatePicker.Segment>
			{/each}
		{/snippet}
		<DatePicker.Trigger />
	</DatePicker.Input>
	<DatePicker.Content>
		<DatePicker.Calendar>
			{#snippet children({ months, weekdays })}
				<DatePicker.Header>
					<DatePicker.PrevButton />
					<DatePicker.Heading />
					<DatePicker.NextButton />
				</DatePicker.Header>
				{#each months as month}
					<DatePicker.Grid>
						<DatePicker.GridHead>
							<DatePicker.GridRow>
								{#each weekdays as day}
									<DatePicker.HeadCell>
										{day}
									</DatePicker.HeadCell>
								{/each}
							</DatePicker.GridRow>
						</DatePicker.GridHead>
						<DatePicker.GridBody>
							{#each month.weeks as weekDates}
								<DatePicker.GridRow>
									{#each weekDates as date}
										<DatePicker.Cell {date} month={month.value}>
											<DatePicker.Day />
										</DatePicker.Cell>
									{/each}
								</DatePicker.GridRow>
							{/each}
						</DatePicker.GridBody>
					</DatePicker.Grid>
				{/each}
			{/snippet}
		</DatePicker.Calendar>
	</DatePicker.Content>
</DatePicker.Root>
```

## Managing Placeholder State

Bits UI offers several approaches to manage and synchronize the component's placeholder state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:placeholder` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myPlaceholder = new CalendarDate(2024, 8, 3))}>
	Set placeholder to August 3rd, 2024
</button>

<DatePicker.Root bind:placeholder={myPlaceholder}>
	<!-- ... -->
</DatePicker.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myPlaceholder` when the internal state changes
-   Allows external control (e.g., changing the placeholder via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onPlaceholderChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DatePicker.Root
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => {
		placeholder = p;
	}}
>
	<!-- ... -->
</DatePicker.Root>
```

#### Use Cases

-   Implementing custom behaviors on placeholder change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let myPlaceholder = $state();
</script>

<DatePicker.Root
	bind:placeholder={() => myPlaceholder, (newPlaceholder) => (myPlaceholder = newPlaceholder)}
>
	<!-- ... -->
</DatePicker.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Managing Value State

Bits UI offers several approaches to manage and synchronize the component's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myValue = myValue.add({ days: 1 }))}> Add 1 day </button>
<DatePicker.Root bind:value={myValue}>
	<!-- ... -->
</DatePicker.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes
-   Allows external control (e.g., changing the value via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DatePicker.Root
	value={myValue}
	onValueChange={(v) => {
		value = v.set({ hour: v.hour + 1 });
	}}
>
	<!-- ... -->
</DatePicker.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let myValue = $state();
</script>

<DatePicker.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</DatePicker.Root>
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

Bits UI offers several approaches to manage and synchronize the component's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open DatePicker</button>

<DatePicker.Root bind:open={isOpen}>
	<!-- ... -->
</DatePicker.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the picker closes (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let isOpen = $state(false);
</script>

<DatePicker.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</DatePicker.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let myOpen = $state(false);
</script>

<DatePicker.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</DatePicker.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Customization

The `DatePicker` component is made up of three other Bits UI components: [Date Field](/docs/components/date-field), [Calendar](/docs/components/calendar), and [Popover](/docs/components/popover).

You can check out the documentation for each of these components to learn more about their customization options, each of which can be used to customize the `DatePicker` component.

<APISection {schemas} />
