<script lang="ts" module>
	import { DropdownMenu } from "bits-ui";
	export type DropdownMenuForceMountTestProps = DropdownMenu.RootProps & {
		checked?: boolean;
		subChecked?: boolean;
		radio?: string;
		subRadio?: string;
		open?: boolean;
		contentProps?: Omit<DropdownMenu.ContentProps, "children" | "child" | "asChild">;
		subContentProps?: Omit<DropdownMenu.SubContentProps, "children" | "child" | "asChild">;
		portalProps?: DropdownMenu.PortalProps;
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	let {
		checked = false,
		subChecked = false,
		radio = "",
		subRadio = "",
		open = false,
		contentProps = {},
		subContentProps = {},
		portalProps = {},
		withOpenCheck = false,
		...restProps
	}: DropdownMenuForceMountTestProps = $props();
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
			<DropdownMenu.Separator data-testid="separator" />
			<DropdownMenu.Group data-testid="group">
				<DropdownMenu.GroupHeading data-testid="group-heading"
					>Stuff</DropdownMenu.GroupHeading
				>
				<DropdownMenu.Item data-testid="item">
					<span>item</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>

			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger data-testid="sub-trigger">
					<span>subtrigger</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent data-testid="sub-content" {...subContentProps}>
					<DropdownMenu.Item data-testid="sub-item">
						<span>Email</span>
					</DropdownMenu.Item>
					<DropdownMenu.CheckboxItem
						bind:checked={subChecked}
						data-testid="sub-checkbox-item"
					>
						{#snippet children({ checked, indeterminate: _indeterminate })}
							<span data-testid="sub-checkbox-indicator">
								{checked}
							</span>
							sub checkbox
						{/snippet}
					</DropdownMenu.CheckboxItem>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item disabled data-testid="disabled-item">disabled item</DropdownMenu.Item
			>
			<DropdownMenu.Item disabled data-testid="disabled-item-2"
				>disabled item 2</DropdownMenu.Item
			>
			<DropdownMenu.CheckboxItem bind:checked data-testid="checkbox-item">
				{#snippet children({ checked, indeterminate: _indeterminate })}
					<span data-testid="checkbox-indicator">
						{checked}
					</span>
					Checkbox Item
				{/snippet}
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.Item data-testid="item-2">item 2</DropdownMenu.Item>
			<DropdownMenu.RadioGroup bind:value={radio} data-testid="radio-group">
				<DropdownMenu.RadioItem value="1" data-testid="radio-item">
					{#snippet children({ checked })}
						<span data-testid="radio-indicator-1">
							{checked}
						</span>
						<span>Radio Item 1</span>
					{/snippet}
				</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="2" data-testid="radio-item-2">
					{#snippet children({ checked })}
						<span data-testid="radio-indicator-2">
							{checked}
						</span>
						<span>Radio Item 2</span>
					{/snippet}
				</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</div>
	</div>
{/snippet}

<main>
	<div data-testid="outside">outside</div>
	<div data-testid="non-portal-container">
		<DropdownMenu.Root bind:open {...restProps}>
			<DropdownMenu.Trigger data-testid="trigger">open</DropdownMenu.Trigger>
			<DropdownMenu.Portal {...portalProps}>
				{#if withOpenCheck}
					<DropdownMenu.Content data-testid="content" {...contentProps} forceMount>
						{#snippet child(props)}
							{#if props.open}
								{@render Content(props)}
							{/if}
						{/snippet}
					</DropdownMenu.Content>
				{:else}
					<DropdownMenu.Content data-testid="content" {...contentProps} forceMount>
						{#snippet child(props)}
							{@render Content(props)}
						{/snippet}
					</DropdownMenu.Content>
				{/if}
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</div>

	<!-- Buttons to test binding -->
	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<button data-testid="checked-binding" onclick={() => (checked = !checked)}>{checked}</button>
	<button data-testid="sub-checked-binding" onclick={() => (subChecked = !subChecked)}
		>{subChecked}</button
	>
	<button aria-label="radio-main" data-testid="radio-binding" onclick={() => (radio = "")}
		>{radio}</button
	>
	<button aria-label="radio-sub" data-testid="sub-radio-binding" onclick={() => (subRadio = "")}
		>{subRadio}</button
	>
	<div id="portal-target" data-testid="portal-target"></div>
</main>
