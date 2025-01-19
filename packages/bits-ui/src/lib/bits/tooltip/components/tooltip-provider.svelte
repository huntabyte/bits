<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TooltipProviderProps } from "../types.js";
	import { useTooltipProvider } from "../tooltip.svelte.js";

	let {
		children,
		delayDuration = 700,
		disableCloseOnTriggerClick = false,
		disableHoverableContent = false,
		disabled = false,
		ignoreNonKeyboardFocus = false,
		skipDelayDuration = 300,
	}: TooltipProviderProps = $props();

	useTooltipProvider({
		delayDuration: box.with(() => delayDuration),
		disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick),
		disableHoverableContent: box.with(() => disableHoverableContent),
		disabled: box.with(() => disabled),
		ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus),
		skipDelayDuration: box.with(() => skipDelayDuration),
	});
</script>

{@render children?.()}
