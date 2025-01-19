<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { children, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class="[&>h3]:step mb-12 ml-4 border-l pl-8 [counter-reset:step]" {...restProps}>
	{@render children?.()}
</div>
