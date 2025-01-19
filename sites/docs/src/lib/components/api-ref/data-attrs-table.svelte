<script lang="ts">
	import ValueContent from "./data-attr-value-content.svelte";
	import Code from "$lib/components/markdown/code.svelte";
	import * as Table from "$lib/components/ui/table/index.js";
	import type { DataAttrSchema } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";

	let { dataAttrs = [] }: { dataAttrs: DataAttrSchema[] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="w-1/4">
			<Table.Head class="w-[38%] whitespace-nowrap">Data Attribute</Table.Head>
			<Table.Head class="w-[22%] whitespace-nowrap">Value</Table.Head>
			<Table.Head class="w-[40%] whitespace-nowrap">Description</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if dataAttrs.length}
			{#each dataAttrs as attr (attr.name)}
				<Table.Row>
					<Table.Cell class="align-baseline">
						<Code class="font-semibold text-foreground">data-{attr.name}</Code>
					</Table.Cell>
					<Table.Cell class="pr-1 align-baseline">
						<ValueContent {attr} />
					</Table.Cell>
					<Table.Cell class="align-baseline">
						{#if attr.description}
							<p class="my-2 text-sm leading-7">
								<!--  eslint-disable-next-line svelte/no-at-html-tags -->
								{@html parseMarkdown(attr.description)}
							</p>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
