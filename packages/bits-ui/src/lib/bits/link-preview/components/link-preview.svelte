<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { LinkPreviewRootProps } from "../types.js";
	import { useLinkPreviewRoot } from "../link-preview.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		openDelay = 700,
		closeDelay = 300,
		children,
	}: LinkPreviewRootProps = $props();

	useLinkPreviewRoot({
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		openDelay: box.with(() => openDelay),
		closeDelay: box.with(() => closeDelay),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
