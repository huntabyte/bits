<script lang="ts">
	import type { Snippet } from "svelte";
	import { useFloatingRootState } from "../use-floating-layer.svelte.js";

	let { children }: { children?: Snippet } = $props();

	useFloatingRootState();
</script>

{@render children?.()}
