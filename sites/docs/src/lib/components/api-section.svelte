<script lang="ts">
	import { page } from "$app/stores";
	import CSSVarsTable from "$lib/components/api-ref/css-vars-table.svelte";
	import DataAttrsTable from "$lib/components/api-ref/data-attrs-table.svelte";
	import PropsTable from "$lib/components/api-ref/props-table.svelte";
	import { h2 as H2, p as P } from "$lib/components/markdown/index.js";
	import type { APISchema } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";

	let { schemas = [] }: { schemas: APISchema[] } = $props();
</script>

<H2>API Reference</H2>

<div class="flex flex-col gap-12 pt-8">
	{#each schemas as schema}
		<div>
			<div
				class="inline-flex h-[29px] items-center justify-center rounded-button bg-accent px-3 font-mono text-[17px] font-medium leading-tight tracking-tight dark:text-neutral-900"
			>
				<h3 class="font-semibold">
					<span class="font-normal text-foreground/80 dark:text-neutral-900/80"
						>{$page.data.title.replaceAll(" ", "")}.</span
					>{schema.title}
				</h3>
			</div>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<P class="!mb-5 !mt-2">{@html parseMarkdown(schema.description)}</P>
			<div class="flex flex-col gap-4">
				{#if schema.props}
					<PropsTable props={schema.props} />
				{/if}
				{#if schema.dataAttributes && schema.dataAttributes.length}
					<DataAttrsTable dataAttrs={schema.dataAttributes} />
				{/if}
				{#if schema.cssVars && schema.cssVars.length}
					<CSSVarsTable cssVars={schema.cssVars} />
				{/if}
			</div>
		</div>
	{/each}
</div>
