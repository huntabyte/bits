<script lang="ts">
	import { useRadioGroupInput } from "../radio-group.svelte.js";

	const inputState = useRadioGroupInput();
</script>

{#if inputState.shouldRender}
	<input {...inputState.props} />
{/if}
