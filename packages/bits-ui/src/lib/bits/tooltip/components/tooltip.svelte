<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TooltipRootProps } from "../types.js";
	import { useTooltipRoot } from "../tooltip.svelte.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/noop.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		disabled,
		delayDuration,
		disableCloseOnTriggerClick,
		disableHoverableContent,
		ignoreNonKeyboardFocus,
		children,
	}: TooltipRootProps = $props();

	useTooltipRoot({
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		delayDuration: box.with(() => delayDuration),
		disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick),
		disableHoverableContent: box.with(() => disableHoverableContent),
		ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus),
		disabled: box.with(() => disabled),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
