<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children?: Snippet } = $props();
</script>

<div style:position="relative" style:width="100%">
	<div
		style:height="475px"
		style:width="100%"
		style:position="absolute"
		style:top="0"
		style:left="0"
	>
		{@render children?.()}
	</div>
</div>
