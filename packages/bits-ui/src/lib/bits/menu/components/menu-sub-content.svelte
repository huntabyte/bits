<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuSubContentProps } from "../types.js";
	import { MenuOpenEvent, useMenuContent } from "../menu.svelte.js";
	import { SUB_CLOSE_KEYS } from "../utils.js";
	import { useId } from "$lib/internal/use-id.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { isHTMLElement } from "$lib/internal/is.js";
	import Mounted from "$lib/bits/utilities/mounted.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		loop = true,
		onInteractOutside = noop,
		forceMount = false,
		onEscapeKeydown = noop,
		interactOutsideBehavior = "defer-otherwise-close",
		escapeKeydownBehavior = "defer-otherwise-close",
		onOpenAutoFocus: onOpenAutoFocusProp = noop,
		onCloseAutoFocus: onCloseAutoFocusProp = noop,
		onFocusOutside = noop,
		side = "right",
		...restProps
	}: MenuSubContentProps = $props();

	let isMounted = $state(false);

	const subContentState = useMenuContent({
		id: box.with(() => id),
		loop: box.with(() => loop),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		isMounted: box.with(() => isMounted),
	});

	function onkeydown(e: KeyboardEvent) {
		const isKeyDownInside = (e.currentTarget as HTMLElement).contains(e.target as HTMLElement);
		const isCloseKey = SUB_CLOSE_KEYS[subContentState.parentMenu.root.dir.current].includes(
			e.key
		);
		if (isKeyDownInside && isCloseKey) {
			subContentState.parentMenu.onClose();
			const triggerNode = subContentState.parentMenu.triggerNode;
			triggerNode?.focus();
			e.preventDefault();
		}
	}

	const dataAttr = $derived(subContentState.parentMenu.root.getAttr("sub-content"));

	const mergedProps = $derived(
		mergeProps(restProps, subContentState.props, {
			side,
			onkeydown,
			[dataAttr]: "",
		})
	);

	function handleOpenAutoFocus(e: Event) {
		onOpenAutoFocusProp(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		if (
			subContentState.parentMenu.root.isUsingKeyboard &&
			subContentState.parentMenu.contentNode
		) {
			MenuOpenEvent.dispatch(subContentState.parentMenu.contentNode);
		}
	}

	function handleCloseAutoFocus(e: Event) {
		onCloseAutoFocusProp(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
	}

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		subContentState.parentMenu.onClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
		if (e.defaultPrevented) return;
		subContentState.parentMenu.onClose();
	}

	function handleOnFocusOutside(e: FocusEvent) {
		onFocusOutside(e);
		if (e.defaultPrevented) return;
		// We prevent closing when the trigger is focused to avoid triggering a re-open animation
		// on pointer interaction.
		if (!isHTMLElement(e.target)) return;
		if (e.target.id !== subContentState.parentMenu.triggerNode?.id) {
			subContentState.parentMenu.onClose();
		}
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		{interactOutsideBehavior}
		{escapeKeydownBehavior}
		onCloseAutoFocus={handleCloseAutoFocus}
		onOpenAutoFocus={handleOpenAutoFocus}
		enabled={subContentState.parentMenu.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		onFocusOutside={handleOnFocusOutside}
		preventScroll={false}
		{loop}
		trapFocus={false}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, mergedProps, {
				style: getFloatingContentCSSVars("menu"),
			})}
			{#if child}
				{@render child({
					props: finalProps,
					wrapperProps,
					...subContentState.snippetProps,
				})}
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
		{interactOutsideBehavior}
		{escapeKeydownBehavior}
		onCloseAutoFocus={handleCloseAutoFocus}
		onOpenAutoFocus={handleOpenAutoFocus}
		present={subContentState.parentMenu.open.current}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		onFocusOutside={handleOnFocusOutside}
		preventScroll={false}
		{loop}
		trapFocus={false}
	>
		{#snippet popper({ props, wrapperProps })}
			{@const finalProps = mergeProps(props, mergedProps, {
				style: getFloatingContentCSSVars("menu"),
			})}
			{#if child}
				{@render child({
					props: finalProps,
					wrapperProps,
					...subContentState.snippetProps,
				})}
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
