<script lang="ts">
	import { Checkbox, Label, useId } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import Minus from "phosphor-svelte/lib/Minus";

	let myValue = $state<string[]>(["marketing", "news"]);
</script>

<Checkbox.Group class="flex flex-col gap-3" bind:value={myValue} name="notifications">
	<Checkbox.GroupLabel class="text-sm font-medium text-foreground-alt">
		Notifications
	</Checkbox.GroupLabel>
	<div class="flex flex-col gap-4">
		{@render MyCheckbox({ label: "Marketing", value: "marketing" })}
		{@render MyCheckbox({ label: "Promotions", value: "promotions" })}
		{@render MyCheckbox({ label: "News", value: "news" })}
		{@render MyCheckbox({ label: "Updates", value: "updates" })}
	</div>
</Checkbox.Group>

{#snippet MyCheckbox({ value, label }: { value: string; label: string })}
	{@const id = useId()}
	<div class="flex items-center">
		<Checkbox.Root
			{id}
			aria-labelledby="{id}-label"
			class="peer inline-flex size-[25px] items-center justify-center rounded-md border border-muted bg-foreground transition-all duration-150 ease-in-out active:scale-98 data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40"
			name="hello"
			{value}
		>
			{#snippet children({ checked, indeterminate })}
				<div class="inline-flex items-center justify-center text-background">
					{#if indeterminate}
						<Minus class="size-[15px]" weight="bold" />
					{:else if checked}
						<Check class="size-[15px]" weight="bold" />
					{/if}
				</div>
			{/snippet}
		</Checkbox.Root>
		<Label.Root
			id="{id}-label"
			for={id}
			class="pl-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{label}
		</Label.Root>
	</div>
{/snippet}
