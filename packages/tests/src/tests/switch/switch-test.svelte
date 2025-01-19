<script lang="ts">
	import { Switch, type WithoutChildrenOrChild } from "bits-ui";

	let { checked = false, ...restProps }: WithoutChildrenOrChild<Switch.RootProps> = $props();
</script>

<main>
	<button data-testid="binding" onclick={() => (checked = !checked)}>{checked}</button>
	<Switch.Root aria-label="airplane mode" data-testid="root" bind:checked {...restProps}>
		<Switch.Thumb data-testid="thumb" />
	</Switch.Root>
</main>
