<script lang="ts">
	import { useSwitchInput } from "../switch.svelte.js";

	const inputState = useSwitchInput();
</script>

{#if inputState.shouldRender}
	<input {...inputState.props} />
{/if}
