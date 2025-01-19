<script lang="ts">
	import type { Component } from "svelte";
	import { Command } from "bits-ui";
	import {
		AssignToIcon,
		AssignToMeIcon,
		ChangeLabelsIcon,
		ChangePriorityIcon,
		ChangeStatusIcon,
		RemoveLabelIcon,
		SetDueDateIcon,
	} from "./icons/index.js";
	import "./linear.pcss";

	type Item = {
		icon: Component;
		label: string;
		shortcut: string[];
	};

	const items: Item[] = [
		{
			icon: AssignToIcon,
			label: "Assign to...",
			shortcut: ["A"],
		},
		{
			icon: AssignToMeIcon,
			label: "Assign to me",
			shortcut: ["I"],
		},
		{
			icon: ChangeStatusIcon,
			label: "Change status...",
			shortcut: ["S"],
		},
		{
			icon: ChangePriorityIcon,
			label: "Change priority...",
			shortcut: ["P"],
		},
		{
			icon: ChangeLabelsIcon,
			label: "Change labels...",
			shortcut: ["L"],
		},
		{
			icon: RemoveLabelIcon,
			label: "Remove label...",
			shortcut: ["⇧", "L"],
		},
		{
			icon: SetDueDateIcon,
			label: "Set due date...",
			shortcut: ["⇧", "D"],
		},
	];
</script>

<div class="linear">
	<Command.Root>
		<div data-command-linear-badge="">Issue - FUN-343</div>
		<Command.Input autofocus placeholder="Type a command or search..." />
		<Command.List>
			<Command.Viewport>
				<Command.Empty>No results found.</Command.Empty>
				{#each items as { label, shortcut, icon }}
					{@const Icon = icon}
					<Command.Item value={label}>
						<Icon />
						{label}
						<div data-command-linear-shortcuts="">
							{#each shortcut as key}
								<kbd>{key}</kbd>
							{/each}
						</div>
					</Command.Item>
				{/each}
			</Command.Viewport>
		</Command.List>
	</Command.Root>
</div>
