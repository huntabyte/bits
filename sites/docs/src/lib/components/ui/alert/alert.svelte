<script lang="ts">
	import type { BitsPrimitiveDivAttributes, WithChildren } from "bits-ui";
	import { type Variant, alertVariants } from "./index.js";
	import { cn } from "$lib/utils/styles.js";

	let {
		variant = "note",
		class: className,
		children,
		...restProps
	}: WithChildren<BitsPrimitiveDivAttributes> & {
		variant?: Variant;
	} = $props();
</script>

<div class={cn(alertVariants({ variant }), className)} {...restProps} role="alert">
	{@render children?.()}
</div>
