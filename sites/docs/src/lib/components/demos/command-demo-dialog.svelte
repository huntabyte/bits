<script lang="ts">
	import { Command, Dialog } from "bits-ui";
	import Sticker from "phosphor-svelte/lib/Sticker";
	import CodeBlock from "phosphor-svelte/lib/CodeBlock";
	import Palette from "phosphor-svelte/lib/Palette";
	import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
	import RadioButton from "phosphor-svelte/lib/RadioButton";
	import Textbox from "phosphor-svelte/lib/Textbox";

	let dialogOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			dialogOpen = true;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class="inline-flex h-12 select-none
	items-center justify-center whitespace-nowrap rounded-input bg-dark px-[21px]
	text-[15px] font-semibold text-background shadow-mini transition-colors hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
	>
		Open Command Menu ⌘J
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg  bg-background shadow-popover outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title class="sr-only">Command Menu</Dialog.Title>
			<Dialog.Description class="sr-only">
				This is the command menu. Use the arrow keys to navigate and press ⌘K to open the
				search bar.
			</Dialog.Description>
			<Command.Root
				class="flex h-full w-full flex-col divide-y divide-border self-start overflow-hidden rounded-xl border border-muted bg-background"
			>
				<Command.Input
					class="focus-override inline-flex h-input w-[296px] truncate rounded-xl bg-background px-4 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus:ring-0"
					placeholder="Search for something..."
				/>
				<Command.List class="max-h-[280px] overflow-y-auto overflow-x-hidden px-2 pb-2">
					<Command.Viewport>
						<Command.Empty
							class="flex w-full items-center justify-center pb-6 pt-8 text-sm text-muted-foreground"
						>
							No results found.
						</Command.Empty>
						<Command.Group>
							<Command.GroupHeading
								class="px-3 pb-2 pt-4 text-xs text-muted-foreground"
							>
								Suggestions
							</Command.GroupHeading>
							<Command.GroupItems>
								<Command.Item
									class="flex h-10 cursor-pointer select-none items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-none data-[selected]:bg-muted"
									keywords={["getting started", "tutorial"]}
								>
									<Sticker class="size-4" />
									Introduction
								</Command.Item>
								<Command.Item
									class="flex h-10 cursor-pointer select-none items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-none data-[selected]:bg-muted"
									keywords={["child", "custom element", "snippets"]}
								>
									<CodeBlock class="size-4 " />
									Delegation
								</Command.Item>
								<Command.Item
									class="flex h-10 cursor-pointer select-none items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-none data-[selected]:bg-muted"
									keywords={["css", "theme", "colors", "fonts", "tailwind"]}
								>
									<Palette class="size-4" />
									Styling
								</Command.Item>
							</Command.GroupItems>
						</Command.Group>
						<Command.Separator />
						<Command.Group>
							<Command.GroupHeading
								class="px-3 pb-2 pt-4 text-xs text-muted-foreground"
							>
								Components
							</Command.GroupHeading>
							<Command.GroupItems>
								<Command.Item
									class="flex h-10 cursor-pointer select-none items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-none data-[selected]:bg-muted"
									keywords={["dates", "times"]}
								>
									<CalendarBlank class="size-4" />
									Calendar
								</Command.Item>
								<Command.Item
									class="flex h-10 cursor-pointer select-none items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-none data-[selected]:bg-muted"
									keywords={["buttons", "forms"]}
								>
									<RadioButton class="size-4" />
									Radio Group
								</Command.Item>
								<Command.Item
									class="flex h-10 cursor-pointer select-none items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-none data-[selected]:bg-muted"
									keywords={["inputs", "text", "autocomplete"]}
								>
									<Textbox class="size-4" />
									Combobox
								</Command.Item>
							</Command.GroupItems>
						</Command.Group>
					</Command.Viewport>
				</Command.List>
			</Command.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
