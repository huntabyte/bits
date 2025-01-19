<script lang="ts">
	import { Collapsible } from "bits-ui";

	let {
		open = false,
		withOpenCheck = false,
		...restProps
	}: Omit<Collapsible.RootProps, "asChild" | "child" | "children"> & {
		withOpenCheck?: boolean;
	} = $props();
</script>

<main>
	<p data-testid="binding">{open}</p>
	<Collapsible.Root data-testid="root" bind:open {...restProps}>
		<Collapsible.Trigger data-testid="trigger">Trigger</Collapsible.Trigger>
		{#if withOpenCheck}
			<Collapsible.Content data-testid="content" forceMount>
				{#snippet child({ props, open })}
					{#if open}
						<div {...props}>Content</div>
					{/if}
				{/snippet}
			</Collapsible.Content>
		{:else}
			<Collapsible.Content data-testid="content" forceMount>
				{#snippet child({ props, open: _open })}
					<div {...props}>Content</div>
				{/snippet}
			</Collapsible.Content>
		{/if}
	</Collapsible.Root>
	<button data-testid="alt-trigger" onclick={() => (open = !open)}>Toggle</button>
</main>
