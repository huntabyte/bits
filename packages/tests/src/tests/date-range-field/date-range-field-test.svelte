<script lang="ts" module>
	import {
		DateRangeField,
		type DateRangeFieldInputProps,
		type DateRangeFieldRootProps,
		type WithoutChildrenOrChild,
	} from "bits-ui";
	export type DateRangeFieldTestProps = WithoutChildrenOrChild<DateRangeFieldRootProps> & {
		startProps?: Omit<DateRangeFieldInputProps, "type">;
		endProps?: Omit<DateRangeFieldInputProps, "type">;
	};
</script>

<script lang="ts">
	let { value, placeholder, startProps, endProps, ...restProps }: DateRangeFieldTestProps =
		$props();
</script>

<main>
	<div data-testid="value">{value}</div>
	<div data-testid="start-value">{value?.start}</div>
	<div data-testid="end-value">{value?.end}</div>
	<DateRangeField.Root bind:value bind:placeholder {...restProps} data-testid="root">
		<DateRangeField.Label data-testid="label">Label</DateRangeField.Label>
		{#each ["start", "end"] as const as type}
			{@const inputProps = type === "start" ? startProps : endProps}
			<DateRangeField.Input data-testid="{type}-input" {type} {...inputProps}>
				{#snippet children({ segments })}
					{#each segments as { part, value }}
						<DateRangeField.Segment
							{part}
							data-testid={part === "literal" ? undefined : `${type}-${part}`}
						>
							{value}
						</DateRangeField.Segment>
					{/each}
				{/snippet}
			</DateRangeField.Input>
		{/each}
	</DateRangeField.Root>
</main>
