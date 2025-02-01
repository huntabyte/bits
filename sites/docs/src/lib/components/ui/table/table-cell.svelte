<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLTableCellElement> = $props();
</script>

<td
	class={cn(
		"py-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</td>
