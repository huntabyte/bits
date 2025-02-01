<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TooltipContentStaticProps } from "../types.js";
	import { useTooltipContent } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { getFloatingContentCSSVars } from "$lib/internal/floating-svelte/floating-utils.svelte.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),

		onInteractOutside,
		onEscapeKeydown,
		forceMount = false,
		...restProps
	}: TooltipContentStaticProps = $props();

	const contentState = useTooltipContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	function handleInteractOutside(e: PointerEvent) {
		onInteractOutside?.(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown?.(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}
</script>

{#if forceMount}
	<PopperLayerForceMount
		{...mergedProps}
		isStatic
		enabled={contentState.root.open.current}
		{id}
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		onOpenAutoFocus={(e) => e.preventDefault()}
		onCloseAutoFocus={(e) => e.preventDefault()}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={true}
	>
		{#snippet popper({ props })}
			{@const mergedProps = mergeProps(props, {
				style: getFloatingContentCSSVars("tooltip"),
			})}
			{#if child}
				{@render child({ props: mergedProps, ...contentState.snippetProps })}
			{:else}
				<div {...mergedProps}>
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
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		onOpenAutoFocus={(e) => e.preventDefault()}
		onCloseAutoFocus={(e) => e.preventDefault()}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		forceMount={false}
	>
		{#snippet popper({ props })}
			{@const mergedProps = mergeProps(props, {
				style: getFloatingContentCSSVars("tooltip"),
			})}
			{#if child}
				{@render child({ props: mergedProps, ...contentState.snippetProps })}
			{:else}
				<div {...mergedProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PopperLayer>
{/if}
