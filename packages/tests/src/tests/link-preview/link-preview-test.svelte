<script lang="ts" module>
	import { LinkPreview, type WithoutChildrenOrChild } from "bits-ui";
	export type LinkPreviewTestProps = LinkPreview.RootProps & {
		contentProps?: WithoutChildrenOrChild<LinkPreview.ContentProps>;
		portalProps?: WithoutChildrenOrChild<LinkPreview.PortalProps>;
	};
</script>

<script lang="ts">
	let { open = false, contentProps, portalProps, ...restProps }: LinkPreviewTestProps = $props();
</script>

<main data-testid="main">
	<LinkPreview.Root bind:open {...restProps} openDelay={50} closeDelay={50}>
		<LinkPreview.Trigger
			data-testid="trigger"
			href="https://github.com/sveltejs"
			target="_blank"
			rel="noreferrer noopener"
		>
			@sveltejs
		</LinkPreview.Trigger>
		<LinkPreview.Portal {...portalProps}>
			<LinkPreview.Content data-testid="content" class="w-80" {...contentProps}>
				Content
			</LinkPreview.Content>
		</LinkPreview.Portal>
	</LinkPreview.Root>
	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<div data-testid="outside">outside</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
