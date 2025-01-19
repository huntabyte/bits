<script lang="ts">
	import { Collapsible } from "bits-ui";

	let {
		open = false,
		...restProps
	}: Omit<Collapsible.RootProps, "asChild" | "child" | "children"> = $props();
</script>

<main>
	<p data-testid="binding">{open}</p>
	<Collapsible.Root data-testid="root" bind:open {...restProps}>
		<Collapsible.Trigger data-testid="trigger">Trigger</Collapsible.Trigger>
		<Collapsible.Content data-testid="content">Content</Collapsible.Content>
	</Collapsible.Root>
	<button data-testid="alt-trigger" onclick={() => (open = !open)}>Toggle</button>
</main>
