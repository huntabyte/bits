<script lang="ts" module>
	import { Calendar, type CalendarMultipleRootProps } from "bits-ui";

	export type CalendarMultiTestProps = CalendarMultipleRootProps;
</script>

<script lang="ts">
	let {
		placeholder,
		value,
		type: _type = "multiple",
		...restProps
	}: CalendarMultiTestProps = $props();
</script>

<main>
	<div data-testid="value">{value}</div>
	<Calendar.Root
		type="multiple"
		bind:placeholder
		bind:value
		{...restProps}
		data-testid="calendar"
	>
		{#snippet children({ months, weekdays })}
			<Calendar.Header data-testid="header">
				<Calendar.PrevButton data-testid="prev-button">Prev</Calendar.PrevButton>
				<Calendar.Heading data-testid="heading" />
				<Calendar.NextButton data-testid="next-button">Next</Calendar.NextButton>
			</Calendar.Header>
			<div>
				{#each months as month}
					{@const m = month.value.month}
					<Calendar.Grid data-testid="grid-{m}">
						<Calendar.GridHead data-testid="grid-head-{m}">
							<Calendar.GridRow data-testid="grid-row-{m}">
								{#each weekdays as day, i}
									<Calendar.HeadCell data-testid="weekday-{m}-{i}">
										{day}
									</Calendar.HeadCell>
								{/each}
							</Calendar.GridRow>
						</Calendar.GridHead>
						<Calendar.GridBody data-testid="grid-body-{m}">
							{#each month.weeks as weekDates, i}
								<Calendar.GridRow data-testid="grid-row-{m}-{i}" data-week>
									{#each weekDates as date, d}
										<Calendar.Cell
											{date}
											month={month.value}
											data-testid="cell-{date.month}-{d}"
										>
											<Calendar.Day
												data-testid="date-{date.month}-{date.day}"
											>
												{date.day}
											</Calendar.Day>
										</Calendar.Cell>
									{/each}
								</Calendar.GridRow>
							{/each}
						</Calendar.GridBody>
					</Calendar.Grid>
				{/each}
			</div>
		{/snippet}
	</Calendar.Root>
</main>
