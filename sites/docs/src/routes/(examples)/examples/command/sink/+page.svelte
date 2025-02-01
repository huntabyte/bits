<script lang="ts">
	import { Command } from "bits-ui";

	// prettier-ignore
	const ten_first_names = ["John", "Doe", "Jane", "Smith", "Michael", "Brown", "William", "Johnson", "David", "Williams"];
	// prettier-ignore
	const ten_middle_names = ["James", "Lee", "Robert", "Michael", "David", "Joseph", "Thomas", "Charles", "Christopher", "Daniel"];
	// prettier-ignore
	const ten_last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
	// prettier-ignore
	const ten_second_first_names = [ "Emma", "Liam", "Sophia", "Noah", "Olivia", "Ethan", "Ava", 	"Mason", "Isabella", "William"];

	const names = ten_first_names
		.map((first) => {
			return ten_middle_names.map((middle) => {
				return ten_last_names.map((last) => {
					return ten_second_first_names.map((second) => {
						return `${first} ${second} ${middle} ${last}`;
					});
				});
			});
		})
		.flat(3)
		.slice(0, 2500);
</script>

<div>
	Total items: {names.length}
</div>
<div style:padding="16px">
	<Command.Root loop>
		<Command.Input placeholder="Search items..." />
		<Command.List
			class="h-[var(--cmdk-list-height)]"
			style="height: 200px; overflow-y: auto; max-width: 300px;"
		>
			<Command.Empty>No item found.</Command.Empty>
			{#each names as txt (txt)}
				<Command.Item value={txt}>{txt}</Command.Item>
			{/each}
		</Command.List>
	</Command.Root>
</div>
