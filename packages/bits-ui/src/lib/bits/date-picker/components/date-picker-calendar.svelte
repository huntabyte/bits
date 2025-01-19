<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DatePickerCalendarProps } from "../types.js";
	import { DatePickerRootContext } from "../date-picker.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { useCalendarRoot } from "$lib/bits/calendar/calendar.svelte.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: DatePickerCalendarProps = $props();

	const datePickerRootState = DatePickerRootContext.get();

	const calendarState = useCalendarRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		calendarLabel: datePickerRootState.props.calendarLabel,
		fixedWeeks: datePickerRootState.props.fixedWeeks,
		isDateDisabled: datePickerRootState.props.isDateDisabled,
		isDateUnavailable: datePickerRootState.props.isDateUnavailable,
		locale: datePickerRootState.props.locale,
		numberOfMonths: datePickerRootState.props.numberOfMonths,
		pagedNavigation: datePickerRootState.props.pagedNavigation,
		preventDeselect: datePickerRootState.props.preventDeselect,
		readonly: datePickerRootState.props.readonly,
		type: box.with(() => "single"),
		weekStartsOn: datePickerRootState.props.weekStartsOn,
		weekdayFormat: datePickerRootState.props.weekdayFormat,
		disabled: datePickerRootState.props.disabled,
		disableDaysOutsideMonth: datePickerRootState.props.disableDaysOutsideMonth,
		maxValue: datePickerRootState.props.maxValue,
		minValue: datePickerRootState.props.minValue,
		placeholder: datePickerRootState.props.placeholder,
		value: datePickerRootState.props.value,
		onDateSelect: datePickerRootState.props.onDateSelect,
		initialFocus: datePickerRootState.props.initialFocus,
	});

	const mergedProps = $derived(mergeProps(restProps, calendarState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...calendarState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(calendarState.snippetProps)}
	</div>
{/if}
