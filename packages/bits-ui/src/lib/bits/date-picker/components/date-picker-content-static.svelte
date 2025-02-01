<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import type { DatePickerContentStaticProps } from "../types.js";
	import PopoverContentStatic from "$lib/bits/popover/components/popover-content-static.svelte";
	import { pickerOpenFocus } from "$lib/internal/date-time/calendar-helpers.svelte.js";

	let {
		ref = $bindable(null),
		onOpenAutoFocus,
		...restProps
	}: DatePickerContentStaticProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	);
</script>

<PopoverContentStatic {...mergedProps} bind:ref {...restProps} />
