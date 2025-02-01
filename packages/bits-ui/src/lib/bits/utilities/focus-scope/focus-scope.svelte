<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { FocusScopeImplProps } from "./types.js";
	import { useFocusScope } from "./use-focus-scope.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id,
		trapFocus = false,
		loop = false,
		onCloseAutoFocus = noop,
		onOpenAutoFocus = noop,
		focusScope,
		forceMount = false,
	}: FocusScopeImplProps = $props();

	const focusScopeState = useFocusScope({
		enabled: box.with(() => trapFocus),
		loop: box.with(() => loop),
		onCloseAutoFocus: box.with(() => onCloseAutoFocus),
		onOpenAutoFocus: box.with(() => onOpenAutoFocus),
		id: box.with(() => id),
		forceMount: box.with(() => forceMount),
	});
</script>

{@render focusScope?.({ props: focusScopeState.props })}
