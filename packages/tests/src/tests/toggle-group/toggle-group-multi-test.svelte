<script lang="ts" module>
	import type { MultipleToggleGroupRootProps, WithoutChildrenOrChild } from "bits-ui";
	import { ToggleGroup } from "bits-ui";
	export type Item = {
		value: string;
		disabled?: boolean;
	};

	export type MultipleToggleGroupTestProps =
		WithoutChildrenOrChild<MultipleToggleGroupRootProps> & {
			items: Item[];
		};
</script>

<script lang="ts">
	let { value = [], items, ...restProps }: MultipleToggleGroupTestProps = $props();
</script>

<main>
	<button data-testid="binding" aria-label="binding" onclick={() => (value = ["4"])}>
		{value}
	</button>
	<ToggleGroup.Root data-testid="root" bind:value {...restProps} type="multiple">
		{#each items as { value, disabled }}
			<ToggleGroup.Item {value} {disabled} data-testid="item-{value}">
				{value}
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</main>
