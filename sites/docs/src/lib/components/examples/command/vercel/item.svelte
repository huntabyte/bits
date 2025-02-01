<script lang="ts">
	import type { Snippet } from "svelte";
	import { Command } from "bits-ui";

	let {
		shortcut = "",
		onSelect = () => {},
		value,
		children,
	}: {
		shortcut?: string;
		onSelect?: (() => void) | undefined;
		value: string;
		children: Snippet;
	} = $props();
</script>

<Command.Item {onSelect} {value}>
	{@render children?.()}
	{#if shortcut}
		<div data-command-vercel-shortcuts="">
			{#each shortcut.split(" ") as key}
				<kbd>{key}</kbd>
			{/each}
		</div>
	{/if}
</Command.Item>
