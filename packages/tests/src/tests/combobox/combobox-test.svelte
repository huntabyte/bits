<script lang="ts" module>
	import {
		Combobox,
		type ComboboxSingleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "bits-ui";
	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type ComboboxSingleTestProps = Omit<WithoutChildren<ComboboxSingleRootProps>, "type"> & {
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Combobox.PortalProps>;
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
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
		inputProps,
		onOpenChange,
		...restProps
	}: ComboboxSingleTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.includes(searchValue.toLowerCase()))
	);
</script>

<main data-testid="main">
	<Combobox.Root
		type="single"
		bind:value
		bind:open
		{...restProps}
		onOpenChange={(v) => {
			onOpenChange?.(v);
			if (!v) searchValue = "";
		}}
	>
		<Combobox.Trigger data-testid="trigger">Open combobox</Combobox.Trigger>
		<Combobox.Input
			data-testid="input"
			aria-label="open combobox"
			oninput={(e) => (searchValue = e.currentTarget.value)}
			{...inputProps}
		/>
		<Combobox.Portal {...portalProps}>
			<Combobox.Content data-testid="content" {...contentProps}>
				<Combobox.Group data-testid="group">
					<Combobox.GroupHeading data-testid="group-label">Options</Combobox.GroupHeading>
					{#each filteredItems as { value, label, disabled }}
						<Combobox.Item data-testid={value} {disabled} {value} {label}>
							{#snippet children({ selected, highlighted: _highlighted })}
								{#if selected}
									<span data-testid="{value}-indicator">x</span>
								{/if}
								{label}
							{/snippet}
						</Combobox.Item>
					{/each}
				</Combobox.Group>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
	<div data-testid="outside"></div>
	<button data-testid="input-binding" onclick={() => (searchValue = "")}>
		{#if searchValue === ""}
			empty
		{:else}
			{searchValue}
		{/if}
	</button>
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
