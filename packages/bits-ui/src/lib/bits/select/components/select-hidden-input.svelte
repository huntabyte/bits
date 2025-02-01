<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSelectHiddenInput } from "../select.svelte.js";
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";

	type Props = {
		value?: string;
	};

	let { value = $bindable("") }: Props = $props();

	const hiddenInputState = useSelectHiddenInput({
		value: box.with(() => value),
	});
</script>

<VisuallyHidden>
	{#if hiddenInputState.shouldRender}
		<input {...hiddenInputState.props} bind:value />
	{/if}
</VisuallyHidden>
