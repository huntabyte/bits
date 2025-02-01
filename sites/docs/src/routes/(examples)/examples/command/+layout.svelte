<script lang="ts">
	import "$lib/styles/command/globals.pcss";
	import "$lib/styles/command/icons.pcss";
	import "$lib/styles/command/command.pcss";

	let { children } = $props();
</script>

{@render children?.()}
