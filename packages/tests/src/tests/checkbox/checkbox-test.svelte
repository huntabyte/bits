<script lang="ts">
	import { Checkbox } from "bits-ui";

	let { checked = false, ...restProps }: Checkbox.RootProps = $props();
</script>

<main>
	<p data-testid="binding">{checked}</p>
	<Checkbox.Root name="terms" data-testid="root" bind:checked {...restProps}>
		{#snippet children({ checked, indeterminate })}
			<span data-testid="indicator">
				{#if indeterminate}
					indeterminate
				{:else}
					{checked}
				{/if}
			</span>
		{/snippet}
	</Checkbox.Root>
</main>
