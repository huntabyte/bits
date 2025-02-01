<script lang="ts">
	import { Tooltip } from "bits-ui";
	import Badge from "../ui/badge.svelte";
	import PropTypeContent from "./prop-type-content.svelte";
	import Code from "$lib/components/markdown/code.svelte";
	import * as Table from "$lib/components/ui/table/index.js";
	import type { PropObj } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";

	let {
		props: _props,
		slotted = false,
	}: { props: PropObj<Record<string, unknown>>; slotted?: boolean } = $props();

	const propData = $derived.by(() => {
		if (!_props) return [];
		return Object.entries(_props).map(([name, prop]) => {
			return {
				name,
				type: prop?.type,
				description: prop?.description,
				default: prop?.default,
				required: prop?.required,
				bindable: prop?.bindable,
				linked: prop?.linked,
				href: prop?.href,
				tooltipContent: prop?.tooltipContent,
			};
		});
	});
</script>

<Tooltip.Provider delayDuration={100}>
	<Table.Root>
		<Table.Header>
			<Table.Row class="w-1/4">
				<Table.Head class="w-[38%] whitespace-nowrap pr-1"
					>{slotted ? "Slot" : ""} Property</Table.Head
				>
				<Table.Head class="w-[22%] whitespace-nowrap pr-1">Type</Table.Head>
				<Table.Head class="w-[40%] whitespace-nowrap">Description</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each propData as p, i (p.name + i)}
				<Table.Row>
					<Table.Cell class="flex items-center gap-1 pr-1 align-baseline">
						<Code class="font-semibold text-foreground">{p?.name}</Code>
						{#if p?.required}
							<Badge class="border border-destructive bg-background text-destructive">
								required
							</Badge>
						{/if}
						{#if p?.bindable}
							<Badge
								class="border border-[#2A266B] bg-background text-[#2A266B] dark:border-[#FCDAFE] dark:text-[#FCDAFE]"
							>
								$bindable
							</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell class="pr-1 align-baseline">
						<PropTypeContent
							type={p?.type}
							linked={p?.linked}
							href={p?.href}
							tooltipContent={p?.tooltipContent}
						/>
					</Table.Cell>
					<Table.Cell class="align-baseline">
						<p class="text-sm leading-[1.5rem]">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html parseMarkdown(p.description)}
						</p>
						{#if !slotted}
							<div class="mt-2">
								<Code class="h-auto bg-background px-0">
									Default:
									{#if p.default}
										{` ${p.default}`}
									{:else}
										<span aria-hidden="true"> &nbsp;—— </span>
										<span class="sr-only"> undefined </span>
									{/if}
								</Code>
							</div>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Tooltip.Provider>
