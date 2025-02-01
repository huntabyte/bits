<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TabsRootProps } from "../types.js";
	import { useTabsRoot } from "../tabs.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = noop,
		orientation = "horizontal",
		loop = true,
		activationMode = "automatic",
		disabled = false,
		children,
		child,
		...restProps
	}: TabsRootProps = $props();

	const rootState = useTabsRoot({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		orientation: box.with(() => orientation),
		loop: box.with(() => loop),
		activationMode: box.with(() => activationMode),
		disabled: box.with(() => disabled),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
