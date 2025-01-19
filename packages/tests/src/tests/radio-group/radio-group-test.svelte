<script lang="ts" module>
	import { RadioGroup } from "bits-ui";
	export type Item = {
		value: string;
		disabled: boolean;
	};

	export type RadioGroupTestProps = Omit<
		RadioGroup.RootProps,
		"child" | "children" | "asChild"
	> & {
		items: Item[];
	};
</script>

<script lang="ts">
	let { items, value = "", ...restProps }: RadioGroupTestProps = $props();
</script>

<main>
	<RadioGroup.Root data-testid="root" bind:value {...restProps}>
		{#each items as { value, disabled }}
			<RadioGroup.Item id={value} {value} {disabled} data-testid="{value}-item">
				{#snippet children({ checked })}
					<span data-testid="{value}-indicator"> {checked} </span>
					{value}
				{/snippet}
			</RadioGroup.Item>
			<label for={value} data-testid="{value}-label">
				Label for {value}
			</label>
		{/each}
	</RadioGroup.Root>
	<button
		aria-label="binding"
		data-testid="binding"
		onclick={() => (value = items[0]?.value ?? "")}
	>
		{value}
	</button>
</main>
