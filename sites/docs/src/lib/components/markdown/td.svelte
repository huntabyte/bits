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
		"border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</td>
