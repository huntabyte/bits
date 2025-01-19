<script lang="ts">
	import { IsMounted } from "runed";
	import { box, mergeProps } from "svelte-toolbelt";
	import { useScrollAreaScrollbarX } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarShared from "./scroll-area-scrollbar-shared.svelte";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const isMounted = new IsMounted();

	const scrollbarXState = useScrollAreaScrollbarX({
		mounted: box.with(() => isMounted.current),
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const mergedProps = $derived(mergeProps(restProps, scrollbarXState.props)) as any;
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
