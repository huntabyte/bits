<script lang="ts">
	import { Button } from "bits-ui";
	import Search from "./search.svelte";
	import { Logo } from "$icons/index.js";
	import LightSwitch from "$lib/components/light-switch.svelte";
	import MobileNav from "$lib/components/navigation/mobile-nav.svelte";
	import { siteConfig } from "$lib/config/index.js";
	import Github from "$icons/github.svelte";
</script>

<header
	class="sticky top-0 z-50 overflow-x-hidden border-b border-border bg-background/75 backdrop-blur-md"
>
	<div class="px-4">
		<div class="flex h-[70px] items-center justify-between gap-3">
			<div class="flex items-center gap-1.5">
				<MobileNav />

				<a
					href="/"
					class="ml-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background md:mr-[125px]"
				>
					<Logo />
				</a>

				<Search />
			</div>
			<div class="flex items-center justify-end">
				<Button.Root
					href={siteConfig.links.github}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Light Switch"
					class="relative inline-flex h-10 w-10 items-center justify-center rounded-input px-2 transition-colors hover:bg-dark-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					<Github class="size-5" />
				</Button.Root>
				<LightSwitch />
			</div>
		</div>
	</div>
</header>
