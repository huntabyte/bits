<script lang="ts">
	import { Toaster } from "svelte-sonner";
	import { ModeWatcher } from "mode-watcher";
	import Metadata from "$lib/components/metadata.svelte";
	import "$lib/styles/app.postcss";

	let { children } = $props();
</script>

<ModeWatcher />
<Metadata />
<Toaster position="top-right" />

{@render children()}
