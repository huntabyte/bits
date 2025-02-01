<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";
	let { class: className, children, ...restProps }: HTMLAttributes<HTMLLIElement> = $props();
</script>

<li class={cn("mt-2.5 leading-7 first:mt-2", className)} {...restProps}>
	{@render children?.()}
</li>
