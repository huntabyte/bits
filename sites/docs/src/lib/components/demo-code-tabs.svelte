<script lang="ts">
	import { Tabs } from "bits-ui";
	import type { Snippet } from "svelte";
	import CopySimple from "phosphor-svelte/lib/CopySimple";
	import Check from "phosphor-svelte/lib/Check";
	import { noop } from "@melt-ui/svelte/internal/helpers";
	import { cn } from "$lib/utils/styles.js";
	import { useCopyToClipboard } from "$lib/utils/copy-to-clipboard.svelte.js";

	type Props = {
		value?: string;
		onValueChange?: (value: string) => void;
		items: { value: string; label: string }[];
		children: Snippet;
		open: boolean;
		expandable?: boolean;
		ref?: HTMLElement | null;
	};

	let {
		value = $bindable(),
		open = $bindable(),
		ref = $bindable(null),
		onValueChange = noop,
		items,
		expandable = true,
		children,
	}: Props = $props();

	const copyToClipboard = useCopyToClipboard();
</script>

<Tabs.Root {value} {onValueChange}>
	<div class="flex items-center justify-between border-x-2 pb-2 pt-1">
		<Tabs.List class="flex items-center">
			{#each items as item}
				<Tabs.Trigger
					value={item.value}
					class="flex select-none border-b-2 border-b-transparent text-sm text-foreground-alt data-[state=active]:border-foreground-alt  data-[state=active]:text-foreground"
				>
					<span class="px-4 py-2">
						{item.label}
					</span>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<div class="flex items-center gap-2 border-b-2 border-transparent pr-2 text-sm">
			{#if expandable}
				<button
					class={cn(
						"hidden select-none items-center justify-center whitespace-nowrap rounded-[7px] px-2.5 py-1.5 text-sm text-foreground ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
					)}
					onclick={() => (open = !open)}
					aria-label="Toggle code expansion"
				>
					{open ? "Collapse" : "Expand"} Code
				</button>
			{/if}
			<button
				class={cn(
					"relative inline-flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				)}
				aria-label="Copy"
				data-copy-code
				onclick={() => copyToClipboard?.copyToClipboard()}
			>
				{#if !copyToClipboard || !copyToClipboard.isCopied}
					<CopySimple class="size-4" />
				{:else}
					<Check class="size-4" />
				{/if}
			</button>
		</div>
	</div>
	<div style="display: contents;" bind:this={ref}>
		{@render children()}
	</div>
</Tabs.Root>
