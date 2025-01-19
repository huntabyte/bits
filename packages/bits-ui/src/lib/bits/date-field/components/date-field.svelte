<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useDateFieldRoot } from "../date-field.svelte.js";
	import type { DateFieldRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";

	let {
		disabled = false,
		granularity,
		hideTimeZone = false,
		hourCycle,
		locale = "en",
		maxValue,
		minValue,
		onPlaceholderChange = noop,
		onValueChange = noop,
		validate = noop,
		onInvalid = noop,
		placeholder = $bindable(),
		value = $bindable(),
		readonly = false,
		readonlySegments = [],
		required = false,
		errorMessageId,
		children,
	}: DateFieldRootProps = $props();

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value,
		});

		placeholder = defaultPlaceholder;
	}

	useDateFieldRoot({
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
				onPlaceholderChange(v);
			}
		),
		disabled: box.with(() => disabled),
		granularity: box.with(() => granularity),
		hideTimeZone: box.with(() => hideTimeZone),
		hourCycle: box.with(() => hourCycle),
		locale: box.with(() => locale),
		maxValue: box.with(() => maxValue),
		minValue: box.with(() => minValue),
		validate: box.with(() => validate),
		readonly: box.with(() => readonly),
		readonlySegments: box.with(() => readonlySegments),
		required: box.with(() => required),
		onInvalid: box.with(() => onInvalid),
		errorMessageId: box.with(() => errorMessageId),
		isInvalidProp: box.with(() => undefined),
	});
</script>

{@render children?.()}
