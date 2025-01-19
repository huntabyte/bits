<script lang="ts">
	import { Accordion } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import { slide } from "svelte/transition";

	const items = [
		{
			title: "What is the meaning of life?",
			content:
				"To become a better person, to help others, and to leave the world a better place than you found it.",
		},
		{
			title: "How do I become a better person?",
			content:
				"Read books, listen to podcasts, and surround yourself with people who inspire you.",
		},
		{
			title: "What is the best way to help others?",
			content: "Give them your time, attention, and love.",
		},
	];

	let value = $state<string[]>([]);
</script>

<Accordion.Root class="w-full sm:max-w-[70%]" type="multiple" bind:value>
	{#each items as item, i}
		<Accordion.Item value={`${i}`} class="group border-b border-dark-10 px-1.5">
			<Accordion.Header>
				<Accordion.Trigger
					class="flex w-full flex-1 items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
				>
					{item.title}
					<span
						class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10"
					>
						<CaretDown class="size-[18px] transition-all duration-200" />
					</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content forceMount={true} class="overflow-hidden text-sm tracking-[-0.01em]">
				{#snippet child({ props, open })}
					{#if open}
						<div {...props} transition:slide={{ duration: 1000 }}>
							<div class="pb-[25px]">
								{item.content}
							</div>
						</div>
					{/if}
				{/snippet}
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
