<script lang="ts">
	import { getLocalTimeZone, today } from "@internationalized/date";
	import type { DateRange } from "bits-ui";
	import RangeCalendarDemo from "$lib/components/demos/range-calendar-demo.svelte";

	let now = $state(today(getLocalTimeZone()));

	let value = $state<DateRange>({
		start: now,
		end: now.add({ days: 6 }),
	});

	$inspect("Value cleared", value);

	function clearDays() {
		value = {
			start: undefined,
			end: undefined,
		};
	}
</script>

<div class="space-y-4 p-3">
	<RangeCalendarDemo bind:value />

	<div class="text-center">
		<button onclick={clearDays}>Clear days</button>
	</div>
</div>
