<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useDateRangePickerRoot } from "../date-range-picker.svelte.js";
	import type { DateRangePickerRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { usePopoverRoot } from "$lib/bits/popover/popover.svelte.js";
	import { useDateRangeFieldRoot } from "$lib/bits/date-range-field/date-range-field.svelte.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		value = $bindable(),
		id = useId(),
		ref = $bindable(null),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		isDateUnavailable = () => false,
		onInvalid = noop,
		minValue,
		maxValue,
		disabled = false,
		readonly = false,
		granularity,
		readonlySegments = [],
		hourCycle,
		locale = "en",
		hideTimeZone = false,
		required = false,
		calendarLabel = "Event",
		disableDaysOutsideMonth = true,
		preventDeselect = false,
		pagedNavigation = false,
		weekStartsOn = 0,
		weekdayFormat = "narrow",
		isDateDisabled = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		closeOnRangeSelect = true,
		onStartValueChange = noop,
		onEndValueChange = noop,
		validate = noop,
		errorMessageId,
		child,
		children,
		...restProps
	}: DateRangePickerRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	if (value === undefined) {
		value = { start: undefined, end: undefined };
	}

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value?.start,
		});

		placeholder = defaultPlaceholder;
	}

	function onRangeSelect() {
		if (closeOnRangeSelect) {
			open = false;
		}
	}

	const pickerRootState = useDateRangePickerRoot({
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		value: box.with(
			() => value as DateRange,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v as DateValue);
			}
		),
		isDateUnavailable: box.with(() => isDateUnavailable),
		minValue: box.with(() => minValue),
		maxValue: box.with(() => maxValue),
		disabled: box.with(() => disabled),
		readonly: box.with(() => readonly),
		granularity: box.with(() => granularity),
		readonlySegments: box.with(() => readonlySegments),
		hourCycle: box.with(() => hourCycle),
		locale: box.with(() => locale),
		hideTimeZone: box.with(() => hideTimeZone),
		required: box.with(() => required),
		calendarLabel: box.with(() => calendarLabel),
		disableDaysOutsideMonth: box.with(() => disableDaysOutsideMonth),
		preventDeselect: box.with(() => preventDeselect),
		pagedNavigation: box.with(() => pagedNavigation),
		weekStartsOn: box.with(() => weekStartsOn),
		weekdayFormat: box.with(() => weekdayFormat),
		isDateDisabled: box.with(() => isDateDisabled),
		fixedWeeks: box.with(() => fixedWeeks),
		numberOfMonths: box.with(() => numberOfMonths),
		onRangeSelect: box.with(() => onRangeSelect),
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

	usePopoverRoot({
		open: pickerRootState.props.open,
	});

	const fieldRootState = useDateRangeFieldRoot({
		value: pickerRootState.props.value,
		disabled: pickerRootState.props.disabled,
		readonly: pickerRootState.props.readonly,
		readonlySegments: pickerRootState.props.readonlySegments,
		validate: box.with(() => validate),
		minValue: pickerRootState.props.minValue,
		maxValue: pickerRootState.props.maxValue,
		granularity: pickerRootState.props.granularity,
		hideTimeZone: pickerRootState.props.hideTimeZone,
		hourCycle: pickerRootState.props.hourCycle,
		locale: pickerRootState.props.locale,
		required: pickerRootState.props.required,
		placeholder: pickerRootState.props.placeholder,
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		startValue: pickerRootState.props.startValue,
		endValue: pickerRootState.props.endValue,
		onInvalid: box.with(() => onInvalid),
		errorMessageId: box.with(() => errorMessageId),
	});

	const mergedProps = $derived(mergeProps(restProps, fieldRootState.props));
</script>

<FloatingLayer>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayer>
