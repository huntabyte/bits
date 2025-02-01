<script lang="ts">
	import { createTableOfContents } from "@melt-ui/svelte";
	import { ScrollArea } from "bits-ui";
	import Tree from "./tree.svelte";
	let { selector = "#content" }: { selector?: string } = $props();

	const {
		elements: { item },
		states: { headingsTree, activeHeadingIdxs },
		helpers: { isActive },
	} = createTableOfContents({
		selector,
		exclude: ["h1", "h4", "h5", "h6"],
		activeType: "all",
		scrollOffset: 80,
	});
</script>

<ScrollArea.Root>
	<ScrollArea.Viewport class="h-[calc(100vh-116px)]">
		<div class="mt-1 rounded-lg p-4">
			<nav class="">
				{#key $headingsTree}
					<Tree
						tree={$headingsTree}
						activeHeadingIdxs={$activeHeadingIdxs}
						{item}
						{isActive}
					/>
				{/key}
			</nav>
		</div>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="vertical"
		class="flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent bg-transparent p-px transition-all duration-200 hover:w-3 hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0"
	>
		<ScrollArea.Thumb class="flex-1 rounded-full bg-muted-foreground" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
