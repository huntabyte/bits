<script lang="ts">
	import { getAllContexts, mount, unmount } from "svelte";
	import { DEV } from "esm-env";
	import { watch } from "runed";
	import PortalConsumer from "./portal-consumer.svelte";
	import type { PortalProps } from "./types.js";
	import { isBrowser } from "$lib/internal/is.js";

	let { to = "body", children, disabled }: PortalProps = $props();

	const context = getAllContexts();

	let target = $derived(getTarget());

	function getTarget() {
		if (!isBrowser || disabled) return null;
		let localTarget: HTMLElement | null | DocumentFragment | Element = null;
		if (typeof to === "string") {
			localTarget = document.querySelector(to);
			if (localTarget === null) {
				if (DEV) {
					throw new Error(`Target element "${to}" not found.`);
				}
			}
		} else if (to instanceof HTMLElement || to instanceof DocumentFragment) {
			localTarget = to;
		} else {
			if (DEV) {
				throw new TypeError(
					`Unknown portal target type: ${
						to === null ? "null" : typeof to
					}. Allowed types: string (query selector), HTMLElement, or DocumentFragment.`
				);
			}
		}

		return localTarget;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let instance: any;

	function unmountInstance() {
		if (instance) {
			unmount(instance);
			instance = null;
		}
	}

	watch([() => target, () => disabled], ([target, disabled]) => {
		if (!target || disabled) {
			unmountInstance();
			return;
		}
		instance = mount(PortalConsumer, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			target: target as any,
			props: { children },
			context,
		});

		return () => {
			unmountInstance();
		};
	});
</script>

{#if disabled}
	{@render children?.()}
{/if}
