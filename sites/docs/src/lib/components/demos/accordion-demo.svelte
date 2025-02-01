<script lang="ts">
	import { Accordion } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";

	const items = [
		{
			value: "1",
			title: "What is the meaning of life?",
			content:
				"To become a better person, to help others, and to leave the world a better place than you found it.",
		},
		{
			value: "2",
			title: "How do I become a better person?",
			content:
				"Read books, listen to podcasts, and surround yourself with people who inspire you.",
		},
		{
			value: "3",
			title: "What is the best way to help others?",
			content: "Give them your time, attention, and love.",
		},
	];
</script>

<Accordion.Root class="w-full sm:max-w-[70%]" type="multiple">
	{#each items as item (item.value)}
		<Accordion.Item value={item.value} class="group border-b border-dark-10 px-1.5">
			<Accordion.Header>
				<Accordion.Trigger
					class="flex w-full flex-1 select-none items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
				>
					<span class="w-full text-left">
						{item.title}
					</span>
					<span
						class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10"
					>
						<CaretDown class="size-[18px] transition-all duration-200" />
					</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content
				class="overflow-hidden text-sm tracking-[-0.01em] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
			>
				<div class="pb-[25px]">
					{item.content}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
