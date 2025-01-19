<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { MenubarMenuProps } from "../types.js";
	import { useMenubarMenu } from "../menubar.svelte.js";
	import Menu from "$lib/bits/menu/components/menu.svelte";
	import { useId } from "$lib/internal/use-id.js";

	let { value = useId(), ...restProps }: MenubarMenuProps = $props();

	const menuState = useMenubarMenu({
		value: box.with(() => value),
	});
</script>

<Menu
	open={menuState.open}
	onOpenChange={(open) => {
		if (!open) menuState.root.onMenuClose();
	}}
	dir={menuState.root.dir.current}
	_internal_variant="menubar"
	{...restProps}
/>
