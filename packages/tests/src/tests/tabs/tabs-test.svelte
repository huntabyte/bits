<script lang="ts" module>
	import { Tabs, type WithoutChildrenOrChild } from "bits-ui";
	export type Item = {
		value: string;
		disabled: boolean;
	};

	export type TabsTestProps = WithoutChildrenOrChild<Tabs.RootProps> & {
		items: Item[];
	};
</script>

<script lang="ts">
	let { value = "1", items, ...restProps }: TabsTestProps = $props();
</script>

<main>
	<Tabs.Root aria-label="airplane mode" data-testid="root" bind:value {...restProps}>
		<Tabs.List data-testid="list">
			{#each items as { value, disabled }}
				<Tabs.Trigger {value} {disabled} data-testid="trigger-{value}">
					{value}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		{#each items as { value }}
			<Tabs.Content {value} data-testid="content-{value}">
				{value}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
	<button data-testid="binding" onclick={() => (value = "1")}>{value}</button>
</main>
