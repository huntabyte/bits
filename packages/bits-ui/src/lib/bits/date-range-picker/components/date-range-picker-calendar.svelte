<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DateRangePickerCalendarProps } from "../types.js";
	import { DateRangePickerRootContext } from "../date-range-picker.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { useRangeCalendarRoot } from "$lib/bits/range-calendar/range-calendar.svelte.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: DateRangePickerCalendarProps = $props();

	const dateRangePickerRootState = DateRangePickerRootContext.get();

	const rangeCalendarState = useRangeCalendarRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		calendarLabel: dateRangePickerRootState.props.calendarLabel,
		fixedWeeks: dateRangePickerRootState.props.fixedWeeks,
		isDateDisabled: dateRangePickerRootState.props.isDateDisabled,
		isDateUnavailable: dateRangePickerRootState.props.isDateUnavailable,
		locale: dateRangePickerRootState.props.locale,
		numberOfMonths: dateRangePickerRootState.props.numberOfMonths,
		pagedNavigation: dateRangePickerRootState.props.pagedNavigation,
		preventDeselect: dateRangePickerRootState.props.preventDeselect,
		readonly: dateRangePickerRootState.props.readonly,
		weekStartsOn: dateRangePickerRootState.props.weekStartsOn,
		weekdayFormat: dateRangePickerRootState.props.weekdayFormat,
		disabled: dateRangePickerRootState.props.disabled,
		disableDaysOutsideMonth: dateRangePickerRootState.props.disableDaysOutsideMonth,
		maxValue: dateRangePickerRootState.props.maxValue,
		minValue: dateRangePickerRootState.props.minValue,
		placeholder: dateRangePickerRootState.props.placeholder,
		value: dateRangePickerRootState.props.value,
		onRangeSelect: dateRangePickerRootState.props.onRangeSelect,
		startValue: dateRangePickerRootState.props.startValue,
		endValue: dateRangePickerRootState.props.endValue,
	});

	const mergedProps = $derived(mergeProps(restProps, rangeCalendarState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rangeCalendarState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rangeCalendarState.snippetProps)}
	</div>
{/if}
