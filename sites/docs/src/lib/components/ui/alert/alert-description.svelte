<script lang="ts">
	import type { BitsPrimitiveElementAttributes, WithChildren } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let {
		class: className,
		children,
		...restProps
	}: WithChildren<BitsPrimitiveElementAttributes> = $props();
</script>

<div class={cn("[&_p]:leading-relaxed", className)} {...restProps}>
	{@render children?.()}
</div>
