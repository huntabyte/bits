<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandInputProps } from "../types.js";
	import { useCommandInput } from "../command.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		value = $bindable(""),
		autofocus = false,
		id = useId(),
		ref = $bindable(null),
		child,
		...restProps
	}: CommandInputProps = $props();

	const inputState = useCommandInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				value = v;
			}
		),
		autofocus: box.with(() => autofocus ?? false),
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<input {...mergedProps} bind:value />
{/if}
