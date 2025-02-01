<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogRoot } from "../dialog.svelte.js";
	import type { DialogRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";

	let { open = $bindable(false), onOpenChange = noop, children }: DialogRootProps = $props();

	useDialogRoot({
		variant: box.with(() => "dialog"),
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
	});
</script>

{@render children?.()}
