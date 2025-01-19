<script lang="ts">
	import { Tooltip, type WithoutChildren, type WithoutChildrenOrChild } from "bits-ui";
	import MagicWand from "phosphor-svelte/lib/MagicWand";

	let {
		delayDuration = 200,
		contentProps = { sideOffset: 8 },
		...restProps
	}: WithoutChildren<Tooltip.RootProps> & {
		contentProps?: WithoutChildrenOrChild<Tooltip.ContentProps>;
	} = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root {...restProps} {delayDuration}>
		<Tooltip.Trigger
			class="inline-flex size-10 items-center justify-center rounded-full
		border border-border-input bg-background-alt shadow-btn ring-dark ring-offset-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<MagicWand class="size-5" />
		</Tooltip.Trigger>
		<Tooltip.Content {...contentProps}>
			<div>
				<Tooltip.Arrow
					class="rounded-[2px] border-l border-t border-dark-10 text-dark-10"
				/>
			</div>
			<div
				class="flex items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-none"
			>
				Make some magic!
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
