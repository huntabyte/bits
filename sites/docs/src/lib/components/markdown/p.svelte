<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p class={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...restProps}>
	{@render children?.()}
</p>
