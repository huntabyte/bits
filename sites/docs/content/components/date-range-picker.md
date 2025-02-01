---
title: Date Range Picker
description: Facilitates the selection of date ranges through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreviewV2, DateRangePickerDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-range-picker-demo" comp="Date Range Picker">

{#snippet preview()}
<DateRangePickerDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Structure

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
</script>

<DateRangePicker.Root>
	<DateRangePicker.Label />
	{#each ["start", "end"] as const as type}
		<DateRangePicker.Input {type}>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<DateRangePicker.Segment {part}>
						{value}
					</DateRangePicker.Segment>
				{/each}
			{/snippet}
		</DateRangePicker.Input>
	{/each}
	<DateRangePicker.Trigger />
	<DateRangePicker.Content>
		<DateRangePicker.Calendar>
			{#snippet children({ months, weekdays })}
				<DateRangePicker.Header>
					<DateRangePicker.PrevButton />
					<DateRangePicker.Heading />
					<DateRangePicker.NextButton />
				</DateRangePicker.Header>
				{#each months as month}
					<DateRangePicker.Grid>
						<DateRangePicker.GridHead>
							<DateRangePicker.GridRow>
								{#each weekdays as day}
									<DateRangePicker.HeadCell>
										{day}
									</DateRangePicker.HeadCell>
								{/each}
							</DateRangePicker.GridRow>
						</DateRangePicker.GridHead>
						<DateRangePicker.GridBody>
							{#each month.weeks as weekDates}
								<DateRangePicker.GridRow>
									{#each weekDates as date}
										<DateRangePicker.Cell {date} month={month.value}>
											<DateRangePicker.Day>
												{date.day}
											</DateRangePicker.Day>
										</DateRangePicker.Cell>
									{/each}
								</DateRangePicker.GridRow>
							{/each}
						</DateRangePicker.GridBody>
					</DateRangePicker.Grid>
				{/each}
			{/snippet}
		</DateRangePicker.Calendar>
	</DateRangePicker.Content>
</DateRangePicker.Root>
```

## Managing Placeholder State

Bits UI offers several approaches to manage and synchronize the component's placeholder state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:placeholder` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangePicker.Root bind:placeholder={myPlaceholder}>
	<!-- ... -->
</DateRangePicker.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myPlaceholder` when the internal state changes
-   Allows external control (e.g., changing the placeholder via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onPlaceholderChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangePicker.Root
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => {
		myPlaceholder = p.set({ year: 2025 });
	}}
>
	<!-- ... -->
</DateRangePicker.Root>
```

#### Use Cases

-   Implementing custom behaviors on placeholder change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myPlaceholder = $state();
</script>

<DateRangePicker.Root
	bind:placeholder={() => myPlaceholder, (newPlaceholder) => (myPlaceholder = newPlaceholder)}
>
	<!-- ... -->
</DateRangePicker.Root>
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
	import { DateRangePicker } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state({
		start: new CalendarDateTime(2024, 8, 3, 12, 30),
		end: new CalendarDateTime(2024, 8, 4, 12, 30),
	});
</script>

<button
	onclick={() => {
		value = {
			start: value.start.add({ days: 1 }),
			end: value.end.add({ days: 1 }),
		};
	}}
>
	Add 1 day
</button>
<DateRangePicker.Root bind:value={myValue}>
	<!-- ... -->
</DateRangePicker.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes
-   Allows external control (e.g., changing the value via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state({
		start: new CalendarDateTime(2024, 8, 3, 12, 30),
		end: new CalendarDateTime(2024, 8, 4, 12, 30),
	});
</script>

<DateRangePicker.Root
	value={myValue}
	onValueChange={(v) => {
		value = {
			start: v.start?.set({ hour: v.start.hour + 1 }),
			end: v.end?.set({ hour: v.end.hour + 1 }),
		};
	}}
>
	<!-- ... -->
</DateRangePicker.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myValue = $state();
</script>

<DateRangePicker.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</DateRangePicker.Root>
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
	import { DateRangePicker } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open DateRangePicker</button>

<DateRangePicker.Root bind:open={isOpen}>
	<!-- ... -->
</DateRangePicker.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the picker closes (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let isOpen = $state(false);
</script>

<DateRangePicker.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</DateRangePicker.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myOpen = $state(false);
</script>

<DateRangePicker.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</DateRangePicker.Root>
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

The `DateRangePicker` component is made up of three other Bits UI components: [Date Range Field](/docs/components/date-range-field), [Range Calendar](/docs/components/range-calendar), and [Popover](/docs/components/popover).

You can check out the documentation for each of these components to learn more about their customization options, each of which can be used to customize the `DateRangePicker` component.

<APISection {schemas} />
