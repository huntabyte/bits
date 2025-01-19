<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useCommandLabel } from "../command.svelte.js";
	import {
		type BitsPrimitiveLabelAttributes,
		type WithElementRef,
		mergeProps,
		useId,
	} from "$lib/shared/index.js";
	import type { WithChildren } from "$lib/internal/types.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		...restProps
	}: WithChildren<WithElementRef<BitsPrimitiveLabelAttributes>> = $props();

	const labelState = useCommandLabel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

<label {...mergedProps}>
	{@render children?.()}
</label>
