<script lang="ts" module>
	import { Tooltip, type WithoutChildrenOrChild } from "bits-ui";

	export type TooltipTestProps = WithoutChildrenOrChild<Tooltip.RootProps> & {
		contentProps?: WithoutChildrenOrChild<Tooltip.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Tooltip.PortalProps>;
	};
</script>

<script lang="ts">
	let { open = false, portalProps, contentProps, ...restProps }: TooltipTestProps = $props();
</script>

<main data-testid="main">
	<Tooltip.Provider delayDuration={0}>
		<Tooltip.Root bind:open {...restProps}>
			<Tooltip.Trigger data-testid="trigger">@sveltejs</Tooltip.Trigger>
			<Tooltip.Portal {...portalProps}>
				<Tooltip.Content {...contentProps} data-testid="content" class="w-80">
					Content
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	</Tooltip.Provider>
	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<div class="h-96"></div>
	<div data-testid="outside" class="">outside</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
