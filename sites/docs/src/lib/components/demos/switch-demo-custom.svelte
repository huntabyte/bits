<script lang="ts">
	import { Label, Switch, type WithoutChildrenOrChild, useId } from "bits-ui";
	import DemoContainer from "../demo-container.svelte";

	let {
		id = useId(),
		checked = $bindable(false),
		ref = $bindable(null),
		labelText,
		...restProps
	}: WithoutChildrenOrChild<Switch.RootProps> & {
		labelText: string;
	} = $props();
</script>

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<div class="flex items-center space-x-3">
		<Switch.Root
			{...restProps}
			{id}
			class="peer inline-flex h-[36px] min-h-[36px] w-[60px] shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-dark-10 data-[state=unchecked]:shadow-mini-inset dark:data-[state=checked]:bg-foreground"
		>
			<Switch.Thumb
				class="pointer-events-none block size-[30px] shrink-0 rounded-full bg-background transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:shadow-mini dark:border dark:border-background/30 dark:bg-foreground dark:shadow-popover dark:data-[state=unchecked]:border"
			/>
		</Switch.Root>
		<Label.Root for={id} class="text-sm font-medium peer-disabled:text-muted-foreground"
			>{labelText}</Label.Root
		>
	</div>
</DemoContainer>
