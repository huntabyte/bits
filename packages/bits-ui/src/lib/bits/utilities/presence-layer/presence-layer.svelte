<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { PresenceLayerImplProps } from "./types.js";
	import { usePresence } from "$lib/bits/utilities/presence-layer/use-presence.svelte.js";

	let { present, forceMount, presence, id }: PresenceLayerImplProps = $props();

	const isPresent = usePresence(
		box.with(() => present),
		box.with(() => id)
	);
</script>

{#if forceMount || present || isPresent.current}
	{@render presence?.({ present: isPresent })}
{/if}
