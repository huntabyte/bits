<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CheckboxGroupLabelProps } from "../types.js";
	import { useCheckboxGroupLabel } from "../checkbox.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		child,
		children,
		...restProps
	}: CheckboxGroupLabelProps = $props();

	const labelState = useCheckboxGroupLabel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
