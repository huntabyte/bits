<script lang="ts" module>
	export {
		a,
		blockquote,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		hr,
		img,
		li,
		ol,
		p,
		pre,
		table,
		td,
		th,
		tr,
		ul,
	} from "$lib/components/markdown/index.js";
</script>

<script lang="ts">
	let { title, description }: { title: string; description: string } = $props();
</script>

<slot {title} {description} />
