<script lang="ts">
	import { Combobox } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import Check from "phosphor-svelte/lib/Check";
	import OrangeSlice from "phosphor-svelte/lib/OrangeSlice";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
	import { fly } from "svelte/transition";

	const fruits = [
		{ value: "mango", label: "Mango" },
		{ value: "watermelon", label: "Watermelon" },
		{ value: "apple", label: "Apple" },
		{ value: "pineapple", label: "Pineapple" },
		{ value: "orange", label: "Orange" },
		{ value: "grape", label: "Grape" },
		{ value: "strawberry", label: "Strawberry" },
		{ value: "banana", label: "Banana" },
		{ value: "kiwi", label: "Kiwi" },
		{ value: "peach", label: "Peach" },
		{ value: "cherry", label: "Cherry" },
		{ value: "blueberry", label: "Blueberry" },
		{ value: "raspberry", label: "Raspberry" },
		{ value: "blackberry", label: "Blackberry" },
		{ value: "plum", label: "Plum" },
		{ value: "apricot", label: "Apricot" },
		{ value: "pear", label: "Pear" },
		{ value: "grapefruit", label: "Grapefruit" },
	];

	let searchValue = $state("");

	const filteredFruits = $derived(
		searchValue === ""
			? fruits
			: fruits.filter((fruit) =>
					fruit.label.toLowerCase().includes(searchValue.toLowerCase())
				)
	);
</script>

<Combobox.Root
	type="single"
	name="favoriteFruit"
	onOpenChange={(o) => {
		if (!o) searchValue = "";
	}}
>
	<div class="relative">
		<OrangeSlice
			class="absolute start-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground"
		/>
		<Combobox.Input
			oninput={(e) => (searchValue = e.currentTarget.value)}
			class="inline-flex h-input w-[296px] truncate rounded-9px border border-border-input bg-background px-11 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
			placeholder="Search a fruit"
			aria-label="Search a fruit"
		/>
		<Combobox.Trigger class="absolute end-3 top-1/2 size-6 -translate-y-1/2">
			<CaretUpDown class="size-6 text-muted-foreground" />
		</Combobox.Trigger>
	</div>
	<Combobox.Portal>
		<Combobox.Content
			class="max-h-96 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
			sideOffset={10}
			forceMount
		>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly={{ duration: 300 }}>
							<Combobox.ScrollUpButton
								class="flex w-full items-center justify-center"
							>
								<CaretDoubleUp class="size-3" />
							</Combobox.ScrollUpButton>
							<Combobox.Viewport class="p-1">
								{#each filteredFruits as fruit, i (i + fruit.value)}
									<Combobox.Item
										class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none  data-[highlighted]:bg-muted"
										value={fruit.value}
										label={fruit.label}
									>
										{#snippet children({ selected })}
											{fruit.label}
											{#if selected}
												<div class="ml-auto">
													<Check />
												</div>
											{/if}
										{/snippet}
									</Combobox.Item>
								{:else}
									<span class="block px-5 py-2 text-sm text-muted-foreground">
										No results found, try again.
									</span>
								{/each}
							</Combobox.Viewport>
							<Combobox.ScrollDownButton
								class="flex w-full items-center justify-center"
							>
								<CaretDoubleDown class="size-3" />
							</Combobox.ScrollDownButton>
						</div>
					</div>
				{/if}
			{/snippet}
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
