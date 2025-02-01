<script lang="ts">
	import { Tabs } from "bits-ui";
	import Airplane from "phosphor-svelte/lib/Airplane";
</script>

<div class="pt-6">
	<Tabs.Root
		value="outbound"
		class="w-[390px] rounded-card border border-muted bg-background-alt p-3 shadow-card"
	>
		<Tabs.List
			class="grid w-full grid-cols-2 gap-1 rounded-9px bg-dark-10 p-1 text-sm font-semibold leading-[0.01em] shadow-mini-inset dark:border dark:border-neutral-600/30 dark:bg-background"
		>
			<Tabs.Trigger
				value="outbound"
				class="h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted"
				>Outbound</Tabs.Trigger
			>
			<Tabs.Trigger
				value="inbound"
				class="h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted"
				>Inbound</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="outbound" class="select-none pt-3">
			<div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
				<div class="text-left">
					<h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">
						Prague
					</h4>
					<p class="text-sm font-medium text-muted-foreground">06:05</p>
				</div>
				<div class="self-end text-center">
					<p class="text-sm font-medium text-muted-foreground">3h 30m</p>
				</div>
				<div class="text-right">
					<h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">
						Malaga
					</h4>
					<p class="text-sm font-medium text-muted-foreground">06:05</p>
				</div>
				<div class="relative col-span-3">
					<hr class="border-1 relative top-4 h-px border-dashed border-border-input" />

					<div class="absolute left-1/2 -translate-x-1/2 bg-background-alt p-1">
						<Airplane class="size-6 rotate-90 text-muted-foreground" />
					</div>
				</div>
			</div>
		</Tabs.Content>
		<Tabs.Content value="inbound" class="select-none pt-3">
			<div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
				<div class="text-left">
					<h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">
						Malaga
					</h4>
					<p class="text-sm font-medium text-muted-foreground">07:25</p>
				</div>
				<div class="self-end text-center">
					<p class="text-sm font-medium text-muted-foreground">3h 20m</p>
				</div>
				<div class="text-right">
					<h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">
						Prague
					</h4>
					<p class="text-sm font-medium text-muted-foreground">10:45</p>
				</div>
				<div class="relative col-span-3">
					<hr class="border-1 relative top-4 h-px border-dashed border-border-input" />

					<div class="absolute left-1/2 -translate-x-1/2 bg-background-alt p-1">
						<Airplane class="size-6 rotate-90 text-muted-foreground" />
					</div>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
