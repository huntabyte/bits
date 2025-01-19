<script lang="ts">
	import { Separator } from "bits-ui";

	let { ...restProps }: Separator.RootProps = $props();
</script>

<main>
	<Separator.Root data-testid="root" {...restProps} />
</main>
