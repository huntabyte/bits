---
title: Dates and Times
description: How to work with the various date and time components in Bits UI.
---

The date and time components in Bits UI are built on top of the [`@internationalized/date`](https://react-spectrum.adobe.com/internationalized/date/index.html) package, which provides a unified API for working with dates and times in different locales and time zones. It's heavily inspired by the [Temporal](https://tc39.es/proposal-temporal/) proposal, and intends to back the objects in this package with the Temporal API once it's available.

You can install the package using your favorite package manager:

```bash
npm install @internationalized/date
```

It's highly recommended to familiarize yourself with the package's documentation before diving into the components. We'll cover the basics of how we use the package in Bits UI in the sections below, but their documentation provides much more detail on the various formats and how to work with them.

## DateValue

We use the `DateValue` objects provided by `@internationalized/date` to represent dates and times in a consistent way. These objects are immutable and provide information about the type of date they represent. The `DateValue` is a union of the following three types:

-   `CalendarDate` - Represents a date with no time component, such as `2024-07-10`
-   `CalendarDateTime` - Represents a date and time, such as `2024-07-10T12:30:00`
-   `ZonedDateTime` - Represents a date and time with a time zone, such as `2023-10-11T21:00:00:00-04:00[America/New_York]`

The benefit of using these objects is that they allow you to be very specific about the type of date you want, and the component will adapt to that type. For example, if you pass a `CalendarDate` object to a `DateField` component, it will only display the date portion of the date, without the time. See the [Date Field](/docs/components/date-field) component for more information.

### CalendarDate

The `CalendarDate` object represents a date with no time component, such as `2024-07-10`.

You can use the `CalendarDate` constructor to create a new `CalendarDate` object:

```ts
import { CalendarDate } from "@internationalized/date";

const date = new CalendarDate(2024, 7, 10);
```

You can also use the `parseDate` function to parse an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string into a `CalendarDate` object:

```ts
import { parseDate } from "@internationalized/date";

const date = parseDate("2024-07-10");
```

If you want to create a `CalendarDate` with the current date, you can use the `today` function. This function requires a timezone identifier as an argument, which can be passed in as a string, or by using `getLocalTimeZone` which returns the user's current time zone:

```ts
import { today, getLocalTimeZone } from "@internationalized/date";

const losAngelesToday = today("America/Los_Angeles");
const localToday = today(getLocalTimeZone());
```

See the [CalendarDate API documentation](https://react-spectrum.adobe.com/internationalized/date/CalendarDate.html) for more information.

### CalendarDateTime

The `CalendarDateTime` object represents a date and time, such as `2024-07-10T12:30:00`.

You can use the `CalendarDateTime` constructor to create a new `CalendarDateTime` object:

```ts
import { CalendarDateTime } from "@internationalized/date";

const dateTime = new CalendarDateTime(2024, 7, 10, 12, 30, 0);
```

You can also use the `parseDateTime` function to parse an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string into a `CalendarDateTime` object:

```ts
import { parseDateTime } from "@internationalized/date";

const dateTime = parseDateTime("2024-07-10T12:30:00");
```

See the [CalendarDateTime API documentation](https://react-spectrum.adobe.com/internationalized/date/CalendarDateTime.html) for more information.

### ZonedDateTime

The `ZonedDateTime` object represents a date and time with a time zone, which represents an exact date and time in a specific time zone. `ZonedDateTimes` are often used for things such as in person events (concerts, conferences, etc.), where you want to represent a date and time in a _specific_ time zone, rather than a specific date and time in the user's _local_ time zone.

You can use the `ZonedDateTime` constructor to create a new `ZonedDateTime` object:

```ts
import { ZonedDateTime } from "@internationalized/date";

const date = new ZonedDateTime(
	// Date
	2022,
	2,
	3,
	// Time zone and UTC offset
	"America/Los_Angeles",
	-28800000,
	// Time
	9,
	15,
	0
);
```

You can also use one of the following parsing functions to parse an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string into a `ZonedDateTime` object:

```ts
import { parseZonedDateTime, parseAbsolute, parseAbsoluteToLocal } from "@internationalized/date";

const date = parseZonedDateTime("2024-07-12T00:45[America/New_York]");
// or
const date = parseAbsolute("2024-07-12T07:45:00Z", "America/New_York");
// or
const date = parseAbsoluteToLocal("2024-07-12T07:45:00Z");
```

See the [ZonedDateTime API documentation](https://react-spectrum.adobe.com/internationalized/date/ZonedDateTime.html) for more information.

## Date Ranges

Bits UI also provides a `DateRange` type with the following structure:

```ts
type DateRange = {
	start: DateValue;
	end: DateValue;
};
```

This type is used to represent the value of the various date range components in Bits UI, such as the [Date Range Field](/docs/components/date-range-field), [Date Range Picker](/docs/components/date-range-picker), and [Range Calendar](/docs/components/range-calendar).

## Placeholder

Each of the date/time components in Bits UI has a _bindable_ `placeholder` prop, which acts as the starting point for the component when no value is present. The placeholder value is used to determine the type of date/time to display, and the component and its value will adapt to that type.

For example, if you pass a `CalendarDate` object to a `DateField` component, it will only display the date portion of the date, without the time. If you pass a `CalendarDateTime` object, it will display the date and time. If you pass a `ZonedDateTime` object, it will display the date and time with the time zone information.

In addition to setting the starting point and type of the date/time, the placeholder is also used to control the view of the calendar. For example, if you wanted to give the user the ability to select a specific month to jump to in the calendar, you could simply update the placeholder to a `DateValue` representing that month. Here's an example of how you might do that:

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
	import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";

	let placeholder: DateValue = $state(today(getLocalTimeZone()));
	let selectedMonth: number = $state(placeholder.month);
</script>

<select
	onchange={() => {
		placeholder = placeholder.set({ month: selectedMonth });
	}}
	bind:value={selectedMonth}
>
	<option value={1}>January</option>
	<option value={2}>February</option>
	<!-- ... rest of month options -->
</select>

<Calendar.Root bind:placeholder>
	<!-- ... rest of calendar component -->
</Calendar.Root>
```

In the example above, we're using the `placeholder` value to control the view of the calendar. The user can select a specific month to jump to in the calendar, and the placeholder will be updated to reflect the selected month. When the placeholder is updated, the calendar view will automatically update to reflect that new month.

As the user interacts with the calendar, the placeholder will be updated to reflect the currently focused date in the calendar. If a value is selected in the calendar, the placeholder will be updated to reflect that selected value.

### Updating the placeholder

It's important to note that `DateValue` objects are immutable, so you can't directly update the `placeholder` value. Instead, you'll need to reassign the value to the `placeholder` prop for the changes to reflect.

`@internationalized/date` provides a number of methods for updating the `DateValue` objects, such as `set`, `add`, `subtract`, and `cycle`, each of which will return a new `DateValue` object with the updated value.

For example, if you wanted to update the placeholder to the next month, you could use the `add` method to add one month to the current month in the `placeholder` value:

```ts
let placeholder = new CalendarDate(2024, 07, 10);
console.log(placeholder.add({ months: 1 })); // 2024-08-10
console.log(placeholder); // 2024-07-10 (unchanged)
placeholder = placeholder.add({ months: 1 });
console.log(placeholder); // 2024-08-10 (updated)
```

## Formatting Dates

`@internationalized/date` provides a [`DateFormatter`](https://react-spectrum.adobe.com/internationalized/date/DateFormatter.html) class that is a wrapper around the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API that fixes various browser bugs, and polyfills new features.

It's highly recommended to use this class to format dates and times in your application, as it will ensure that the formatting is accurate for all locales, time zones, and calendars.

## Parsing Dates

Often, you'll want to parse a string from a database or other source into a `DateValue` object for use with the date/time components in Bits UI. `@internationalized/date` provides various parsing functions that can be used to parse strings into each of the supported `DateValue` objects.

### parseDate

The `parseDate` function is used to parse a string into a `CalendarDate` object.
