<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLTableSectionElement> = $props();
</script>

<tfoot class={cn("bg-primary text-primary-foreground font-medium", className)} {...restProps}>
	{@render children?.()}
</tfoot>
