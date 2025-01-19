<script lang="ts">
	import { Popover } from "bits-ui";
	import Info from "phosphor-svelte/lib/Info";
	import type { Component } from "svelte";
	import Code from "$lib/components/markdown/code.svelte";
	import type { DataAttrSchema } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/markdown.js";

	let { attr }: { attr: DataAttrSchema } = $props();
</script>

{#snippet StringType()}
	<Code class="bg-transparent px-0">{parseMarkdown(attr.value ?? "''")}</Code>
{/snippet}

{#snippet DefinitionContent({ definition }: { definition: Component })}
	<Popover.Content
		preventScroll={false}
		side="top"
		sideOffset={10}
		class="z-50 max-h-[400px] overflow-auto rounded-card bg-background shadow-popover"
	>
		{@const Definition = definition}
		<div class="[&_[data-line]]:!pr-2.5 [&_pre]:!my-0 [&_pre]:!mb-0 [&_pre]:!mt-0">
			<Definition />
		</div>
	</Popover.Content>
{/snippet}

<div class="flex items-center gap-1.5">
	{#if !attr.isEnum}
		{@render StringType()}
	{:else}
		<Code class="bg-transparent px-0">enum</Code>
		<Popover.Root>
			<Popover.Trigger
				class="inline-flex items-center justify-center rounded-button text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				<Info class="size-4" weight="bold" />
				<span class="sr-only">See type definition</span>
			</Popover.Trigger>
			{#if attr.definition}
				{@render DefinitionContent({ definition: attr.definition })}
			{/if}
		</Popover.Root>
	{/if}
</div>
