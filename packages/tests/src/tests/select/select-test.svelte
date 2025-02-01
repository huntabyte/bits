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

	export type SelectSingleTestProps = WithoutChildren<SelectSingleRootProps> & {
		contentProps?: WithoutChildrenOrChild<Select.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Select.PortalProps>;
		items: Item[];
		searchValue?: string;
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
		...restProps
	}: SelectSingleTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()))
	);

	const selectedLabel = $derived(
		value ? items.find((item) => item.value === value)?.label : "Open Listbox"
	);
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open {...restProps} type="single">
		<Select.Trigger data-testid="trigger">
			{selectedLabel}
		</Select.Trigger>
		<Select.Portal {...portalProps}>
			<Select.Content data-testid="content" {...contentProps}>
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
			</Select.Content>
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
