<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";

	type Props = WithoutChildrenOrChild<Accordion.ItemProps> & {
		title: string;
		content: string;
		disabled?: boolean;
	};

	let { title, content, ...restProps }: Props = $props();
</script>

<Accordion.Item {...restProps} class="group border-b border-dark-10 px-1.5">
	<Accordion.Header>
		<Accordion.Trigger
			class="flex w-full flex-1 items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
		>
			{title}
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
			{content}
		</div>
	</Accordion.Content>
</Accordion.Item>
