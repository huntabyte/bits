---
title: Range Calendar
description: Presents a calendar view tailored for selecting date ranges.
---

<script>
	import { APISection, ComponentPreviewV2, RangeCalendarDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="range-calendar-demo" comp="Range Calendar">

{#snippet preview()}
<RangeCalendarDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Structure

```svelte
<script lang="ts">
	import { RangeCalendar } from "bits-ui";
</script>

<RangeCalendar.Root>
	{#snippet children({ months, weekdays })}
		<RangeCalendar.Header>
			<RangeCalendar.PrevButton />
			<RangeCalendar.Heading />
			<RangeCalendar.NextButton />
		</RangeCalendar.Header>
		{#each months as month}
			<RangeCalendar.Grid>
				<RangeCalendar.GridHead>
					<RangeCalendar.GridRow>
						{#each weekdays as day}
							<RangeCalendar.HeadCell>
								{day}
							</RangeCalendar.HeadCell>
						{/each}
					</RangeCalendar.GridRow>
				</RangeCalendar.GridHead>
				<RangeCalendar.GridBody>
					{#each month.weeks as weekDates}
						<RangeCalendar.GridRow>
							{#each weekDates as date}
								<RangeCalendar.Cell {date} month={month.value}>
									<RangeCalendar.Day />
								</RangeCalendar.Cell>
							{/each}
						</RangeCalendar.GridRow>
					{/each}
				</RangeCalendar.GridBody>
			</RangeCalendar.Grid>
		{/each}
	{/snippet}
</RangeCalendar.Root>
```

<APISection {schemas} />
