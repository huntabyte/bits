<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let { value = $bindable([5]) }: { value: number[] } = $props();
</script>

<div class="w-full">
	<Slider.Root
		{value}
		onValueCommit={(v) => {
			value = v;
		}}
		class="relative flex w-full touch-none select-none items-center rounded-full shadow-mini-inset dark:bg-[#F4F4F51A] dark:shadow-[0px_0.7px_0px_0px_rgba(0,_0,_0,_0.04)_inset]"
	>
		{#snippet children({ thumbs })}
			<span class="relative h-2 w-full grow overflow-hidden rounded-full bg-dark/10">
				<Slider.Range class="absolute h-full bg-dark dark:bg-[#18181B]" />
			</span>
			{#each thumbs as index}
				<Slider.Thumb
					{index}
					class={cn(
						"block size-[25px] cursor-pointer rounded-full bg-background shadow-mini transition-colors hover:border-dark-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-98 disabled:pointer-events-none disabled:opacity-50 dark:bg-foreground dark:shadow-[0px_0.7px_0px_0.7px_rgba(0,_0,_0,_0.04);]"
					)}
				/>
			{/each}
		{/snippet}
	</Slider.Root>
</div>
