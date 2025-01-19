<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import { onMount } from "svelte";
	import { Command, Dialog } from "bits-ui";
	import {
		type SearchContent,
		createContentIndex,
		searchContentIndex,
	} from "$lib/utils/search.js";

	let searchState = $state<"loading" | "ready">("loading");
	let searchQuery = $state("");
	let results = $state<SearchContent[]>([]);

	onMount(async () => {
		const content = await fetch("/api/search.json").then((res) => res.json());
		createContentIndex(content);
		searchState = "ready";
	});

	$effect(() => {
		if (searchState === "ready") {
			results = searchContentIndex(searchQuery);
		}
	});

	let dialogOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			dialogOpen = true;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Dialog.Root
	bind:open={dialogOpen}
	onOpenChange={(o) => {
		if (!o) {
			searchQuery = "";
		}
	}}
>
	<Dialog.Trigger
		class="relative inline-flex h-10 items-center justify-between gap-3 whitespace-nowrap rounded-[9px] bg-muted px-3 text-sm font-normal text-muted-foreground ring-offset-background transition-colors hover:bg-dark-10 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background md:w-72"
	>
		<span class="flex items-center gap-2">
			<MagnifyingGlass class="size-5" aria-label="Sun" />Search Docs ...
		</span>
		<span class="flex items-center gap-[1px]">
			<kbd
				class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background-alt px-1.5 font-mono text-[10px] font-medium opacity-100 shadow-kbd dark:bg-dark-10 dark:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.07)] sm:flex"
			>
				<span class="text-xs">⌘</span>
			</kbd>
			<kbd
				class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background-alt px-1.5 font-mono text-[10px] font-medium opacity-100 shadow-kbd dark:bg-dark-10 dark:shadow-[0px_2px_0px_0px_rgba(0,0,0,0.07)] sm:flex"
			>
				K
			</kbd>
		</span>
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed left-[50%] top-[20%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[0%] rounded-card-lg bg-background shadow-popover outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[490px] md:w-full"
			onCloseAutoFocus={(e) => {
				e.preventDefault();
			}}
		>
			<Dialog.Title class="sr-only">Search</Dialog.Title>
			<Dialog.Description class="sr-only">Search for documentation</Dialog.Description>
			<Command.Root
				shouldFilter={false}
				class="flex h-full w-full flex-col divide-y divide-border self-start overflow-hidden rounded-xl  bg-background"
			>
				<Command.Input
					bind:value={searchQuery}
					autocomplete="off"
					spellcheck="false"
					type="search"
					class="focus-override inline-flex h-input w-full truncate rounded-xl bg-background px-4 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus:ring-0"
					placeholder="Search for something..."
				/>
				{#if searchQuery !== "" && results.length === 0}
					<Command.Empty
						forceMount
						class="flex w-full items-center justify-center pb-6 pt-8 text-sm text-foreground"
						>No results found.</Command.Empty
					>
				{/if}

				{#if searchQuery !== "" && results.length > 0}
					<Command.List
						class="max-h-[280px] overflow-y-auto overflow-x-hidden px-2 pb-2 pt-2"
					>
						<Command.Viewport>
							{#if searchState === "loading"}
								<Command.Loading>Loading...</Command.Loading>
							{/if}

							{#each results as { title, href }}
								<Command.LinkItem
									{href}
									class="flex h-10 cursor-pointer select-none items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-none data-[selected]:bg-muted"
									onSelect={() => {
										searchQuery = "";
										dialogOpen = false;
									}}
								>
									{title}
								</Command.LinkItem>
							{/each}
						</Command.Viewport>
					</Command.List>
				{/if}
			</Command.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
