<script lang="ts">
	import { Accordion } from "bits-ui";

	type Item = {
		value: string;
		title: string;
		disabled: boolean;
		content: string;
		level: 1 | 2 | 3 | 4 | 5 | 6;
	};

	let {
		disabled = false,
		items = [],
		value = "",
		withOpenCheck = false,
	}: Omit<
		Accordion.RootProps & {
			items: Item[];
			withOpenCheck?: boolean;
		},
		"type"
	> = $props();
</script>

<Accordion.Root type="single" value={value as string} {disabled} data-testid="root">
	{#each items as { value, title, disabled, content, level }}
		<Accordion.Item {value} {disabled} data-testid="{value}-item">
			<Accordion.Header {level} data-testid="{value}-header">
				<Accordion.Trigger {disabled} data-testid="{value}-trigger">
					{title}
				</Accordion.Trigger>
			</Accordion.Header>
			{#if withOpenCheck}
				<Accordion.Content data-testid="{value}-content" forceMount>
					{#snippet child({ props, open })}
						{#if open}
							<div {...props}>
								{content}
							</div>
						{/if}
					{/snippet}
				</Accordion.Content>
			{:else}
				<Accordion.Content data-testid="{value}-content" forceMount>
					{#snippet child({ props, open: _open })}
						<div {...props}>
							{content}
						</div>
					{/snippet}
				</Accordion.Content>
			{/if}
		</Accordion.Item>
	{/each}
</Accordion.Root>
