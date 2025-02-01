<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectContentStaticProps } from "../types.js";
	import { useSelectContent } from "../select.svelte.js";
	import PopperLayer from "$lib/bits/utilities/popper-layer/popper-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import PopperLayerForceMount from "$lib/bits/utilities/popper-layer/popper-layer-force-mount.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		onInteractOutside = noop,
		onEscapeKeydown = noop,
		children,
		child,
		...restProps
	}: SelectContentStaticProps = $props();

	const contentState = useSelectContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	function handleInteractOutside(e: PointerEvent) {
		contentState.handleInteractOutside(e);
		if (e.defaultPrevented) return;
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentState.root.handleClose();
	}

	function handleEscapeKeydown(e: KeyboardEvent) {
		onEscapeKeydown(e);
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
		onPlaced={() => (contentState.isPositioned = true)}
		forceMount={true}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style })}
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
		onInteractOutside={handleInteractOutside}
		onEscapeKeydown={handleEscapeKeydown}
		onOpenAutoFocus={(e) => e.preventDefault()}
		onCloseAutoFocus={(e) => e.preventDefault()}
		trapFocus={false}
		loop={false}
		preventScroll={false}
		onPlaced={() => (contentState.isPositioned = true)}
		forceMount={false}
	>
		{#snippet popper({ props })}
			{@const finalProps = mergeProps(props, { style: contentState.props.style })}
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
