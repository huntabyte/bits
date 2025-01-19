<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLOListElement> = $props();
</script>

<ol class={cn("my-6 ml-6 list-decimal", className)} {...restProps}>
	{@render children?.()}
</ol>
