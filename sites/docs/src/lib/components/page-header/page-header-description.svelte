<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p
	class={cn(
		"mb-11 mt-3 text-balance text-[21px] font-semibold leading-7 tracking-[-0.01em] text-foreground/40",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
