<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PopoverContentStaticProps } from "../types.js";
	import { usePopoverContent } from "../popover.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		forceMount = false,
		onCloseAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		trapFocus = true,
		preventScroll = false,

		...restProps
	}: PopoverContentStaticProps = $props();

	const contentState = usePopoverContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: box.with(() => onInteractOutside),
		onEscapeKeydown: box.with(() => onEscapeKeydown),
		onCloseAutoFocus: box.with(() => onCloseAutoFocus),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		isStatic
		enabled={contentState.root.open.current}
		{id}
		onInteractOutside={contentState.handleInteractOutside}
		onEscapeKeydown={contentState.handleEscapeKeydown}
		onCloseAutoFocus={contentState.handleCloseAutoFocus}
		{trapFocus}
		{preventScroll}
		loop
		forceMount={true}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("popover"),
			})}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayerForceMount>
{:else if !forceMount}
	<PopperLayer
		{...mergedProps}
		isStatic
		present={contentState.root.open.current}
		{id}
		onInteractOutside={contentState.handleInteractOutside}
		onEscapeKeydown={contentState.handleEscapeKeydown}
		onCloseAutoFocus={contentState.handleCloseAutoFocus}
		{trapFocus}
		{preventScroll}
		loop
		forceMount={false}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, {
				style: getFloatingContentCSSVars("popover"),
			})}
			{#if child}
				{@render child({ props: finalProps, ...contentState.snippetProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
