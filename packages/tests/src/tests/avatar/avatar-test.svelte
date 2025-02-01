<script lang="ts">
	import { Avatar } from "bits-ui";
	let { src }: { src: string } = $props();
</script>

<main>
	<Avatar.Root data-testid="root">
		<Avatar.Image {src} alt="huntabyte" data-testid="image" />
		<Avatar.Fallback data-testid="fallback">HJ</Avatar.Fallback>
	</Avatar.Root>

	<button onclick={() => (src = "")} data-testid="clear-button">clear src</button>
</main>
