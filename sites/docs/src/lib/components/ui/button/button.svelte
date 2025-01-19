<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { type Size, type Variant, buttonVariants } from "./index.js";
	import { cn } from "$lib/utils/index.js";

	let {
		class: className,
		variant = "default",
		size = "default",
		children,
		...restProps
	}: HTMLButtonAttributes & { variant?: Variant; size?: Size } = $props();
</script>

<button class={cn(buttonVariants({ variant, size }), className)} {...restProps}>
	{@render children?.()}
</button>
