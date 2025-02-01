---
title: Calendar
description: Displays dates and days of the week, facilitating date-related interactions.
---

<script>
	import { APISection, ComponentPreviewV2, CalendarDemo, Callout } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="calendar-demo" comp="Calendar">

{#snippet preview()}
<CalendarDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Structure

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
</script>

<Calendar.Root>
	{#snippet children({ months, weekdays })}
		<Calendar.Header>
			<Calendar.PrevButton />
			<Calendar.Heading />
			<Calendar.NextButton />
		</Calendar.Header>

		{#each months as month}
			<Calendar.Grid>
				<Calendar.GridHead>
					<Calendar.GridRow>
						{#each weekdays as day}
							<Calendar.HeadCell>
								{day}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow>
							{#each weekDates as date}
								<Calendar.Cell {date} month={month.value}>
									<Calendar.Day />
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	{/snippet}
</Calendar.Root>
```

## Placeholder

The `placeholder` prop for the `Calendar.Root` component determines what date our calendar should start with when the user hasn't selected a date yet. It also determines the current "view" of the calendar.

As the user navigates through the calendar, the `placeholder` will be updated to reflect the currently focused date in that view.

By default, the `placeholder` will be set to the current date, and be of type `CalendarDate`.

## Managing Placeholder State

Bits UI offers several approaches to manage and synchronize the component's placeholder state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:placeholder` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myPlaceholder = new CalendarDate(2024, 8, 3))}>
	Set placeholder to August 3rd, 2024
</button>

<Calendar.Root bind:placeholder={myPlaceholder}>
	<!-- ... -->
</Calendar.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myPlaceholder` when the internal state changes
-   Allows external control (e.g., changing the placeholder via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onPlaceholderChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<Calendar.Root
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => {
		placeholder = p;
	}}
>
	<!-- ... -->
</Calendar.Root>
```

#### Use Cases

-   Implementing custom behaviors on placeholder change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	let myPlaceholder = $state();
</script>

<Calendar.Root
	bind:placeholder={() => myPlaceholder, (newPlaceholder) => (myPlaceholder = newPlaceholder)}
>
	<!-- ... -->
</Calendar.Root>
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

```svelte {3,6,8}
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myValue = myValue.add({ days: 1 }))}> Add 1 day </button>
<Calendar.Root bind:value={myValue}>
	<!-- ... -->
</Calendar.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes
-   Allows external control (e.g., changing the value via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<Calendar.Root
	value={myValue}
	onValueChange={(v) => {
		value = v.set({ hour: v.hour + 1 });
	}}
>
	<!-- ... -->
</Calendar.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	let myValue = $state();
</script>

<Calendar.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Calendar.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Default Value

Often, you'll want to start the `Calendar.Root` component with a default value. Likely this value will come from a database in the format of an ISO 8601 string.

You can use the `parseDate` function from the `@internationalized/date` package to parse the string into a `CalendarDate` object.

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { parseDate } from "@internationalized/date";

	// this came from a database/API call
	const date = "2024-08-03";

	let value = $state(parseDate(date));
</script>

<Calendar.Root {value}>
	<!-- ...-->
</Calendar.Root>
```

## Validation

### Minimum Value

You can set a minimum value for the calendar by using the `minValue` prop on `Calendar.Root`. If a user selects a date that is less than the minimum value, the calendar will be marked as invalid.

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { today, getLocalTimeZone } from "@internationalized/date";

	const todayDate = today(getLocalTimeZone());
	const yesterday = todayDate.subtract({ days: 1 });
</script>

<Calendar.Root minValue={todayDate} value={yesterday}>
	<!-- ...-->
</Calendar.Root>
```

### Maximum Value

You can set a maximum value for the calendar by using the `maxValue` prop on `Calendar.Root`. If a user selects a date that is greater than the maximum value, the calendar will be marked as invalid.

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { today, getLocalTimeZone } from "@internationalized/date";

	const todayDate = today(getLocalTimeZone());
	const tomorrow = todayDate.add({ days: 1 });
</script>

<Calendar.Root maxValue={todayDate} value={tomorrow}>
	<!-- ...-->
</Calendar.Root>
```

### Unavailable Dates

You can specify specific dates that are unavailable for selection by using the `isDateUnavailable` prop. This prop accepts a function that returns a boolean value indicating whether a date is unavailable or not.

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { today, getLocalTimeZone, isNotNull } from "@internationalized/date";

	const todayDate = today(getLocalTimeZone());
	const tomorrow = todayDate.add({ days: 1 });

	function isDateUnavailable(date: DateValue) {
		return date.day === 1;
	}
</script>

<Calendar.Root {isDateUnavailable} value={tomorrow}>
	<!-- ...-->
</Calendar.Root>
```

### Disabled Dates

You can specify specific dates that are disabled for selection by using the `isDateDisabled` prop.

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { today, getLocalTimeZone, isNotNull } from "@internationalized/date";

	const todayDate = today(getLocalTimeZone());
	const tomorrow = todayDate.add({ days: 1 });

	function isDateDisabled(date: DateValue) {
		return date.day === 1;
	}
</script>

<Calendar.Root {isDateDisabled} value={tomorrow}>
	<!-- ...-->
</Calendar.Root>
```

## Appearance & Behavior

### Fixed Weeks

You can use the `fixedWeeks` prop to ensure that the calendar renders a fixed number of weeks, regardless of the number of days in the month. This is useful to keep the calendar visually consistent when the number of days in the month changes.

```svelte
<Calendar.Root fixedWeeks>
	<!-- ...-->
</Calendar.Root>
```

### Multiple Months

You can use the `numberOfMonths` prop to render multiple months at once.

```svelte
<Calendar.Root numberOfMonths={2}>
	<!-- ...-->
</Calendar.Root>
```

### Paged Navigation

By default, when the calendar has more than one month, the previous and next buttons will shift the calendar forward or backward by one month. However, you can change this behavior by setting the `pagedNavigation` prop to `true`, which will shift the calendar forward or backward by the number of months being displayed.

```svelte
<Calendar.Root pagedNavigation>
	<!-- ...-->
</Calendar.Root>
```

### Localization

The calendar will automatically format the content of the calendar according to the `locale` prop, which defaults to `'en-US'`, but can be changed to any locale supported by the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API.

```svelte
<Calendar.Root locale="fr-FR">
	<!-- ...-->
</Calendar.Root>
```

### Week Starts On

The calendar will automatically format the content of the calendar according to the `weekStartsOn` prop, which defaults to `0`, but can be changed to any day of the week, where `0` is Sunday and `6` is Saturday.

```svelte
<Calendar.Root weekStartsOn={1}>
	<!-- ...-->
</Calendar.Root>
```

### Multiple Selection

You can set the `type` prop to `'multiple'` to allow users to select multiple dates at once.

```svelte
<Calendar.Root type="multiple">
	<!-- ...-->
</Calendar.Root>
```

## Custom Composition

### Month Selector

The `Calendar` component includes a `PrevButton` and `NextButton` component to allow users to navigate between months. This is useful, but sometimes you may want to allow the user to select a specific month from a list of months, rather than having to navigate one at a time.

To achieve this, you can use the `placeholder` prop to set the month of the the calendar view programmatically.

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { CalendarDate } from "@internationalized/date";

	let placeholder = $state(new CalendarDate(2024, 8, 3));
</script>

<!-- You can use a select, button, or whatever you wish -->
<button
	onclick={() => {
		placeholder = placeholder.set({ month: 8 });
	}}
>
	Set month to August
</button>

<Calendar.Root bind:placeholder>
	<!-- ... -->
</Calendar.Root>
```

Updating the `placeholder` will update the calendar view to reflect the new month.

<APISection {schemas} />
