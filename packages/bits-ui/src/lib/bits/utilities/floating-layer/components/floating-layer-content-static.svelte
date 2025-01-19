<script lang="ts">
	import { type Snippet, onMount } from "svelte";

	let {
		content,
		onPlaced,
	}: {
		content?: Snippet<
			[{ props: Record<string, unknown>; wrapperProps: Record<string, unknown> }]
		>;
		onPlaced?: () => void;
	} = $props();

	onMount(() => {
		onPlaced?.();
	});
</script>

{@render content?.({ props: {}, wrapperProps: {} })}
