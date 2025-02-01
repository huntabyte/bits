<script lang="ts">
	import { Popover, Tooltip } from "bits-ui";
	import Info from "phosphor-svelte/lib/Info";
	import type { Component } from "svelte";
	import Code from "$lib/components/markdown/code.svelte";
	import type { PropType } from "$lib/types/index.js";
	import { parseTypeDef } from "$lib/utils/index.js";

	let {
		type,
		linked = false,
		href = "",
		tooltipContent = "",
	}: {
		type: PropType | string;
		linked?: boolean;
		href?: string;
		tooltipContent?: string;
	} = $props();
</script>

{#snippet StringType()}
	{#if tooltipContent && linked && href}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<a {href} {...props}>
						<Code class="bg-transparent px-0">{type}</Code>
					</a>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content side="top" sideOffset={8}>
					<div
						class="flex items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-none"
					>
						{tooltipContent}
					</div>
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	{:else if linked && href}
		<a {href}>
			<Code class="bg-transparent px-0">{type}</Code>
		</a>
	{:else}
		<Code class="bg-transparent px-0">{type}</Code>
	{/if}
{/snippet}

{#snippet TypeContent({ typeDef }: { typeDef: string | Component })}
	{#if typeof typeDef === "string"}
		<Popover.Content
			preventScroll={false}
			side="top"
			sideOffset={10}
			class="focus-override z-50 rounded-card border border-border bg-background p-4 shadow-popover outline-none"
		>
			<div class="max-h-[400px] max-w-[700px] overflow-auto">
				<Code class="h-auto bg-transparent px-0 tracking-tight text-foreground">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html parseTypeDef(typeDef)}
				</Code>
			</div>
		</Popover.Content>
	{:else}
		<Popover.Content
			preventScroll={false}
			side="top"
			sideOffset={10}
			class="z-50 max-h-[400px] max-w-[600px] overflow-auto rounded-card border-2 border-border bg-background py-4 pl-1.5 pr-4 shadow-popover"
		>
			{@const TypeDef = typeDef}
			<div
				class="[&_[data-line]]:!pr-2.5 [&_pre]:!my-0 [&_pre]:!mb-0 [&_pre]:mt-0 [&_pre]:!overflow-x-visible [&_pre]:border-0 [&_pre]:p-0 [&_pre]:!pb-0 [&_pre]:!pt-0 [&_pre]:!outline-none [&_pre]:!ring-0 [&_pre]:!ring-offset-0"
			>
				<TypeDef />
			</div>
		</Popover.Content>
	{/if}
{/snippet}

<div class="flex items-center gap-1.5">
	{#if typeof type === "string"}
		{@render StringType()}
	{:else}
		<Code class="bg-transparent px-0">{type.type}</Code>
		<Popover.Root>
			<Popover.Trigger
				class="inline-flex items-center justify-center rounded-button text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				<Info class="size-4" weight="bold" />
				<span class="sr-only">See type definition</span>
			</Popover.Trigger>
			{@render TypeContent({ typeDef: type.definition })}
		</Popover.Root>
	{/if}
</div>
