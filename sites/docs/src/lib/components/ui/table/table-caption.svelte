<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLElement> = $props();
</script>

<caption class={cn("mt-4 text-sm text-muted-foreground", className)} {...restProps}>
	{@render children?.()}
</caption>
