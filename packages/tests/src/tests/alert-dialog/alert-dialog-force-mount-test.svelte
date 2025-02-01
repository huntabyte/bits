<script lang="ts" module>
	import { AlertDialog, type WithoutChildrenOrChild } from "bits-ui";
	export type AlertDialogTestProps = AlertDialog.RootProps & {
		contentProps?: Omit<AlertDialog.ContentProps, "asChild" | "child" | "children">;
		portalProps?: AlertDialog.PortalProps;
		titleProps?: WithoutChildrenOrChild<AlertDialog.TitleProps>;
		descriptionProps?: WithoutChildrenOrChild<AlertDialog.DescriptionProps>;
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	let {
		open = false,
		contentProps = {},
		portalProps = {},
		titleProps = {},
		descriptionProps = {},
		withOpenCheck = false,
		...restProps
	}: AlertDialogTestProps = $props();
</script>

<main>
	<AlertDialog.Root bind:open {...restProps}>
		<AlertDialog.Trigger data-testid="trigger">open</AlertDialog.Trigger>
		<AlertDialog.Portal {...portalProps}>
			{#if withOpenCheck}
				<AlertDialog.Overlay
					forceMount
					data-testid="overlay"
					class="fixed inset-0 h-[100vh] w-[100vw] bg-black"
				>
					{#snippet child({ props, open })}
						{#if open}
							<div {...props}></div>
						{/if}
					{/snippet}
				</AlertDialog.Overlay>
			{:else}
				<AlertDialog.Overlay
					forceMount
					data-testid="overlay"
					class="fixed inset-0 h-[100vh] w-[100vw] bg-black"
				>
					{#snippet child({ props, open: _open })}
						<div {...props}></div>
					{/snippet}
				</AlertDialog.Overlay>
			{/if}
			{#if withOpenCheck}
				<AlertDialog.Content
					forceMount
					{...contentProps}
					data-testid="content"
					class="tranlate-x-[50%] fixed left-[50%] top-[50%] translate-y-[50%] bg-white p-1"
				>
					{#snippet child({ props, open })}
						{#if open}
							<div {...props}>
								<AlertDialog.Title {...titleProps} data-testid="title"
									>title</AlertDialog.Title
								>
								<AlertDialog.Description
									{...descriptionProps}
									data-testid="description"
								>
									description
								</AlertDialog.Description>
								<AlertDialog.Cancel data-testid="cancel">cancel</AlertDialog.Cancel>
								<AlertDialog.Action data-testid="action">action</AlertDialog.Action>
							</div>
						{/if}
					{/snippet}
				</AlertDialog.Content>
			{:else}
				<AlertDialog.Content
					forceMount
					{...contentProps}
					data-testid="content"
					class="tranlate-x-[50%] fixed left-[50%] top-[50%] translate-y-[50%] bg-white p-1"
				>
					{#snippet child({ props, open: _open })}
						<div {...props}>
							<AlertDialog.Title {...titleProps} data-testid="title"
								>title</AlertDialog.Title
							>
							<AlertDialog.Description
								{...descriptionProps}
								data-testid="description"
							>
								description
							</AlertDialog.Description>
							<AlertDialog.Cancel data-testid="cancel">cancel</AlertDialog.Cancel>
							<AlertDialog.Action data-testid="action">action</AlertDialog.Action>
						</div>
					{/snippet}
				</AlertDialog.Content>
			{/if}
		</AlertDialog.Portal>
	</AlertDialog.Root>
	<p data-testid="binding">{open}</p>
	<button data-testid="toggle" onclick={() => (open = !open)}>toggle</button>
	<div id="portalTarget" data-testid="portalTarget"></div>
</main>
