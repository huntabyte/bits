<script lang="ts">
	import type { Snippet } from "svelte";
	let { size = "20px", children }: { size?: string; children: Snippet } = $props();
</script>

<div class="blurLogo" style:width={size} style:height={size}>
	<div class="bg" aria-hidden="true">
		{@render children?.()}
	</div>
	<div class="inner">
		{@render children?.()}
	</div>
</div>
