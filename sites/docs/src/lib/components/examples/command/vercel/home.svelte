<script lang="ts">
	import { Command } from "bits-ui";
	import {
		ContactIcon,
		DocsIcon,
		FeedbackIcon,
		PlusIcon,
		ProjectsIcon,
		TeamsIcon,
	} from "./icons/index.js";
	import Item from "./item.svelte";

	let { searchProjects }: { searchProjects: () => void } = $props();
</script>

<Command.Group>
	<Command.GroupHeading>Projects</Command.GroupHeading>
	<Command.GroupItems>
		<Item shortcut="S P" onSelect={searchProjects} value="Search Projects...">
			<ProjectsIcon />
			Search Projects...
		</Item>
		<Item value="Create New Project...">
			<PlusIcon />
			Create New Project...
		</Item>
	</Command.GroupItems>
</Command.Group>
<Command.Group>
	<Command.GroupHeading>Teams</Command.GroupHeading>
	<Command.GroupItems>
		<Item shortcut="⇧ P" value="Search Teams...">
			<TeamsIcon />
			Search Teams...
		</Item>
		<Item value="Create New Team...">
			<PlusIcon />
			Create New Team...
		</Item>
	</Command.GroupItems>
</Command.Group>
<Command.Group>
	<Command.GroupHeading>Help</Command.GroupHeading>
	<Command.GroupItems>
		<Item shortcut="⇧ D" value="Search Docs...">
			<DocsIcon />
			Search Docs...
		</Item>
		<Item value="Send Feedback...">
			<FeedbackIcon />
			Send Feedback...
		</Item>
		<Item value="Contact Support">
			<ContactIcon />
			Contact Support
		</Item>
	</Command.GroupItems>
</Command.Group>
