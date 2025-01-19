<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useCalendarRoot } from "../calendar.svelte.js";
	import type { CalendarRootProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";

	let {
		child,
		children,
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
		type,
		disableDaysOutsideMonth = true,
		initialFocus = false,
		...restProps
	}: CalendarRootProps = $props();

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			defaultPlaceholder: undefined,
			defaultValue: value,
		});
		placeholder = defaultPlaceholder;
	}

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value = defaultValue as any;
	}

	const rootState = useCalendarRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		weekdayFormat: box.with(() => weekdayFormat),
		weekStartsOn: box.with(() => weekStartsOn),
		pagedNavigation: box.with(() => pagedNavigation),
		isDateDisabled: box.with(() => isDateDisabled),
		isDateUnavailable: box.with(() => isDateUnavailable),
		fixedWeeks: box.with(() => fixedWeeks),
		numberOfMonths: box.with(() => numberOfMonths),
		locale: box.with(() => locale),
		calendarLabel: box.with(() => calendarLabel),
		readonly: box.with(() => readonly),
		disabled: box.with(() => disabled),
		minValue: box.with(() => minValue),
		maxValue: box.with(() => maxValue),
		disableDaysOutsideMonth: box.with(() => disableDaysOutsideMonth),
		initialFocus: box.with(() => initialFocus),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v as DateValue);
			}
		),
		preventDeselect: box.with(() => preventDeselect),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onValueChange(v as any);
			}
		),
		type: box.with(() => type),
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
