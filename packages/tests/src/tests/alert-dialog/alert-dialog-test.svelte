<script lang="ts" module>
	import { AlertDialog, type WithoutChildrenOrChild } from "bits-ui";
	export type AlertDialogTestProps = AlertDialog.RootProps & {
		contentProps?: Omit<AlertDialog.ContentProps, "asChild" | "child" | "children">;
		portalProps?: AlertDialog.PortalProps;
		titleProps?: WithoutChildrenOrChild<AlertDialog.TitleProps>;
		descriptionProps?: WithoutChildrenOrChild<AlertDialog.DescriptionProps>;
	};
</script>

<script lang="ts">
	let {
		open = false,
		contentProps = {},
		portalProps = {},
		titleProps = {},
		descriptionProps = {},
		...restProps
	}: AlertDialogTestProps = $props();
</script>

<main>
	<AlertDialog.Root bind:open {...restProps}>
		<AlertDialog.Trigger data-testid="trigger">open</AlertDialog.Trigger>
		<AlertDialog.Portal {...portalProps}>
			<AlertDialog.Overlay
				data-testid="overlay"
				class="fixed inset-0 h-[100vh] w-[100vw] bg-black"
			/>
			<AlertDialog.Content
				{...contentProps}
				data-testid="content"
				class="tranlate-x-[50%] fixed left-[50%] top-[50%] translate-y-[50%] bg-white p-1"
			>
				<AlertDialog.Title {...titleProps} data-testid="title">title</AlertDialog.Title>
				<AlertDialog.Description {...descriptionProps} data-testid="description">
					description
				</AlertDialog.Description>
				<AlertDialog.Cancel data-testid="cancel">cancel</AlertDialog.Cancel>
				<AlertDialog.Action data-testid="action">action</AlertDialog.Action>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
	<p data-testid="binding">{open}</p>
	<button data-testid="toggle" onclick={() => (open = !open)}>toggle</button>
	<div id="portalTarget" data-testid="portalTarget"></div>
</main>
