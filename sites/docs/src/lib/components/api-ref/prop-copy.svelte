<script lang="ts">
	import { Popover } from "bits-ui";
	import Code from "$lib/components/markdown/code.svelte";

	let { name }: { name: string } = $props();
</script>

<div class="flex items-center gap-1.5">
	<Popover.Root>
		<Popover.Trigger
			class="inline-flex items-center justify-center rounded-button text-foreground-alt transition-colors hover:text-foreground-alt/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<Code class="bg-transparent px-0">{name}</Code>
		</Popover.Trigger>
		<Popover.Content
			side="top"
			sideOffset={10}
			class="z-50 max-h-[400px] overflow-auto rounded-input border border-border bg-background p-4 shadow-popover"
		>
			<button class="bg-transparent"> Copy to clipboard </button>
		</Popover.Content>
	</Popover.Root>
</div>
