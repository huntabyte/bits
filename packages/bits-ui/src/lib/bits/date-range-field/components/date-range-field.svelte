<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useDateRangeFieldRoot } from "../date-range-field.svelte.js";
	import type { DateRangeFieldRootProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		disabled = false,
		readonly = false,
		required = false,
		hourCycle,
		granularity,
		locale = "en-US",
		hideTimeZone = false,
		validate = noop,
		onInvalid = noop,
		maxValue,
		minValue,
		readonlySegments = [],
		children,
		child,
		onStartValueChange = noop,
		onEndValueChange = noop,
		errorMessageId,
		...restProps
	}: DateRangeFieldRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value?.start,
		});

		placeholder = defaultPlaceholder;
	}

	if (value === undefined) {
		const defaultValue = { start: undefined, end: undefined };

		value = defaultValue;
	}

	const rootState = useDateRangeFieldRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => disabled),
		readonly: box.with(() => readonly),
		required: box.with(() => required),
		hourCycle: box.with(() => hourCycle),
		granularity: box.with(() => granularity),
		locale: box.with(() => locale),
		hideTimeZone: box.with(() => hideTimeZone),
		validate: box.with(() => validate),
		maxValue: box.with(() => maxValue),
		minValue: box.with(() => minValue),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		readonlySegments: box.with(() => readonlySegments),
		value: box.with(
			() => value as DateRange,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
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
		onInvalid: box.with(() => onInvalid),
		errorMessageId: box.with(() => errorMessageId),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
