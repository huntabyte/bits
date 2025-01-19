<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLQuoteElement> = $props();
</script>

<blockquote class={cn("mt-6 border-l-2 pl-6 italic", className)} {...restProps}>
	{@render children?.()}
</blockquote>
