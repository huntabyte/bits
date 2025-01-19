<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useDateFieldInput } from "../date-field.svelte.js";
	import type { DateFieldInputProps } from "../types.js";
	import DateFieldHiddenInput from "./date-field-hidden-input.svelte";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		name = "",
		children,
		child,
		...restProps
	}: DateFieldInputProps = $props();

	const inputState = useDateFieldInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		name: box.with(() => name),
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, segments: inputState.root.segmentContents })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ segments: inputState.root.segmentContents })}
	</div>
{/if}

<DateFieldHiddenInput />
