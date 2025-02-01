<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuRootProps } from "../types.js";
	import { useNavigationMenuRoot } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = noop,
		delayDuration = 200,
		skipDelayDuration = 300,
		dir = "ltr",
		orientation = "horizontal",
		controlledValue = false,
		...restProps
	}: NavigationMenuRootProps = $props();

	const rootState = useNavigationMenuRoot({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				rootState.handleValueChange(v);
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange(v);
				}
			}
		),
		delayDuration: box.with(() => delayDuration),
		skipDelayDuration: box.with(() => skipDelayDuration),
		dir: box.with(() => dir),
		orientation: box.with(() => orientation),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps({ "aria-label": "main" }, restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<nav {...mergedProps}>
		{@render children?.()}
	</nav>
{/if}
