<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import type { DatePickerContentProps } from "../types.js";
	import PopoverContent from "$lib/bits/popover/components/popover-content.svelte";
	import { pickerOpenFocus } from "$lib/internal/date-time/calendar-helpers.svelte.js";

	let { ref = $bindable(null), onOpenAutoFocus, ...restProps }: DatePickerContentProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	);
</script>

<PopoverContent {...mergedProps} bind:ref {...restProps} />
