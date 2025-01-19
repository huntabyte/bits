<script lang="ts" module>
	import { Toolbar, type WithoutChildrenOrChild } from "bits-ui";
	export type ToolbarTestProps = WithoutChildrenOrChild<Toolbar.RootProps> & {
		multipleProps?: Partial<Toolbar.GroupProps>;
		singleProps?: Partial<Toolbar.GroupProps>;
	};
</script>

<script lang="ts">
	let { multipleProps, singleProps, ...restProps }: ToolbarTestProps = $props();

	let style: string[] = $state(["bold"]);
	let align: string = $state("");

	let clicked: string | undefined = $state();
</script>

<main>
	<button aria-label="style" data-testid="style-binding" onclick={() => (style = ["italic"])}>
		{style}
	</button>

	<button aria-label="align" data-testid="align-binding" onclick={() => (align = "center")}>
		{align}
	</button>

	<span data-testid="clicked-binding">
		{clicked}
	</span>

	<Toolbar.Root data-testid="root" {...restProps}>
		<Toolbar.Group
			data-testid="group-multiple"
			type="multiple"
			bind:value={style}
			{...multipleProps}
		>
			<Toolbar.GroupItem
				data-testid="group-multiple-bold"
				aria-label="toggle bold"
				value="bold"
			>
				Bold
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				data-testid="group-multiple-italic"
				aria-label="toggle italic"
				value="italic"
			>
				Italic
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				data-testid="group-multiple-strikethrough"
				aria-label="toggle strikethrough"
				value="strikethrough"
			>
				Strikethrough
			</Toolbar.GroupItem>
		</Toolbar.Group>

		<Toolbar.Group data-testid="group-single" bind:value={align} type="single" {...singleProps}>
			<Toolbar.GroupItem data-testid="group-single-left" aria-label="align left" value="left">
				Left
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				data-testid="group-single-center"
				aria-label="align center"
				value="center"
			>
				Center
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				data-testid="group-single-right"
				aria-label="align right"
				value="right"
			>
				Right
			</Toolbar.GroupItem>
		</Toolbar.Group>

		<Toolbar.Link data-testid="link" onclick={() => (clicked = "link")}
			>Edited 2 hours ago</Toolbar.Link
		>

		<Toolbar.Button data-testid="button" onclick={() => (clicked = "button")}
			>Save</Toolbar.Button
		>
	</Toolbar.Root>
</main>
