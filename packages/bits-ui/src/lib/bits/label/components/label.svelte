<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { LabelRootProps } from "../types.js";
	import { setLabelRootState } from "../label.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		for: forProp,
		...restProps
	}: LabelRootProps = $props();

	const rootState = setLabelRootState({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, rootState.props, { for: forProp }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<label {...mergedProps} for={forProp}>
		{@render children?.()}
	</label>
{/if}
