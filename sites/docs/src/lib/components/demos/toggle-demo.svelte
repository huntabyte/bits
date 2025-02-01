<script lang="ts">
	import { Toggle } from "bits-ui";
	import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";

	let unlocked = $state(false);
	const code = $derived(unlocked ? "B1T5" : "••••");
</script>

<div
	class="min-h-input flex h-full w-[176px] items-center gap-2 rounded-card-sm border border-border bg-background-alt py-1 pl-[18px] pr-1.5 shadow-mini"
>
	<div
		class="text-end font-alt text-[19px] tracking-[13.87px] {unlocked
			? 'text-foreground'
			: 'text-muted-foreground'}"
	>
		{code}
	</div>
	<Toggle.Root
		aria-label="toggle code visibility"
		class="inline-flex size-10 items-center justify-center rounded-[9px] bg-background-alt transition-all hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10"
		bind:pressed={unlocked}
	>
		<LockKeyOpen class="size-6" />
	</Toggle.Root>
</div>
