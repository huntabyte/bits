<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SwitchThumbProps } from "../types.js";
	import { useSwitchThumb } from "../switch.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: SwitchThumbProps = $props();

	const thumbState = useSwitchThumb({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, thumbState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, checked: thumbState.root.checked.current })}
{:else}
	<span {...mergedProps}>
		{@render children?.({ checked: thumbState.root.checked.current })}
	</span>
{/if}
