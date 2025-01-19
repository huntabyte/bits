<script lang="ts" module>
	import {
		Select,
		type SelectSingleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "bits-ui";
	import { generateTestId } from "../helpers/select";
	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type SelectForceMountTestProps = WithoutChildren<SelectSingleRootProps> & {
		contentProps?: WithoutChildrenOrChild<Select.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Select.PortalProps>;
		items: Item[];
		searchValue?: string;
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		items,
		value = "",
		open = false,
		searchValue = "",
		withOpenCheck = false,
		...restProps
	}: SelectForceMountTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.includes(searchValue.toLowerCase()))
	);

	const selectedLabel = $derived(filteredItems.find((item) => item.value === value)?.label);
</script>

{#snippet Content({
	props,
	wrapperProps,
}: {
	props: Record<string, unknown>;
	wrapperProps: Record<string, unknown>;
})}
	<div {...wrapperProps}>
		<div {...props}>
			<Select.Group data-testid="group">
				<Select.GroupHeading data-testid="group-label">Options</Select.GroupHeading>
				{#each filteredItems as { value, label, disabled }}
					{@const testId = generateTestId(value)}
					<Select.Item data-testid={testId} {disabled} {value} {label}>
						{#snippet children({ selected, highlighted: _highlighted })}
							{#if selected}
								<span data-testid="{testId}-indicator">x</span>
							{/if}
							{label}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Group>
		</div>
	</div>
{/snippet}

<main data-testid="main">
	<Select.Root bind:value bind:open {...restProps}>
		<Select.Trigger data-testid="trigger">
			{#if selectedLabel}
				{selectedLabel}
			{:else}
				Open combobox
			{/if}
		</Select.Trigger>
		<Select.Portal {...portalProps}>
			{#if withOpenCheck}
				<Select.Content data-testid="content" {...contentProps} forceMount>
					{#snippet child(props)}
						{#if props.open}
							{@render Content(props)}
						{/if}
					{/snippet}
				</Select.Content>
			{:else}
				<Select.Content data-testid="content" {...contentProps} forceMount>
					{#snippet child(props)}
						{@render Content(props)}
					{/snippet}
				</Select.Content>
			{/if}
		</Select.Portal>
	</Select.Root>
	<div data-testid="outside"></div>
	<button data-testid="open-binding" onclick={() => (open = !open)}>
		{open}
	</button>
	<button data-testid="value-binding" onclick={() => (value = "")}>
		{#if value === ""}
			empty
		{:else}
			{value}
		{/if}
	</button>
</main>
<div data-testid="portal-target" id="portal-target"></div>
