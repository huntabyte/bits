<script lang="ts">
	// Date Picker composes the DateField, Popover, and Calendar components
	import { box } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useDatePickerRoot } from "../date-picker.svelte.js";
	import type { DatePickerRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { usePopoverRoot } from "$lib/bits/popover/popover.svelte.js";
	import { useDateFieldRoot } from "$lib/bits/date-field/date-field.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		isDateUnavailable = () => false,
		validate = noop,
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
		closeOnDateSelect = true,
		initialFocus = false,
		errorMessageId,
		children,
	}: DatePickerRootProps = $props();

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value,
		});

		placeholder = defaultPlaceholder;
	}

	function onDateSelect() {
		if (closeOnDateSelect) {
			open = false;
		}
	}

	const pickerRootState = useDatePickerRoot({
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		value: box.with(
			() => value,
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
		initialFocus: box.with(() => initialFocus),
		onDateSelect: box.with(() => onDateSelect),
	});

	usePopoverRoot({
		open: pickerRootState.props.open,
	});

	useDateFieldRoot({
		value: pickerRootState.props.value,
		disabled: pickerRootState.props.disabled,
		readonly: pickerRootState.props.readonly,
		readonlySegments: pickerRootState.props.readonlySegments,
		validate: box.with(() => validate),
		onInvalid: box.with(() => onInvalid),
		minValue: pickerRootState.props.minValue,
		maxValue: pickerRootState.props.maxValue,
		granularity: pickerRootState.props.granularity,
		hideTimeZone: pickerRootState.props.hideTimeZone,
		hourCycle: pickerRootState.props.hourCycle,
		locale: pickerRootState.props.locale,
		required: pickerRootState.props.required,
		placeholder: pickerRootState.props.placeholder,
		errorMessageId: box.with(() => errorMessageId),
		isInvalidProp: box.with(() => undefined),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
