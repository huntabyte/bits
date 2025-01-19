<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let value = $state(50);
</script>

<div class="w-full md:max-w-[280px]">
	<Slider.Root
		type="single"
		bind:value
		class="relative flex w-full touch-none select-none items-center"
	>
		{#snippet children()}
			<span
				class="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-dark-10"
			>
				<Slider.Range class="absolute h-full bg-foreground" />
			</span>
			<Slider.Thumb
				index={0}
				class={cn(
					"block size-[25px] cursor-pointer rounded-full border border-border-input bg-background shadow transition-colors hover:border-dark-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-98 disabled:pointer-events-none disabled:opacity-50 dark:bg-foreground dark:shadow-card"
				)}
			/>
		{/snippet}
	</Slider.Root>
</div>
