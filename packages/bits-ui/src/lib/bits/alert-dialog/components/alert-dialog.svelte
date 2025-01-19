<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { AlertDialogRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { useDialogRoot } from "$lib/bits/dialog/dialog.svelte.js";

	let { open = $bindable(false), onOpenChange = noop, children }: AlertDialogRootProps = $props();

	useDialogRoot({
		variant: box.with(() => "alert-dialog"),
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
