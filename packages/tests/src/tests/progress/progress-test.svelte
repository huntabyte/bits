<script lang="ts">
	import { Progress } from "bits-ui";

	let { value = 0, ...restProps }: Progress.RootProps = $props();
</script>

<main>
	<Progress.Root aria-label="progress" data-testid="root" {value} {...restProps} />
	<button data-testid="binding" onclick={() => (value = 50)}>{value}</button>
</main>
