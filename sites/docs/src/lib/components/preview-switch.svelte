<script lang="ts">
	import { Switch } from "bits-ui";
	import { cn } from "$lib/utils/index.js";

	let { class: className, checked = $bindable(false), ...restProps }: Switch.RootProps = $props();
</script>

<Switch.Root
	bind:checked
	class={cn(
		"focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary/60 peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
>
	<Switch.Thumb
		class={cn(
			"pointer-events-none relative inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition-all ease-in-out data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-background data-[state=unchecked]:bg-accent"
		)}
	/>
</Switch.Root>
