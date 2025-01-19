<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { untrack } from "svelte";
	import type { NavigationMenuContentProps } from "../types.js";
	import {
		NavigationMenuItemState,
		useNavigationMenuContentImpl,
	} from "../navigation-menu.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";
	import DismissibleLayer from "$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";

	let {
		ref = $bindable(null),
		id = useId(),
		child: _child,
		children: _childrenProp,
		onInteractOutside = noop,
		onFocusOutside = noop,
		onEscapeKeydown = noop,
		escapeKeydownBehavior = "close",
		interactOutsideBehavior = "close",
		itemState,
		onRefChange,
		...restProps
	}: NavigationMenuContentProps & {
		itemState?: NavigationMenuItemState;
		onRefChange?: (ref: HTMLElement | null) => void;
	} = $props();

	const contentImplState = useNavigationMenuContentImpl(
		{
			id: box.with(() => id),
			ref: box.with(
				() => ref,
				(v) => {
					ref = v;
					untrack(() => onRefChange?.(v));
				}
			),
		},
		itemState
	);

	const mergedProps = $derived(mergeProps(restProps, contentImplState.props));
</script>

<DismissibleLayer
	{id}
	enabled={true}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentImplState.onInteractOutside(e);
	}}
	onFocusOutside={(e) => {
		onFocusOutside(e);
		if (e.defaultPrevented) return;
		contentImplState.onFocusOutside(e);
	}}
	{interactOutsideBehavior}
>
	{#snippet children({ props: dismissibleProps })}
		<EscapeLayer
			enabled={true}
			onEscapeKeydown={(e) => {
				onEscapeKeydown(e);
				if (e.defaultPrevented) return;
				contentImplState.onEscapeKeydown(e);
			}}
			{escapeKeydownBehavior}
		>
			{@const finalProps = mergeProps(mergedProps, dismissibleProps)}
			{#if contentImplState.itemContext.contentChild.current}
				{@render contentImplState.itemContext.contentChild.current?.({ props: finalProps })}
			{:else}
				<div {...finalProps}>
					{@render contentImplState.itemContext.contentChildren.current?.()}
				</div>
			{/if}
		</EscapeLayer>
	{/snippet}
</DismissibleLayer>
