<script lang="ts">
	import type { ScrollLockProps } from "./index.js";
	import { useBodyScrollLock } from "$lib/internal/use-body-scroll-lock.svelte.js";

	let { preventScroll = true, restoreScrollDelay = null }: ScrollLockProps = $props();

	useBodyScrollLock(preventScroll, () => restoreScrollDelay);
</script>
