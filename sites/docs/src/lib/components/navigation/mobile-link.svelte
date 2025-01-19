<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { page } from "$app/stores";
	import { cn } from "$lib/utils/index.js";

	let {
		onClose,
		href = "#",
		children,
		class: className,
		...restProps
	}: HTMLAnchorAttributes & { onClose?: () => void } = $props();
</script>

<a
	{href}
	onclick={onClose}
	class={cn($page.url.pathname === href ? "text-foreground" : "text-foreground/60", className)}
	{...restProps}
>
	{@render children?.()}
</a>
