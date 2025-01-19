<script lang="ts" module>
	import {
		Combobox,
		type ComboboxMultipleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "bits-ui";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type ComboboxMultipleTestProps = Omit<
		WithoutChildren<ComboboxMultipleRootProps>,
		"type"
	> & {
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Combobox.PortalProps>;
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		items: Item[];
		searchValue?: string;
		onFormSubmit?: (fd: FormData) => void;
	};
</script>

<script lang="ts">
	let {
		contentProps,
		portalProps,
		items,
		value = [],
		open = false,
		searchValue = "",
		inputProps,
		onOpenChange,
		onFormSubmit,
		...restProps
	}: ComboboxMultipleTestProps = $props();

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.includes(searchValue.toLowerCase()))
	);
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
		<Combobox.Root
			bind:value
			bind:open
			type="multiple"
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
						<Combobox.GroupHeading data-testid="group-label"
							>Options</Combobox.GroupHeading
						>
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
		<button type="button" data-testid="input-binding" onclick={() => (searchValue = "")}>
			{#if searchValue === ""}
				empty
			{:else}
				{searchValue}
			{/if}
		</button>
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
