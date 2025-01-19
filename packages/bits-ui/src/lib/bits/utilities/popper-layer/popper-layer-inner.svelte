<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import ScrollLock from "../scroll-lock/scroll-lock.svelte";
	import type { PopperLayerImplProps } from "./types.js";
	import PopperContent from "./popper-content.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import DismissibleLayer from "$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte";
	import TextSelectionLayer from "$lib/bits/utilities/text-selection-layer/text-selection-layer.svelte";
	import FocusScope from "$lib/bits/utilities/focus-scope/focus-scope.svelte";

	let {
		popper,
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
		enabled,
		...restProps
	}: Omit<PopperLayerImplProps, "present" | "children"> & {
		enabled: boolean;
	} = $props();
</script>

<PopperContent
	{isStatic}
	{id}
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
	{wrapperId}
	{style}
	{onPlaced}
	{customAnchor}
>
	{#snippet content({ props: floatingProps, wrapperProps })}
		{#if restProps.forceMount && enabled}
			<ScrollLock {preventScroll} />
		{:else if !restProps.forceMount}
			<ScrollLock {preventScroll} />
		{/if}
		<FocusScope
			{id}
			{onOpenAutoFocus}
			{onCloseAutoFocus}
			{loop}
			trapFocus={enabled && trapFocus}
			forceMount={restProps.forceMount}
		>
			{#snippet focusScope({ props: focusScopeProps })}
				<EscapeLayer {onEscapeKeydown} {escapeKeydownBehavior} {enabled}>
					<DismissibleLayer
						{id}
						{onInteractOutside}
						{onFocusOutside}
						{interactOutsideBehavior}
						{isValidEvent}
						{enabled}
					>
						{#snippet children({ props: dismissibleProps })}
							<TextSelectionLayer
								{id}
								{preventOverflowTextSelection}
								{onPointerDown}
								{onPointerUp}
								{enabled}
							>
								{@render popper?.({
									props: mergeProps(
										restProps,
										floatingProps,
										dismissibleProps,
										focusScopeProps,
										{
											style: {
												pointerEvents: "auto",
											},
										}
									),
									wrapperProps,
								})}
							</TextSelectionLayer>
						{/snippet}
					</DismissibleLayer>
				</EscapeLayer>
			{/snippet}
		</FocusScope>
	{/snippet}
</PopperContent>
