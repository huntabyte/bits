<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ToolbarButtonProps } from "../types.js";
	import { useToolbarButton } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		disabled = false,
		type = "button",
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: ToolbarButtonProps = $props();

	const buttonState = useToolbarButton({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, buttonState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
