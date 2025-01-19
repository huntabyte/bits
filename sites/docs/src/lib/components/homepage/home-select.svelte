<script lang="ts">
	import { Select } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";

	const themes = [
		{ value: "new", label: "New App" },
		{ value: "code", label: "Code" },
		{ value: "design", label: "Design" },
	];

	let { value = $bindable("new") }: { value: string } = $props();

	const selectedLabel = $derived(
		value ? themes.find((theme) => theme.value === value)?.label : "New app"
	);
</script>

<Select.Root type="single" bind:value items={themes}>
	<Select.Trigger
		class="inline-flex h-[37px] w-full select-none items-center rounded-9px border border-border-input bg-background px-3 pr-2  text-sm transition-colors placeholder:text-foreground-alt/50 dark:border-[#18181B2B] dark:bg-white dark:text-[#171717]"
		aria-label="Select task"
	>
		{selectedLabel}
		<CaretUpDown class="ml-auto size-6 text-muted-foreground dark:text-[#17171766]" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override z-50 max-h-96 w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border border-muted bg-background px-1 py-2 shadow-popover outline-none"
			sideOffset={10}
		>
			<Select.ScrollUpButton class="flex w-full items-center justify-center">
				<CaretDoubleUp class="size-3" />
			</Select.ScrollUpButton>
			<Select.Viewport class="p-1">
				{#each themes as theme, i (i + theme.value)}
					<Select.Item
						class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none duration-75 data-[highlighted]:bg-muted"
						value={theme.value}
						label={theme.label}
					>
						{#snippet children({ selected })}
							{theme.label}
							{#if selected}
								<div class="ml-auto">
									<Check />
								</div>
							{/if}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton class="flex w-full items-center justify-center">
				<CaretDoubleDown class="size-3" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
