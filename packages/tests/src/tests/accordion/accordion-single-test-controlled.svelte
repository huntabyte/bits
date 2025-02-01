<script lang="ts">
	import { Accordion } from "bits-ui";

	type Item = {
		value: string;
		title: string;
		disabled: boolean;
		content: string;
		level: 1 | 2 | 3 | 4 | 5 | 6;
	};

	let {
		disabled = false,
		items = [],
		value: valueProp = "",
	}: Omit<
		Accordion.RootProps & {
			items: Item[];
		},
		"type"
	> = $props();

	let value = $state(valueProp);
</script>

<div data-testid="value">
	{value}
</div>

<button data-testid="update-value" onclick={() => (value = "item-1")}> Update Value </button>

<Accordion.Root type="single" bind:value={value as string} {disabled} data-testid="root">
	{#each items as { value, title, disabled, content, level }}
		<Accordion.Item {value} {disabled} data-testid="{value}-item">
			<Accordion.Header {level} data-testid="{value}-header">
				<Accordion.Trigger {disabled} data-testid="{value}-trigger">
					{title}
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content data-testid="{value}-content">{content}</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
