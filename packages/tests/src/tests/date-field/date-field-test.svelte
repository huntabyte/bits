<script lang="ts" module>
	import { DateField, type DateFieldRootProps, type WithoutChildrenOrChild } from "bits-ui";
	export type DateFieldTestProps = WithoutChildrenOrChild<DateFieldRootProps> & {
		name?: string;
	};
</script>

<script lang="ts">
	let { value, placeholder, name, ...restProps }: DateFieldTestProps = $props();
</script>

<main>
	<button data-testid="reset" onclick={() => (value = undefined)}>Reset</button>
	<div data-testid="value">{value}</div>
	<DateField.Root bind:value bind:placeholder {...restProps}>
		<div>
			<DateField.Label data-testid="label">Label</DateField.Label>
			<DateField.Input data-testid="input" {name}>
				{#snippet children({ segments })}
					{#each segments as { part, value }}
						<DateField.Segment
							{part}
							data-testid={part === "literal" ? undefined : part}
						>
							{value}
						</DateField.Segment>
					{/each}
				{/snippet}
			</DateField.Input>
		</div>
	</DateField.Root>
</main>
