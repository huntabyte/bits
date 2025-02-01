<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import type { RangeCalendarRootProps } from "../types.js";
	import { useRangeCalendarRoot } from "../range-calendar.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		weekdayFormat = "narrow",
		weekStartsOn = 0,
		pagedNavigation = false,
		isDateDisabled = () => false,
		isDateUnavailable = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		locale = "en",
		calendarLabel = "Event",
		disabled = false,
		readonly = false,
		minValue = undefined,
		maxValue = undefined,
		preventDeselect = false,
		disableDaysOutsideMonth = true,
		onStartValueChange = noop,
		onEndValueChange = noop,
		...restProps
	}: RangeCalendarRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			defaultPlaceholder: undefined,
			defaultValue: value?.start,
		});
		placeholder = defaultPlaceholder;
	}

	if (value === undefined) {
		const defaultValue = { start: undefined, end: undefined };
		value = defaultValue;
	}

	const rootState = useRangeCalendarRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: box.with(
			() => placeholder!,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		disabled: box.with(() => disabled),
		readonly: box.with(() => readonly),
		preventDeselect: box.with(() => preventDeselect),
		minValue: box.with(() => minValue),
		maxValue: box.with(() => maxValue),
		isDateUnavailable: box.with(() => isDateUnavailable),
		isDateDisabled: box.with(() => isDateDisabled),
		pagedNavigation: box.with(() => pagedNavigation),
		weekStartsOn: box.with(() => weekStartsOn),
		weekdayFormat: box.with(() => weekdayFormat),
		numberOfMonths: box.with(() => numberOfMonths),
		locale: box.with(() => locale),
		calendarLabel: box.with(() => calendarLabel),
		fixedWeeks: box.with(() => fixedWeeks),
		disableDaysOutsideMonth: box.with(() => disableDaysOutsideMonth),
		startValue: box.with(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			}
		),
		endValue: box.with(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			}
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
