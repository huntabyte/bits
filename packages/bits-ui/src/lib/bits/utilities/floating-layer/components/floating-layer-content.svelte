<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useFloatingContentState } from "../use-floating-layer.svelte.js";
	import type { ContentImplProps } from "./index.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		content,
		side = "bottom",
		sideOffset = 0,
		align = "center",
		alignOffset = 0,
		id,
		arrowPadding = 0,
		avoidCollisions = true,
		collisionBoundary = [],
		collisionPadding = 0,
		hideWhenDetached = false,
		onPlaced = () => {},
		sticky = "partial",
		updatePositionStrategy = "optimized",
		strategy = "fixed",
		dir = "ltr",
		style = {},
		wrapperId = useId(),
		customAnchor = null,
	}: ContentImplProps = $props();

	const contentState = useFloatingContentState({
		side: box.with(() => side),
		sideOffset: box.with(() => sideOffset),
		align: box.with(() => align),
		alignOffset: box.with(() => alignOffset),
		id: box.with(() => id),
		arrowPadding: box.with(() => arrowPadding),
		avoidCollisions: box.with(() => avoidCollisions),
		collisionBoundary: box.with(() => collisionBoundary),
		collisionPadding: box.with(() => collisionPadding),
		hideWhenDetached: box.with(() => hideWhenDetached),
		onPlaced: box.with(() => onPlaced),
		sticky: box.with(() => sticky),
		updatePositionStrategy: box.with(() => updatePositionStrategy),
		strategy: box.with(() => strategy),
		dir: box.with(() => dir),
		style: box.with(() => style),
		enabled: box.with(() => false),
		wrapperId: box.with(() => wrapperId),
		customAnchor: box.with(() => customAnchor),
	});

	const mergedProps = $derived(
		mergeProps(contentState.wrapperProps, {
			style: {
				pointerEvents: "auto",
			},
		})
	);
</script>

{@render content?.({ props: contentState.props, wrapperProps: mergedProps })}
