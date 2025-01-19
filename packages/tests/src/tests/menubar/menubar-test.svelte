<script lang="ts">
	import { Menubar } from "bits-ui";
	import MenubarMenu from "./menubar-menu-test.svelte";

	let restProps: Menubar.RootProps = $props();
</script>

<main>
	<Menubar.Root {...restProps} data-testid="root">
		<MenubarMenu id="1" />
		<MenubarMenu id="2" />
		<MenubarMenu id="3" />
		<MenubarMenu id="4" />
	</Menubar.Root>
</main>
