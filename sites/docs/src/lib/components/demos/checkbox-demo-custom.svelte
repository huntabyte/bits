<script lang="ts">
	import { Checkbox, Label, type WithoutChildrenOrChild, useId } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import Minus from "phosphor-svelte/lib/Minus";
	import DemoContainer from "../demo-container.svelte";

	let {
		id = useId(),
		checked = $bindable(false),
		ref = $bindable(null),
		labelText,
		...restProps
	}: WithoutChildrenOrChild<Checkbox.RootProps> & {
		labelText: string;
	} = $props();
</script>

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<div class="flex items-center space-x-3">
		<Checkbox.Root
			bind:ref
			bind:checked
			{id}
			aria-labelledby="terms-label"
			class="peer inline-flex size-[25px] items-center justify-center rounded-md border border-muted bg-foreground transition-all duration-150 ease-in-out active:scale-98 data-[disabled]:cursor-not-allowed data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[disabled]:opacity-70 data-[state=unchecked]:hover:border-dark-40"
			name="hello"
			{...restProps}
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
			id="terms-label"
			for={id}
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{labelText}
		</Label.Root>
	</div>
</DemoContainer>
