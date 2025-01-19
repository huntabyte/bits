<script lang="ts" module>
	import { Slider, type SliderMultipleRootProps } from "bits-ui";

	export type SliderMultiTestProps = Omit<SliderMultipleRootProps, "type"> & {
		resetMin?: number;
		resetMax?: number;
		resetStep?: number;
	};
</script>

<script lang="ts">
	let {
		value = [30],
		min = 0,
		max = 100,
		step = 1,
		resetMin,
		resetMax,
		resetStep,
		...restProps
	}: SliderMultiTestProps = $props();

	$effect(() => {
		if (resetMin !== undefined) {
			min = resetMin;
		}
	});

	$effect(() => {
		if (resetMax !== undefined) [(max = resetMax)];
	});

	$effect(() => {
		if (resetStep !== undefined) {
			step = resetStep;
		}
	});
</script>

<main>
	<Slider.Root type="multiple" data-testid="root" bind:value {...restProps} {min} {max} {step}>
		{#snippet children({ thumbs, ticks })}
			<span class="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full">
				<Slider.Range data-testid="range" class="bg-primary absolute h-full" />
			</span>
			{#each thumbs as thumb}
				<Slider.Thumb
					index={thumb}
					aria-label="age"
					data-testid="thumb"
					class="border-primary/50 focus-visible:ring-ring block h-4 w-4 rounded-full border bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
				/>
			{/each}

			{#each ticks as tick}
				<Slider.Tick data-testid="tick" index={tick} />
			{/each}
		{/snippet}
	</Slider.Root>
</main>
