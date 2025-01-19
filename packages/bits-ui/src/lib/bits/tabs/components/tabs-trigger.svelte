<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TabsTriggerProps } from "../types.js";
	import { useTabsTrigger } from "../tabs.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		disabled = false,
		id = useId(),
		type = "button",
		value,
		ref = $bindable(null),
		...restProps
	}: TabsTriggerProps = $props();

	const triggerState = useTabsTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		value: box.with(() => value),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
