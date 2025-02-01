<script lang="ts">
	import { Collapsible } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
</script>

<Collapsible.Root class="w-[327px] space-y-3">
	<div class="flex items-center justify-between space-x-10">
		<h4 class="text-[15px] font-medium">@huntabyte starred 3 repositories</h4>
		<Collapsible.Trigger
			class="inline-flex h-10 w-10 items-center justify-center rounded-9px border border-border-input bg-background-alt text-foreground shadow-btn transition-all hover:bg-muted active:scale-98"
		>
			<CaretUpDown class="size-4 " weight="bold" />
			<span class="sr-only">Toggle</span>
		</Collapsible.Trigger>
	</div>

	<Collapsible.Content class="space-y-2 font-mono text-[15px] tracking-[0.01em]">
		<div class="inline-flex h-12 w-full items-center rounded-9px bg-muted px-[18px] py-3">
			@huntabyte/bits-ui
		</div>
		<div class="inline-flex h-12 w-full items-center rounded-9px bg-muted px-[18px] py-3">
			@huntabyte/shadcn-svelte
		</div>
		<div class="inline-flex h-12 w-full items-center rounded-9px bg-muted px-[18px] py-3">
			@melt-ui/melt-ui
		</div>
	</Collapsible.Content>
</Collapsible.Root>
