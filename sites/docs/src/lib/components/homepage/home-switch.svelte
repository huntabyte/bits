<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { Switch } from "bits-ui";
	import Play from "phosphor-svelte/lib/Play";
	import Pause from "phosphor-svelte/lib/Pause";

	let {
		checked = $bindable(true),
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Switch.Root> = $props();
</script>

<div class="flex items-center space-x-3">
	<Switch.Root
		bind:ref
		bind:checked
		id="play_btn"
		name="play"
		class="peer inline-flex h-9 min-h-9 w-[62px] shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-dark-10 data-[state=unchecked]:shadow-mini-inset dark:shadow-inner  dark:data-[state=checked]:bg-[rgba(0,0,0,0.17)] dark:data-[state=checked]:bg-foreground dark:data-[state=unchecked]:bg-[rgba(0,0,0,0.17)]"
		{...restProps}
	>
		<Switch.Thumb
			class="group pointer-events-none flex size-[30px] shrink-0 items-center justify-center rounded-full bg-background transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:shadow-mini dark:border dark:border-none dark:border-background/30 dark:bg-white dark:shadow-[0px_1.3px_0px_1.3px_rgba(0,0,0,0.04)] dark:data-[state=unchecked]:border"
		>
			<Play
				class="size-4 group-data-[state=checked]:hidden dark:text-[#171717]"
				weight="fill"
				aria-label="Play"
			/>
			<Pause
				class="size-4 group-data-[state=unchecked]:hidden dark:text-[#171717]"
				weight="fill"
				aria-label="Pause"
			/>
		</Switch.Thumb>
	</Switch.Root>
</div>
