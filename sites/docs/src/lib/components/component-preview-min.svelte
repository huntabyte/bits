<script lang="ts">
	import type { Snippet } from "svelte";
	import { Collapsible } from "bits-ui";
	import DemoContainer from "./demo-container.svelte";
	import DemoCodeContainer from "./demo-code-container.svelte";

	type Props = {
		preview: Snippet;
		children: Snippet;
		class?: string;
	};

	let { preview, children, class: className }: Props = $props();
</script>

<DemoContainer>
	{@render preview?.()}
</DemoContainer>
<Collapsible.Root>
	<Collapsible.Trigger>Show code</Collapsible.Trigger>
	<Collapsible.Content>
		<DemoCodeContainer class={className}>
			{@render children?.()}
		</DemoCodeContainer>
	</Collapsible.Content>
</Collapsible.Root>
