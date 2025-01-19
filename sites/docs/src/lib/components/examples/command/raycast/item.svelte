<script lang="ts">
	import type { Snippet } from "svelte";
	import { Command } from "bits-ui";

	let {
		value,
		isCommand = false,
		onSelect,
		keywords,
		children,
	}: {
		value: string;
		isCommand?: boolean;
		onSelect?: Command.ItemProps["onSelect"];
		keywords?: string[];
		children: Snippet;
	} = $props();
</script>

<Command.Item {value} {onSelect} {keywords}>
	{@render children?.()}
	<span data-command-raycast-meta="">
		{#if isCommand}
			Command
		{:else}
			Application
		{/if}
	</span>
</Command.Item>
