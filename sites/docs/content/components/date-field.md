---
title: Date Field
description: Enables users to input specific dates within a designated field.
---

<script>
	import { CalendarDateTime, CalendarDate, now, getLocalTimeZone, parseDate, today } from "@internationalized/date";
	import { APISection, ComponentPreviewV2, DateFieldDemo, DateFieldDemoCustom, DemoContainer, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-field-demo" comp="Date Field">

{#snippet preview()}
<DateFieldDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Overview

The `DateField` component is an alternative to the native `<input type="date">` element. It provides a more flexible and customizable way to select dates within a designated field.

## Structure

```svelte
<script lang="ts">
	import { DateField } from "$lib";
</script>

<DateField.Root>
	<DateField.Label>Check-in date</DateField.Label>
	<DateField.Input>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				<DateField.Segment {part}>
					{value}
				</DateField.Segment>
			{/each}
		{/snippet}
	</DateField.Input>
</DateField.Root>
```

## Reusable Components

It's recommended to use the `DateField` primitives to build your own custom date field component that can be used throughout your application.

The following example shows how you might create a reusable `MyDateField` component that can be used throughout your application. For style inspiration, reference the featured demo at the top of this page.

```svelte title="MyDateField.svelte"
<script lang="ts">
	import { DateField, type WithoutChildrenOrChild } from "bits-ui";

	type Props = WithoutChildrenOrChild<DateField.RootProps> & {
		labelText: string;
	};

	let { value, placeholder, name, ...restProps }: Props = $props();
</script>

<DateField.Root bind:value bind:placeholder {name} {...restProps}>
	<DateField.Label>{labelText}</DateField.Label>
	<DateField.Input>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				<DateField.Segment {part}>
					{value}
				</DateField.Segment>
			{/each}
		{/snippet}
	</DateField.Input>
</DateField.Root>
```

<ComponentPreviewV2 size="xs" fileName="MyDateField.svelte" containerClass="mt-4" name="date-field-demo-custom" comp="DateField">

{#snippet preview()}
<DateFieldDemoCustom labelText="Select a date" />
{/snippet}

</ComponentPreviewV2>

We'll be using this newly created `MyDateField` component in the following demos and examples to prevent repeating the same code, so be sure to reference it as you go through the documentation.

## Segments

A segment of the `DateField` represents a not only a specific part of the date, such as the day, month, year, hour, but can also reference a `"literal"` which is typically a separator between the different parts of the date, and varies based on the `locale`.

Notice that in the `MyDateField` component we created, we're styling the `DateField.Segment` components differently based on whether they are a `"literal"` or not.

## Placeholder

The `placeholder` prop for the `DateField.Root` component isn't what is displayed when the field is empty, but rather what date our field should start with when the user attempts to cycle through the segments. The placeholder can also be used to set a granularity for the date field, which will determine which type of `DateValue` object is used for the `value`.

By default, the `placeholder` will be set to the current date, and be of type `CalendarDate`. However, if we wanted this date field to also allow for selecting a time, we could set the placeholder to a `CalendarDateTime` object.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { CalendarDateTime } from "@internationalized/date";
</script>

<MyDateField placeholder={new CalendarDateTime(2024, 8, 3, 12, 30)} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom placeholder={new CalendarDateTime(2024, 8, 3, 12, 30)} />
</DemoContainer>

If we're collecting a date from the user where we want the timezone as well, we can use a `ZonedDateTime` object instead.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { now, getLocalTimeZone } from "@internationalized/date";
</script>

<MyDateField placeholder={now("America/New_York")} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom placeholder={now("America/New_York")} />
</DemoContainer>

<Callout type="warning" title="Leap Years!">

If you're creating a date field for something like a birthday, ensure your placeholder is set in a leap year to ensure users born on a leap year will be able to select the correct date.

</Callout>

## Managing Placeholder State

Bits UI offers several approaches to manage and synchronize the component's placeholder state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:placeholder` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { DateField } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myPlaceholder = new CalendarDate(2024, 8, 3))}>
	Set placeholder to August 3rd, 2024
</button>

<DateField.Root bind:placeholder={myPlaceholder}>
	<!-- ... -->
</DateField.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myPlaceholder` when the internal state changes
-   Allows external control (e.g., changing the placeholder via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onPlaceholderChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { DateField } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateField.Root
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => {
		placeholder = p;
	}}
>
	<!-- ... -->
</DateField.Root>
```

#### Use Cases

-   Implementing custom behaviors on placeholder change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DateField } from "bits-ui";
	let myPlaceholder = $state();
</script>

<DateField.Root
	bind:placeholder={() => myPlaceholder, (newPlaceholder) => (myPlaceholder = newPlaceholder)}
>
	<!-- ... -->
</DateField.Root>
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
	import { DateField } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myValue = myValue.add({ days: 1 }))}> Add 1 day </button>
<DateField.Root bind:value={myValue}>
	<!-- ... -->
</DateField.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes
-   Allows external control (e.g., changing the value via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { DateField } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateField.Root
	value={myValue}
	onValueChange={(v) => {
		value = v.set({ hour: v.hour + 1 });
	}}
>
	<!-- ... -->
</DateField.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { DateField } from "bits-ui";
	let myValue = $state();
</script>

<DateField.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</DateField.Root>
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

Often, you'll want to start the `DateField.Root` component with a default value. Likely this value will come from a database in the format of an ISO 8601 string. You can use the `parseDate` function from the `@internationalized/date` package to parse the string into a `CalendarDate` object.

```svelte title="+page.svelte"
<script lang="ts">
	import { DateField } from "bits-ui";
	import { parseDate } from "@internationalized/date";

	// this came from a database/API call
	const date = "2024-08-03";

	let value = $state(parseDate(date));
</script>

<DateField.Root {value}>
	<!-- ... -->
</DateField.Root>
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom value={parseDate("2024-08-03")} />
</DemoContainer>

Now our input is populated with the default value. In addition to the `parseDate` function, you can also use `parseDateTime` or `parseZonedDateTime` to parse the string into a `CalendarDateTime` or `ZonedDateTime` object respectively.

## Validation

### Minimum Value

You can set a minimum value for the `DateField.Root` component by using the `minValue` prop. If a user selects a date that is less than the minimum value, the date field will be marked as invalid.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { today, getLocalTimeZone } from "@internationalized/date";

	const todayDate = today(getLocalTimeZone());
	const yesterday = todayDate.subtract({ days: 1 });
</script>

<MyDateField minValue={todayDate} value={yesterday} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom minValue={today(getLocalTimeZone())} value={today(getLocalTimeZone()).subtract({ days: 1 })} />
</DemoContainer>

In the example above, we're setting the minimum value to today, and the default value to yesterday. This causes the date field to be marked as invalid, and we can style it accordingly. If you adjust the date to be greater than the minimum value, the invalid state will be cleared.

### Maximum Value

You can set a maximum value for the `DateField.Root` component by using the `maxValue` prop. If a user selects a date that is greater than the maximum value, the date field will be marked as invalid.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { today, getLocalTimeZone } from "@internationalized/date";

	const todayDate = today(getLocalTimeZone());
	const tomorrow = todayDate.add({ days: 1 });
</script>

<MyDateField maxValue={todayDate} value={tomorrow} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom maxValue={today(getLocalTimeZone())} value={today(getLocalTimeZone()).add({ days: 1 })} />
</DemoContainer>

In the example above, we're setting the maximum value to today, and the default value to tomorrow. This causes the date field to be marked as invalid, and we can style it accordingly. If you adjust the date to be less than the maximum value, the invalid state will be cleared.

### Custom Validation

You can use the `validate` prop to provide a custom validation function for the date field. This function should return a string or array of strings as validation errors if the date is invalid, or undefined/nothing if the date is valid.

The strings are then passed to the `onInvalid` callback, which you can use to display an error message to the user.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { CalendarDate, type DateValue } from "@internationalized/date";

	const value = new CalendarDate(2024, 8, 2);

	function validate(date: DateValue) {
		return date.day === 1 ? "Date cannot be the first day of the month" : undefined;
	}

	function onInvalid(reason: "min" | "max" | "custom", msg?: string | string[]) {
		if (reason === "custom") {
			if (typeof msg === "string") {
				// do something with the error message
				console.log(msg);
				return;
			} else if (Array.isArray(msg)) {
				// do something with the error messages
				console.log(msg);
				return;
			}
			console.log("The date is invalid");
		} else if (reason === "min") {
			// let the user know that the date is too early.
			console.log("The date is too early.");
		} else if (reason === "max") {
			// let the user know that the date is too late.
			console.log("The date is too late.");
		}
	}
</script>

<MyDateField {validate} {value} {onInvalid} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom validate={(date) => date.day === 1 ? "Date cannot be the first day of the month" : undefined} value={new CalendarDate(2024, 8, 2)} onInvalid={(reason, msg) => {
		if (reason === "custom") {
			if (typeof msg === "string") {
				// do something with the error message
				console.log(msg);
				return;
			} else if (Array.isArray(msg)) {
				// do something with the error messages
				console.log(msg);
				return;
			}
			console.log("The date is invalid");
		} else if (reason === "min") {
			// let the user know that the date is too early.
			console.log("The date is too early.");
		} else if (reason === "max") {
			// let the user know that the date is too late.
			console.log("The date is too late.");
		}
	}} />
</DemoContainer>

In the example above, we're setting the `isDateUnavailable` prop to a function that returns `true` for the first day of the month. Try selecting a date that is the first day of the month to see the date field marked as invalid.

## Granularity

The `granularity` prop sets the granularity of the date field, which determines which segments are rendered in the date field. The `granularity` can be set to either `'day'`, `'hour'`, `'minute'`, or `'second'`.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { CalendarDateTime } from "@internationalized/date";

	const value = new CalendarDateTime(2024, 8, 2, 12, 30);
</script>

<MyDateField granularity="second" {value} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom granularity="second" value={new CalendarDateTime(2024, 8, 2, 12, 30)} />
</DemoContainer>

In the example above, we're setting the granularity to `'second'`, which means that the date field will include an additional segment for the seconds.

## Localization

You can use the `locale` prop to set the locale of the date field. This will affect the formatting of the date field's segments and placeholders.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
</script>

<MyDateField locale="de" />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom locale="de" />
</DemoContainer>

<APISection {schemas} />
