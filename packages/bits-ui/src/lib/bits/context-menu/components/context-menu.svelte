<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContextMenuRootProps } from "../types.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { useMenuMenu, useMenuRoot } from "$lib/bits/menu/menu.svelte.js";

	let {
		open = $bindable(false),
		dir = "ltr",
		onOpenChange = noop,
		children,
	}: ContextMenuRootProps = $props();

	const root = useMenuRoot({
		variant: box.with(() => "context-menu"),
		dir: box.with(() => dir),
		onClose: () => {
			open = false;
			onOpenChange?.(false);
		},
	});

	useMenuMenu(root, {
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
