<script lang="ts">
	import { type Snippet, untrack } from "svelte";
	import { Collapsible, ScrollArea, Tabs } from "bits-ui";
	import DemoCodeTabs from "./demo-code-tabs.svelte";
	import TailwindConfig from "./code-renders/tailwind-config.svelte";
	import AppCSS from "./code-renders/app-css.svelte";
	import { cn } from "$lib/utils/styles.js";
	import { useCopyToClipboard } from "$lib/utils/copy-to-clipboard.svelte.js";

	type Props = {
		fileName?: string;
		children: Snippet;
		class?: string;
		nonExpandableItems?: string[];
	};
	let {
		children,
		fileName = "App.svelte",
		class: className,
		nonExpandableItems = [],
	}: Props = $props();

	const items = $derived([
		{
			label: fileName,
			value: fileName,
		},
		{
			label: "tailwind.config.js",
			value: "tailwind.config.js",
		},
		{
			label: "app.css",
			value: "app.css",
		},
	]);

	let open = $state(false);
	let activeValue = $state(fileName);
	let codeWrapper = $state<HTMLElement>(null!);
	const expandable = $derived(!nonExpandableItems.includes(activeValue));
	const copyToClipboard = useCopyToClipboard();

	$effect(() => {
		activeValue;
		codeWrapper;
		untrack(() => {
			if (!codeWrapper) return;
			copyToClipboard?.setCodeString(codeWrapper.innerText.trim() ?? "");
		});
	});
</script>

<DemoCodeTabs
	{items}
	value={activeValue}
	onValueChange={(v) => {
		activeValue = v;
	}}
	bind:open
	{expandable}
	bind:ref={codeWrapper}
>
	<Collapsible.Root bind:open>
		{#each items as item (item.value)}
			<Tabs.Content
				value={item.value}
				class="relative overflow-hidden rounded-b-card border-x-2 border-b-2 bg-background"
			>
				<Collapsible.Content forceMount>
					<ScrollArea.Root>
						<ScrollArea.Viewport
							class={cn(
								"h-full max-h-[800px] min-h-80 w-full",
								!open && "!max-h-80",
								className
							)}
						>
							<div
								class={cn(
									"w-full [&_pre]:!my-0 [&_pre]:!mt-0 [&_pre]:!rounded-none [&_pre]:!rounded-b-none [&_pre]:!rounded-tl-none [&_pre]:!rounded-tr-none [&_pre]:!border-t-0 [&_pre]:!border-none [&_pre]:!px-2 [&_pre]:!pb-5 [&_pre]:!pt-2",
									className
								)}
							>
								{#if item.value === fileName}
									{@render children()}
								{:else if item.value === "tailwind.config.js"}
									<TailwindConfig />
								{:else if item.value === "app.css"}
									<AppCSS />
								{/if}
							</div>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar
							orientation="vertical"
							class="flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent bg-transparent p-px transition-all duration-200 hover:w-3 hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0"
						>
							<ScrollArea.Thumb class="flex-1 rounded-full bg-muted-foreground" />
						</ScrollArea.Scrollbar>
						<ScrollArea.Scrollbar
							orientation="horizontal"
							class="flex h-2.5 touch-none select-none rounded-full border-t border-t-transparent bg-transparent p-px transition-all duration-200 hover:h-3 hover:bg-dark-10 "
						>
							<ScrollArea.Thumb class="rounded-full bg-muted-foreground" />
						</ScrollArea.Scrollbar>
						<ScrollArea.Corner />
					</ScrollArea.Root>
				</Collapsible.Content>
			</Tabs.Content>
		{/each}
	</Collapsible.Root>
</DemoCodeTabs>
