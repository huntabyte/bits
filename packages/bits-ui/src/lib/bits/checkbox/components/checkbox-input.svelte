<script lang="ts">
	import { useCheckboxInput } from "../checkbox.svelte.js";
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";

	const inputState = useCheckboxInput();
</script>

{#if inputState.shouldRender}
	<VisuallyHidden aria-hidden="true">
		<input {...inputState.props} type="checkbox" style="display: none !important;" />
	</VisuallyHidden>
{/if}
