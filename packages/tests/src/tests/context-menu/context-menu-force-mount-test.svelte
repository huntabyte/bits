<script lang="ts" module>
	import { ContextMenu } from "bits-ui";
	export type ContextMenuForceMountTestProps = ContextMenu.RootProps & {
		checked?: boolean;
		subChecked?: boolean;
		radio?: string;
		subRadio?: string;
		open?: boolean;
		contentProps?: Omit<ContextMenu.ContentProps, "asChild" | "children" | "child">;
		portalProps?: Omit<ContextMenu.PortalProps, "asChild" | "children" | "child">;
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
		portalProps = {},
		withOpenCheck = false,
		...restProps
	}: ContextMenuForceMountTestProps = $props();
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
			<ContextMenu.Separator data-testid="separator" />
			<ContextMenu.Group data-testid="group">
				<ContextMenu.GroupHeading data-testid="group-heading">
					Stuff
				</ContextMenu.GroupHeading>
				<ContextMenu.Item data-testid="item">
					<span>item</span>
				</ContextMenu.Item>
			</ContextMenu.Group>

			<ContextMenu.Sub>
				<ContextMenu.SubTrigger data-testid="sub-trigger">
					<span>subtrigger</span>
				</ContextMenu.SubTrigger>
				<ContextMenu.SubContent data-testid="sub-content">
					<ContextMenu.Item data-testid="sub-item">
						<span>Email</span>
					</ContextMenu.Item>
					<ContextMenu.CheckboxItem
						bind:checked={subChecked}
						data-testid="sub-checkbox-item"
					>
						{#snippet children({ checked, indeterminate: _indeterminate })}
							<span data-testid="sub-checkbox-indicator">
								{checked}
							</span>
							sub checkbox
						{/snippet}
					</ContextMenu.CheckboxItem>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
			<ContextMenu.Item disabled data-testid="disabled-item">disabled item</ContextMenu.Item>
			<ContextMenu.Item disabled data-testid="disabled-item-2"
				>disabled item 2</ContextMenu.Item
			>
			<ContextMenu.CheckboxItem bind:checked data-testid="checkbox-item">
				{#snippet children({ checked, indeterminate: _indeterminate })}
					<span data-testid="checkbox-indicator">
						{checked}
					</span>
					Checkbox Item
				{/snippet}
			</ContextMenu.CheckboxItem>
			<ContextMenu.Item data-testid="item-2">item 2</ContextMenu.Item>
			<ContextMenu.RadioGroup bind:value={radio} data-testid="radio-group">
				<ContextMenu.RadioItem value="1" data-testid="radio-item">
					{#snippet children({ checked })}
						<span data-testid="radio-indicator-1">
							{checked}
						</span>
						<span>Radio Item 1</span>
					{/snippet}
				</ContextMenu.RadioItem>
				<ContextMenu.RadioItem value="2" data-testid="radio-item-2">
					{#snippet children({ checked })}
						<span data-testid="radio-indicator-2">
							{checked}
						</span>
						<span>Radio Item 2</span>
					{/snippet}
				</ContextMenu.RadioItem>
			</ContextMenu.RadioGroup>
		</div>
	</div>
{/snippet}

<main>
	<div data-testid="outside">outside</div>
	<div data-testid="non-portal-container">
		<ContextMenu.Root bind:open {...restProps}>
			<ContextMenu.Trigger
				data-testid="trigger"
				class="h-[500px] w-[500px]"
				aria-expanded={undefined}
				aria-controls={undefined}
			>
				open
			</ContextMenu.Trigger>
			<ContextMenu.Portal {...portalProps}>
				{#if withOpenCheck}
					<ContextMenu.Content {...contentProps} data-testid="content" forceMount>
						{#snippet child(props)}
							{#if props.open}
								{@render Content(props)}
							{/if}
						{/snippet}
					</ContextMenu.Content>
				{:else}
					<ContextMenu.Content {...contentProps} data-testid="content" forceMount>
						{#snippet child(props)}
							{@render Content(props)}
						{/snippet}
					</ContextMenu.Content>
				{/if}
			</ContextMenu.Portal>
		</ContextMenu.Root>
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
