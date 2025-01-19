<script lang="ts">
	import SquareHalf from "phosphor-svelte/lib/SquareHalf";
	import MobileLink from "./mobile-link.svelte";
	import { Logo } from "$icons/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import { navigation } from "$lib/config/index.js";

	let open = $state(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				class="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
			>
				<SquareHalf class="h-5 w-5" />
				<span class="sr-only">Toggle Menu</span>
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="left" class="pr-0">
		<MobileLink href="/" class="flex items-center" onClose={() => (open = false)}>
			<Logo />
		</MobileLink>
		<div class="my-4 h-[calc(100vh-8rem)] overflow-auto pb-10 pl-6">
			<div class="flex flex-col space-y-2">
				{#each navigation.sidebar as navItem, index (index)}
					<div class="flex flex-col space-y-3 pt-6">
						<h4 class="font-medium">{navItem.title}</h4>
						{#if navItem?.items?.length}
							{#each navItem.items as item}
								{#if !item.disabled && item.href}
									<MobileLink href={item.href} onClose={() => (open = false)}>
										{item.title}
									</MobileLink>
								{/if}
							{/each}
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
