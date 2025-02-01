<script lang="ts">
	import "$lib/styles/markdown.postcss";
	import PageHeader from "$lib/components/page-header/page-header.svelte";
	import PageHeaderDescription from "$lib/components/page-header/page-header-description.svelte";
	import PageHeaderHeading from "$lib/components/page-header/page-header-heading.svelte";

	let { data } = $props();
	const Component = $derived(data.component);
</script>

<div class="markdown pb-24">
	<PageHeader>
		<PageHeaderHeading>{data.metadata.title}</PageHeaderHeading>
		<PageHeaderDescription>{data.metadata.description}</PageHeaderDescription>
	</PageHeader>
	<Component schemas={data.schemas} />
</div>
