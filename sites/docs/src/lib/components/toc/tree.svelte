<script lang="ts">
	import {
		type TableOfContents,
		type TableOfContentsElements,
		type TableOfContentsItem,
		melt,
	} from "@melt-ui/svelte";
	import Tree from "./tree.svelte";
	import { cn } from "$lib/utils/index.js";

	let {
		tree = [],
		activeHeadingIdxs,
		item,
		level = 1,
		isActive,
	}: {
		tree?: TableOfContentsItem[];
		activeHeadingIdxs: number[];
		item: TableOfContentsElements["item"];
		level?: number;
		isActive: TableOfContents["helpers"]["isActive"];
	} = $props();

	function hoverAction(node: HTMLElement) {
		function handleMouseEnter() {
			node.parentElement?.setAttribute("data-hover", "");
		}

		function handleMouseLeave() {
			node.parentElement?.removeAttribute("data-hover");
		}

		node.addEventListener("mouseenter", handleMouseEnter);
		node.addEventListener("mouseleave", handleMouseLeave);

		return {
			destroy() {
				node.removeEventListener("mouseenter", handleMouseEnter);
				node.removeEventListener("mouseleave", handleMouseLeave);
			},
		};
	}
</script>

<ul class="m-0 list-none">
	{#if tree && tree.length}
		{#each tree as heading, i (i)}
			{@const node = heading.node.innerHTML}
			{@const nodeWithoutSpan = node.replace(/<span.*<\/span>/g, "")}
			<li class="mt-0 {level === 1 && 'border-l'}">
				<div
					class={cn(
						"-mx-[1px] inline-flex items-center justify-center gap-1 border-l border-l-transparent pb-2 pl-4 text-muted-foreground no-underline transition-colors data-[hover]:border-l-foreground",
						level !== 1 ? "pl-8" : "",
						$isActive(heading.id) && "border-l-foreground"
					)}
				>
					<a
						href="#{heading.id}"
						use:melt={$item(heading.id)}
						use:hoverAction
						class="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[active]:text-foreground"
					>
						<!--  eslint-disable-next-line svelte/no-at-html-tags -->
						{@html nodeWithoutSpan}
					</a>
				</div>

				{#if heading.children && heading.children.length}
					<Tree
						tree={heading.children}
						level={level + 1}
						{activeHeadingIdxs}
						{isActive}
						{item}
					/>
				{/if}
			</li>
		{/each}
	{/if}
</ul>
