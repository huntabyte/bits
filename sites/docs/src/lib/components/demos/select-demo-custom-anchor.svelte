<script lang="ts">
	import DemoContainer from "../demo-container.svelte";
	import SelectDemoCustom from "./select-demo-custom.svelte";

	let customAnchor = $state<HTMLElement>(null!);
</script>

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<div class="flex items-center gap-6">
		<div class="rounded-md border p-3" bind:this={customAnchor}>Custom Anchor</div>
		<SelectDemoCustom
			contentProps={{
				customAnchor,
			}}
		/>
	</div>
</DemoContainer>
