<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import type { VisuallyHiddenProps } from "./types.js";
	import type { StyleProperties } from "$lib/shared/index.js";

	let { children, child, ...restProps }: VisuallyHiddenProps = $props();

	const style: StyleProperties = {
		position: "absolute",
		border: 0,
		width: "1px",
		display: "inline-block",
		height: "1px",
		padding: 0,
		margin: "-1px",
		overflow: "hidden",
		clip: "rect(0 0 0 0)",
		whiteSpace: "nowrap",
		wordWrap: "normal",
	};

	const mergedProps = $derived(mergeProps(restProps, { style }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
