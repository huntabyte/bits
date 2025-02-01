<script lang="ts">
	import { ScrollArea } from "bits-ui";
	import SidebarNavItems from "$lib/components/navigation/sidebar-nav-items.svelte";
	import SidebarNavMainItems from "$lib/components/navigation/sidebar-nav-main-items.svelte";
	import type { SidebarNavItem } from "$lib/config/index.js";

	let { items = [] }: { items: SidebarNavItem[] } = $props();
</script>

{#if items.length}
	<aside
		class="fixed top-10 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r border-border md:sticky md:block"
	>
		<ScrollArea.Root>
			<ScrollArea.Viewport class="h-full max-h-[calc(100vh-3.5rem)] w-full shrink-0 ">
				<div class="h-full py-6 pr-4 lg:py-8">
					<nav class="space-y-3">
						<div class="flex w-full flex-col pb-[50px]">
							{#each items as item, index (index)}
								{#if item.title === "Overview"}
									<SidebarNavMainItems items={item.items} />
								{:else}
									<div class="pb-4">
										<h4
											class="mb-1 ml-[9px] rounded-md px-2.5 py-2 pl-4 text-xs font-medium uppercase text-muted-foreground"
										>
											{item.title}
										</h4>
										{#if item.items}
											<SidebarNavItems items={item.items} />
										{/if}
									</div>
								{/if}
							{/each}
						</div>
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
	</aside>
{/if}
