<script lang="ts">
	import DemoContainer from "../demo-container.svelte";
	import CustomDialog from "./dialog-demo-custom.svelte";
</script>

<DemoContainer size="sm" wrapperClass="rounded-bl-card rounded-br-card">
	<CustomDialog buttonText="Open first dialog">
		{#snippet title()}
			First Dialog
		{/snippet}
		{#snippet description()}
			This is the first dialog.
		{/snippet}
		<CustomDialog buttonText="Open second dialog">
			{#snippet title()}
				Second Dialog
			{/snippet}
			{#snippet description()}
				This is the second dialog.
			{/snippet}
		</CustomDialog>
	</CustomDialog>
</DemoContainer>
