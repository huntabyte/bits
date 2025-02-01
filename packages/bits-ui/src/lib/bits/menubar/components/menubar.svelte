<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenubarRootProps } from "../types.js";
	import { useMenubarRoot } from "../menubar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		children,
		child,
		ref = $bindable(null),
		value = "",
		dir = "ltr",
		loop = true,
		onValueChange = noop,
		...restProps
	}: MenubarRootProps = $props();

	const rootState = useMenubarRoot({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange?.(v);
			}
		),
		dir: box.with(() => dir),
		loop: box.with(() => loop),
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
