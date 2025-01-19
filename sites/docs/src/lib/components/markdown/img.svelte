<script lang="ts">
	import type { HTMLImgAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	let { class: className, src, alt, ...restProps }: HTMLImgAttributes = $props();
</script>

<img {src} {alt} class={cn("rounded-md", className)} {...restProps} />
