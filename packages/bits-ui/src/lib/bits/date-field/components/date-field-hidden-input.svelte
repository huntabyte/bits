<script lang="ts">
	import { useDateFieldHiddenInput } from "../date-field.svelte.js";
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";

	const hiddenInputState = useDateFieldHiddenInput();
</script>

{#if hiddenInputState.shouldRender}
	<VisuallyHidden>
		{#snippet child({ props })}
			<input {...props} {...hiddenInputState.props} />
		{/snippet}
	</VisuallyHidden>
{/if}
