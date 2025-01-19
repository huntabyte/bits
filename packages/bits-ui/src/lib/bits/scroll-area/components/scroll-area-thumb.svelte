<script lang="ts">
	import type { ScrollAreaThumbProps } from "../types.js";
	import { ScrollAreaScrollbarVisibleContext } from "../scroll-area.svelte.js";
	import ScrollAreaThumbImpl from "./scroll-area-thumb-impl.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		...restProps
	}: ScrollAreaThumbProps = $props();

	const scrollbarState = ScrollAreaScrollbarVisibleContext.get();
</script>

<PresenceLayer present={forceMount || scrollbarState.hasThumb} {...restProps} {id}>
	{#snippet presence({ present })}
		<ScrollAreaThumbImpl {...restProps} {id} bind:ref present={present.current} />
	{/snippet}
</PresenceLayer>
