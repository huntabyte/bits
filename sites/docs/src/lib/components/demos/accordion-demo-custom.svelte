<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
	import DemoContainer from "../demo-container.svelte";
	import CustomAccordionItem from "./accordion-demo-custom-item.svelte";

	const myItems = [
		{
			value: "A",
			title: "Title A",
			content: "Content A",
			disabled: false,
		},
		{
			value: "B",
			title: "Title B",
			content: "Content B",
			disabled: false,
		},
		{
			value: "C",
			title: "Title C",
			content: "Content C",
			disabled: false,
		},
	];

	let {
		items = myItems,
		value = $bindable(),
		ref = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Accordion.RootProps> & {
		items: { value?: string; title: string; content: string }[];
	} = $props();
</script>

<DemoContainer size="sm" wrapperClass="rounded-b-card">
	<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
	<Accordion.Root bind:value bind:ref class="w-full sm:max-w-[70%]" {...restProps as any}>
		{#each items as item, i (item.title + i)}
			<CustomAccordionItem {...item} />
		{/each}
	</Accordion.Root>
</DemoContainer>
