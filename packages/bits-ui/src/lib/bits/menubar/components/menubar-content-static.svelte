<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenubarContentStaticProps } from "../types.js";
	import { useMenubarContent } from "../menubar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import MenuContentStatic from "$lib/bits/menu/components/menu-content-static.svelte";

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = useId(),
		...restProps
	}: MenubarContentStaticProps = $props();

	const contentState = useMenubarContent({
		id: box.with(() => id),
		interactOutsideBehavior: box.with(() => interactOutsideBehavior),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<MenuContentStatic
	bind:ref
	{...mergedProps}
	preventScroll={false}
	onInteractOutside={contentState.onInteractOutside}
	onFocusOutside={contentState.onFocusOutside}
	onCloseAutoFocus={contentState.onCloseAutoFocus}
	onOpenAutoFocus={contentState.onOpenAutoFocus}
/>
