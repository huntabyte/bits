<script lang="ts">
	import type { ButtonRootProps } from "../types.js";

	let {
		href,
		type,
		children,
		disabled = false,
		ref = $bindable(),
		...restProps
	}: ButtonRootProps = $props();
</script>

<svelte:element
	this={href ? "a" : "button"}
	type={href ? undefined : type}
	href={href && !disabled ? href : undefined}
	disabled={href ? undefined : disabled}
	aria-disabled={href ? disabled : undefined}
	role={href && disabled ? "link" : undefined}
	tabindex={href && disabled ? -1 : 0}
	bind:this={ref}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
