<script lang="ts">
	import CustomAccordion from "./accordion-demo-custom.svelte";

	const items = [
		{
			value: "A",
			title: "Title A",
			content: "Content A",
		},
		{
			value: "B",
			title: "Title B",
			content: "Content B",
		},
		{
			value: "C",
			title: "Title C",
			content: "Content C",
		},
	];
</script>

<CustomAccordion {items} type="multiple" />
