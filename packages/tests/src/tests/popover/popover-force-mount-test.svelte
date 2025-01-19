<script lang="ts" module>
	import { Popover } from "bits-ui";
	export type PopoverForceMountTestProps = Popover.RootProps & {
		contentProps?: Omit<Popover.ContentProps, "asChild" | "child" | "children">;
		portalProps?: Popover.PortalProps;
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	let {
		open = false,
		contentProps,
		portalProps,
		withOpenCheck = false,
		...restProps
	}: PopoverForceMountTestProps = $props();
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
			content
			<Popover.Close data-testid="close">close</Popover.Close>
			<Popover.Arrow data-testid="arrow" />
		</div>
	</div>
{/snippet}

<main data-testid="main">
	<Popover.Root bind:open {...restProps}>
		<Popover.Trigger data-testid="trigger">trigger</Popover.Trigger>
		<Popover.Portal {...portalProps}>
			{#if withOpenCheck}
				<Popover.Content {...contentProps} data-testid="content" forceMount>
					{#snippet child(props)}
						{#if props.open}
							{@render Content(props)}
						{/if}
					{/snippet}
				</Popover.Content>
			{:else}
				<Popover.Content {...contentProps} data-testid="content" forceMount>
					{#snippet child(props)}
						{@render Content(props)}
					{/snippet}
				</Popover.Content>
			{/if}
		</Popover.Portal>
	</Popover.Root>

	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<div data-testid="outside">outside</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
