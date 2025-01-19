<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul class={cn("my-4 ml-6 list-disc", className)} {...restProps}>
	{@render children?.()}
</ul>
