<script lang="ts">
	import { onMountEffect } from "svelte-toolbelt";
	import { noop } from "$lib/internal/noop.js";

	let {
		isMounted = $bindable(false),
		onMountedChange = noop,
	}: { isMounted?: boolean; onMountedChange?: (mounted: boolean) => void } = $props();

	onMountEffect(() => {
		isMounted = true;
		onMountedChange(true);
		return () => {
			isMounted = false;
			onMountedChange(false);
		};
	});
</script>
