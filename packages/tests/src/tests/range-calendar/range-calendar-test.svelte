<script lang="ts" module>
	import { RangeCalendar, type WithoutChildrenOrChild } from "bits-ui";

	export type RangeCalendarTestProps = WithoutChildrenOrChild<RangeCalendar.RootProps>;
</script>

<script lang="ts">
	let { placeholder, value, ...restProps }: RangeCalendarTestProps = $props();
</script>

<main>
	<div data-testid="start-value">{String(value?.start)}</div>
	<div data-testid="end-value">{String(value?.end)}</div>

	<RangeCalendar.Root bind:placeholder bind:value {...restProps} data-testid="calendar">
		{#snippet children({ months, weekdays })}
			<RangeCalendar.Header data-testid="header">
				<RangeCalendar.PrevButton data-testid="prev-button">Prev</RangeCalendar.PrevButton>
				<RangeCalendar.Heading data-testid="heading" />
				<RangeCalendar.NextButton data-testid="next-button">Next</RangeCalendar.NextButton>
			</RangeCalendar.Header>
			<div>
				{#each months as month}
					{@const m = month.value.month}
					<RangeCalendar.Grid data-testid="grid-{m}">
						<RangeCalendar.GridHead data-testid="grid-head-{m}">
							<RangeCalendar.GridRow data-testid="grid-row-{m}">
								{#each weekdays as day, i}
									<RangeCalendar.HeadCell data-testid="weekday-{m}-{i}">
										{day}
									</RangeCalendar.HeadCell>
								{/each}
							</RangeCalendar.GridRow>
						</RangeCalendar.GridHead>
						<RangeCalendar.GridBody data-testid="grid-body-{m}">
							{#each month.weeks as weekDates, i}
								<RangeCalendar.GridRow data-testid="grid-row-{m}-{i}" data-week>
									{#each weekDates as date, d}
										<RangeCalendar.Cell
											{date}
											month={month.value}
											data-testid="cell-{date.month}-{d}"
										>
											<RangeCalendar.Day
												data-testid="date-{date.month}-{date.day}"
											>
												{date.day}
											</RangeCalendar.Day>
										</RangeCalendar.Cell>
									{/each}
								</RangeCalendar.GridRow>
							{/each}
						</RangeCalendar.GridBody>
					</RangeCalendar.Grid>
				{/each}
			</div>
		{/snippet}
	</RangeCalendar.Root>
</main>
