<script lang="ts">
	import { dev } from "$app/environment";
	import { page } from "$app/stores";
	import SiteHeader from "$lib/components/site-header.svelte";
	import TailwindIndicator from "$lib/components/tailwind-indicator.svelte";
	import TableOfContents from "$lib/components/toc/table-of-contents.svelte";
	import SidebarNav from "$lib/components/navigation/sidebar-nav.svelte";
	import { navigation } from "$lib/config/index.js";
	import { cn } from "$lib/utils/index.js";
</script>

<SiteHeader />
<div class="min-h-[calc(100vh-64px)]">
	<div
		class="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10"
	>
		<SidebarNav items={navigation.sidebar} />
		<main
			class={cn(
				"relative pb-6 pl-4 pr-4 pt-16 md:pl-0 lg:gap-10 xl:grid-cols-[1fr_220px]",
				$page.error ?? "xl:grid"
			)}
		>
			<div class="mx-auto w-full min-w-0 md:max-w-[760px]" id="content">
				<slot />
			</div>

			{#if !$page.error}
				<div class="hidden text-sm xl:block">
					<div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">
						<TableOfContents />
					</div>
				</div>
			{/if}
		</main>
	</div>
</div>

{#if dev}
	<TailwindIndicator />
{/if}
