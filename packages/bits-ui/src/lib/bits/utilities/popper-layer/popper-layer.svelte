<script lang="ts">
	import type { PopperLayerImplProps } from "./types.js";
	import PopperLayerInner from "./popper-layer-inner.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		popper,
		present,
		onEscapeKeydown,
		escapeKeydownBehavior,
		preventOverflowTextSelection,
		id,
		onPointerDown,
		onPointerUp,
		side,
		sideOffset,
		align,
		alignOffset,
		arrowPadding,
		avoidCollisions,
		collisionBoundary,
		collisionPadding,
		sticky,
		hideWhenDetached,
		updatePositionStrategy,
		strategy,
		dir,
		preventScroll,
		wrapperId,
		style,
		onPlaced,
		onInteractOutside,
		onCloseAutoFocus,
		onOpenAutoFocus,
		onFocusOutside,
		interactOutsideBehavior = "close",
		loop,
		trapFocus = true,
		isValidEvent = () => false,
		customAnchor = null,
		isStatic = false,
		...restProps
	}: PopperLayerImplProps = $props();
</script>

<PresenceLayer {id} {present} {...restProps}>
	{#snippet presence({ present })}
		<PopperLayerInner
			{popper}
			{onEscapeKeydown}
			{escapeKeydownBehavior}
			{preventOverflowTextSelection}
			{id}
			{onPointerDown}
			{onPointerUp}
			{side}
			{sideOffset}
			{align}
			{alignOffset}
			{arrowPadding}
			{avoidCollisions}
			{collisionBoundary}
			{collisionPadding}
			{sticky}
			{hideWhenDetached}
			{updatePositionStrategy}
			{strategy}
			{dir}
			{preventScroll}
			{wrapperId}
			{style}
			{onPlaced}
			{customAnchor}
			{isStatic}
			enabled={present.current}
			{onInteractOutside}
			{onCloseAutoFocus}
			{onOpenAutoFocus}
			{interactOutsideBehavior}
			{loop}
			{trapFocus}
			{isValidEvent}
			{onFocusOutside}
			forceMount={false}
			{...restProps}
		/>
	{/snippet}
</PresenceLayer>
