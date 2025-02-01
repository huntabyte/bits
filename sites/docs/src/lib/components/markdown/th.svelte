<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLTableCellElement> = $props();
</script>

<th
	class={cn(
		"border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
