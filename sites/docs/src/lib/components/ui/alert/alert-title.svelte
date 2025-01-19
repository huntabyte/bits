<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { WithChildren } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let {
		class: className,
		children,
		...restProps
	}: WithChildren<HTMLAttributes<HTMLHeadingElement>> & {} = $props();
</script>

<h5 class={cn("mb-1 ml-8 font-medium leading-none tracking-tight", className)} {...restProps}>
	{@render children?.()}
</h5>
