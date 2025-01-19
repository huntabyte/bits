<script lang="ts" module>
	import { Dialog, type WithoutChildrenOrChild } from "bits-ui";
	export type DialogTestProps = Dialog.RootProps & {
		contentProps?: Omit<Dialog.ContentProps, "asChild" | "child" | "children">;
		portalProps?: Dialog.PortalProps;
		titleProps?: WithoutChildrenOrChild<Dialog.TitleProps>;
		descriptionProps?: WithoutChildrenOrChild<Dialog.DescriptionProps>;
	};
</script>

<script lang="ts">
	import { useId } from "bits-ui";

	let {
		open = false,
		contentProps = {},
		portalProps = {},
		titleProps = {},
		descriptionProps = {},
		...restProps
	}: DialogTestProps = $props();

	let descriptionId = $state<string>(descriptionProps.id ?? useId());
</script>

<main>
	<Dialog.Root bind:open {...restProps}>
		<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
		<Dialog.Portal {...portalProps}>
			<Dialog.Overlay
				data-testid="overlay"
				class="fixed inset-0 h-[100vh] w-[100vw] bg-black"
			/>
			<Dialog.Content
				{...contentProps}
				data-testid="content"
				class="tranlate-x-[50%] fixed left-[50%] top-[50%] translate-y-[50%] bg-white p-1"
			>
				<Dialog.Title {...titleProps} data-testid="title">title</Dialog.Title>
				<Dialog.Description
					{...descriptionProps}
					id={descriptionId}
					data-testid="description"
				>
					description
				</Dialog.Description>
				<Dialog.Close data-testid="close">close</Dialog.Close>
				<button data-testid="update-id" onclick={() => (descriptionId = "new-id")}
					>Reactively update description id</button
				>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	<p data-testid="binding">{open}</p>
	<button data-testid="toggle" onclick={() => (open = !open)}>toggle</button>
	<div id="portalTarget" data-testid="portalTarget"></div>
</main>
