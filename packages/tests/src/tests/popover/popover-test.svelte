<script lang="ts" module>
	import { Popover } from "bits-ui";
	export type PopoverTestProps = Popover.RootProps & {
		contentProps?: Omit<Popover.ContentProps, "asChild" | "child" | "children">;
		portalProps?: Popover.PortalProps;
	};
</script>

<script lang="ts">
	let { open = false, contentProps, portalProps, ...restProps }: PopoverTestProps = $props();
</script>

<main data-testid="main">
	<Popover.Root bind:open {...restProps}>
		<Popover.Trigger data-testid="trigger">trigger</Popover.Trigger>
		<Popover.Portal {...portalProps}>
			<Popover.Content {...contentProps} data-testid="content">
				content
				<Popover.Close data-testid="close">close</Popover.Close>
				<Popover.Arrow data-testid="arrow" />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>

	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<div data-testid="outside">outside</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
