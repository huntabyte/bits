<script lang="ts">
	import { Tooltip } from "bits-ui";
	import MagicWand from "phosphor-svelte/lib/MagicWand";
	import { fly } from "svelte/transition";
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger
			class="inline-flex size-10 items-center justify-center rounded-full
		border border-border-input bg-background-alt shadow-btn ring-dark ring-offset-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<MagicWand class="size-5" />
		</Tooltip.Trigger>
		<Tooltip.Content sideOffset={8} forceMount>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly={{ duration: 300 }}>
							<div
								class="z-0 flex items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-none"
							>
								Make some magic!
							</div>
						</div>
					</div>
				{/if}
			{/snippet}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
