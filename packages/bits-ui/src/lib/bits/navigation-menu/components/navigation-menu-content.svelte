<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuContentProps } from "../types.js";
	import { useNavigationMenuContent } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import DismissibleLayer from "$lib/bits/utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	let {
		children: contentChildren,
		child,
		ref = $bindable(null),
		id = useId(),
		forceMount = false,
		onEscapeKeydown,
		onInteractOutside,
		onFocusOutside,
		...restProps
	}: NavigationMenuContentProps = $props();

	let isMounted = $state(false);

	const contentState = useNavigationMenuContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => {
				ref = v;
			}
		),
		forceMount: box.with(() => forceMount),
		isMounted: box.with(() => isMounted),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
	const portalDisabled = $derived(!contentState.menu.viewportNode);
</script>

<Portal to={contentState.menu.viewportNode ?? undefined} disabled={portalDisabled}>
	<PresenceLayer {id} present={contentState.isPresent}>
		{#snippet presence()}
			<EscapeLayer
				enabled={contentState.isPresent}
				onEscapeKeydown={(e) => {
					onEscapeKeydown?.(e);
					if (e.defaultPrevented) return;
					contentState.onEscapeKeydown(e);
				}}
			>
				<DismissibleLayer
					enabled={contentState.isPresent}
					{id}
					onInteractOutside={(e) => {
						onInteractOutside?.(e);
						if (e.defaultPrevented) return;
						contentState.onInteractOutside(e);
					}}
					onFocusOutside={(e) => {
						onFocusOutside?.(e);
						if (e.defaultPrevented) return;
						contentState.onFocusOutside(e);
					}}
				>
					{#snippet children({ props: dismissibleProps })}
						{#if child}
							<Mounted bind:isMounted />
							{@render child({ props: mergeProps(dismissibleProps, mergedProps) })}
						{:else}
							<Mounted bind:isMounted />
							<div {...mergeProps(dismissibleProps, mergedProps)}>
								{@render contentChildren?.()}
							</div>
						{/if}
					{/snippet}
				</DismissibleLayer>
			</EscapeLayer>
		{/snippet}
	</PresenceLayer>
</Portal>
