<script lang="ts">
	import DemoContainer from "../demo-container.svelte";
	import TooltipDemoCustom from "./tooltip-demo-custom.svelte";

	const durations = [200, 1000, 2500];
</script>

<DemoContainer size="sm" wrapperClass="rounded-bl-card rounded-br-card">
	<div class="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
		{#each durations as duration (duration)}
			<div class="flex flex-col items-center gap-3">
				<TooltipDemoCustom delayDuration={duration} />
				<pre>delayDuration={duration}</pre>
			</div>
		{/each}
	</div>
</DemoContainer>
