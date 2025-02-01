<script lang="ts" module>
	import { Slider, type SliderMultipleRootProps } from "bits-ui";

	export type SliderMultiRangeTestProps = Omit<SliderMultipleRootProps, "type">;
</script>

<script lang="ts">
	let { value = [20, 80], ...restProps }: SliderMultiRangeTestProps = $props();
</script>

<main>
	<Slider.Root type="multiple" data-testid="root" bind:value {...restProps}>
		{#snippet children({ thumbs, ticks })}
			<span class="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full">
				<Slider.Range data-testid="range" class="bg-primary absolute h-full" />
			</span>
			{#each thumbs as thumb, i}
				<Slider.Thumb
					index={thumb}
					aria-label="Volume"
					data-testid="thumb-{i}"
					class="border-primary/50 focus-visible:ring-ring block h-4 w-4 rounded-full border bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
				/>
			{/each}

			{#each ticks as tick}
				<Slider.Tick data-testid="tick" index={tick} />
			{/each}
		{/snippet}
	</Slider.Root>
</main>
