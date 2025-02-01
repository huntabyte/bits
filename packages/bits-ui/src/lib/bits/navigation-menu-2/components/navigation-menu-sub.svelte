<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuSubProps } from "../types.js";
	import { useNavigationMenuSub } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = noop,
		orientation = "horizontal",
		controlledValue = false,
		...restProps
	}: NavigationMenuSubProps = $props();

	const rootState = useNavigationMenuSub({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange(v);
				}
			}
		),
		orientation: box.with(() => orientation),
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
