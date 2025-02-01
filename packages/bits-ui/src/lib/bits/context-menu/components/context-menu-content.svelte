<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ContextMenuContentProps } from "../types.js";
	import { CONTEXT_MENU_TRIGGER_ATTR, useMenuContent } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		id = useId(),
		child,
		children,
		ref = $bindable(null),
		loop = true,
		onInteractOutside = noop,
		preventScroll = true,
		// we need to explicitly pass this prop to the PopperLayer to override
		// the default menu behavior of handling outside interactions on the trigger
		onEscapeKeydown = noop,
		forceMount = false,
		...restProps
	}: ContextMenuContentProps = $props();

	let isMounted = $state(false);

	const contentState = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		isMounted: box.with(() => isMounted),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		contentState.parentMenu.onClose();
	}

	function isValidEvent(e: PointerEvent) {
		if ("button" in e && e.button === 2) {
			const target = e.target as HTMLElement;
			if (!target) return false;
			const isAnotherContextTrigger =
				target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`) !==
				contentState.parentMenu.triggerNode;
			return isAnotherContextTrigger;
		}
		return false;
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		side="right"
		sideOffset={2}
		align="start"
		enabled={contentState.parentMenu.open.current}
		{preventScroll}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		{isValidEvent}
		trapFocus
		{loop}
		{id}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("context-menu"),
			})}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
			<Mounted bind:isMounted />
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		side="right"
		sideOffset={2}
		align="start"
		present={contentState.parentMenu.open.current}
		{preventScroll}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		{isValidEvent}
		trapFocus
		{loop}
		{id}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("context-menu"),
			})}
			{#if child}
				{@render child({ props: finalProps, wrapperProps, ...contentState.snippetProps })}
			{:else}
				<div {...wrapperProps}>
					<div {...finalProps}>
						{@render children?.()}
					</div>
				</div>
			{/if}
			<Mounted bind:isMounted />
		{/snippet}
	</PopperLayer>
{/if}
