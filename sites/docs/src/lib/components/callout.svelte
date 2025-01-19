<script lang="ts">
	import type { BitsPrimitiveElementAttributes, WithChildren } from "bits-ui";
	import * as Alert from "$lib/components/ui/alert/index.js";
	import { cn } from "$lib/utils/styles.js";

	let {
		children,
		type = "note",
		class: className,
		title = type
			.split("")
			.map((c, i) => (i === 0 ? c.toUpperCase() : c))
			.join(""),
	}: WithChildren<BitsPrimitiveElementAttributes> & {
		type?: "note" | "warning" | "danger" | "tip";
	} = $props();
</script>

<Alert.Root class={cn("mt-6", className)} variant={type}>
	<span class="dot absolute left-5 top-[25px] inline-block h-[10px] w-[10px] rounded-full"></span>

	{#if title}
		<Alert.Title class="mb-2 ml-5 text-[15px] font-semibold">
			{title}
		</Alert.Title>
	{/if}

	<Alert.Description class="leading-relaxed [&>p]:text-[15px] [&>p]:!leading-[140%]">
		{@render children?.()}
	</Alert.Description>
</Alert.Root>
