<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";
	let { class: className, children, ...restProps }: HTMLAttributes<HTMLElement> = $props();
</script>

<section class={cn("relative", className)} {...restProps}>
	{@render children?.()}
</section>
