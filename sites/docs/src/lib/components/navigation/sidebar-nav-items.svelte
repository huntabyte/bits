<script lang="ts">
	import { page } from "$app/stores";
	import type { SidebarNavItem } from "$lib/config/index.js";
	import { cn } from "$lib/utils/index.js";

	let { items = [] }: { items: SidebarNavItem[] } = $props();
</script>

{#if items.length}
	<div class="grid grid-flow-row auto-rows-max gap-[1px] pl-4 text-sm">
		{#each items as item, index (index)}
			{#if item.href}
				<a
					href={item.href}
					class={cn(
						"group inline-flex w-full items-center rounded-md px-2.5 py-1.5 text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
						item.disabled && "cursor-not-allowed opacity-60 ",
						$page.url.pathname === item.href ? "bg-muted" : "hover:bg-muted/50"
					)}
					target={item.external ? "_blank" : ""}
					rel={item.external ? "noreferrer" : ""}
				>
					{item.title}
					{#if item.label}
						<span
							class="ml-2 rounded-[4px] bg-[#FCDAFE] px-1.5 py-1 text-[0.7rem] font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline"
						>
							{item.label}
						</span>
					{/if}
				</a>
			{:else}
				<span
					class="flex w-full cursor-not-allowed items-center rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:underline"
				>
					{item.title}
				</span>
			{/if}
		{/each}
	</div>
{/if}
