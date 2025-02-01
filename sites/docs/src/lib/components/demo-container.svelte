<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils/index.js";
	type Props = {
		align?: "start" | "center" | "end";
		size?: "xs" | "sm" | "default" | "lg";
		class?: string;
		wrapperClass?: string;
		children: Snippet;
	};

	let {
		align = "center",
		size = "default",
		class: className,
		wrapperClass,
		children,
	}: Props = $props();
</script>

<div
	class={cn(
		"relative rounded-tl-card rounded-tr-card border-2 border-muted bg-zinc-50 !ring-transparent dark:bg-neutral-900/50",
		wrapperClass
	)}
>
	<div
		class={cn(
			"preview flex w-full justify-center p-12",
			{
				"items-center": align === "center",
				"items-start": align === "start",
				"items-end": align === "end",
				"min-h-[443px]": size === "default",
				"min-h-[200px]": size === "xs",
				"min-h-[300px]": size === "sm",
				"min-h-[600px]": size === "lg",
			},
			className
		)}
	>
		{@render children()}
	</div>
</div>
