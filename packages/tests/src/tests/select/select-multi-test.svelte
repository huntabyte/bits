<script lang="ts" module>
	import {
		Select,
		type SelectMultipleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "bits-ui";
	import { generateTestId } from "../helpers/select";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type SelectMultipleTestProps = WithoutChildren<SelectMultipleRootProps> & {
		contentProps?: WithoutChildrenOrChild<Select.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Select.PortalProps>;
		items: Item[];
		searchValue?: string;
		onSelectedLabelChange?: (value: string) => void;
		onFormSubmit?: (fd: FormData) => void;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		items = [],
		value = [],
		open = false,
		searchValue = "",
		onSelectedLabelChange,
		onFormSubmit,
		...restProps
	}: SelectMultipleTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.includes(searchValue.toLowerCase()))
	);

	const selectedLabels = $derived(
		filteredItems.filter((item) => value.includes(item.value)).map((item) => item.label)
	);

	const selectedLabel = $derived(
		selectedLabels.length > 0 ? selectedLabels.join(", ") : "Open combobox"
	);

	$effect(() => {
		onSelectedLabelChange?.(selectedLabel);
	});
</script>

<main data-testid="main">
	<form
		data-testid="form"
		method="POST"
		onsubmit={(e) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			onFormSubmit?.(formData);
		}}
	>
		<Select.Root bind:value bind:open {...restProps} type="multiple">
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
		<button type="button" data-testid="open-binding" onclick={() => (open = !open)}>
			{open}
		</button>
		<button type="button" data-testid="value-binding" onclick={() => (value = [])}>
			{#if value.length === 0}
				empty
			{:else}
				{value}
			{/if}
		</button>
		<button data-testid="submit" type="submit"> Submit </button>
	</form>
</main>
<div data-testid="portal-target" id="portal-target"></div>
