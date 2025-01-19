<script lang="ts">
	import { Command, Popover } from "bits-ui";
	import SubItem from "./sub-item.svelte";
	import { FinderIcon, StarIcon, WindowIcon } from "./icons/index.js";

	type Props = {
		listEl: HTMLElement | null;
		inputEl: HTMLInputElement | null;
		selectedValue: string;
	};

	let { listEl, inputEl, selectedValue = $bindable() }: Props = $props();

	let open = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = true;
		}
	}

	$effect(() => {
		if (!listEl) return;
		if (open) {
			listEl.style.overflow = "hidden";
		} else {
			listEl.style.overflow = "";
		}
	});
</script>

<svelte:document onkeydown={handleKeydown} />

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<button {...props} data-command-raycast-subcommand-trigger="" aria-expanded={open}>
				Actions
				<kbd>⌘</kbd>
				<kbd>K</kbd>
			</button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			onCloseAutoFocus={(e) => {
				e.preventDefault();
				inputEl?.focus();
			}}
			preventScroll={true}
			class="raycast-submenu"
			side="top"
			align="end"
		>
			<Command.Root>
				<Command.List>
					<Command.Group>
						<Command.GroupHeading>{selectedValue}</Command.GroupHeading>
						<SubItem shortcut="↵">
							<WindowIcon />
							Open Application
						</SubItem>
						<SubItem shortcut="⌘ ↵">
							<FinderIcon />
							Show in Finder
						</SubItem>
						<SubItem shortcut="⌘ I">
							<FinderIcon />
							Show Info in Finder
						</SubItem>
						<SubItem shortcut="⌘ ⇧ F">
							<StarIcon />
							Add to Favorites
						</SubItem>
					</Command.Group>
				</Command.List>
				<Command.Input placeholder="Search for actions..." />
			</Command.Root>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
