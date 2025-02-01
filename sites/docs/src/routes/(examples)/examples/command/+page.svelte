<script lang="ts">
	import ThemeSwitcher from "$lib/components/examples/command/theme-switcher.svelte";
	import CommandWrapper from "$lib/components/examples/command/command-wrapper.svelte";
	import RaycastCommand from "$lib/components/examples/command/raycast/raycast-command.svelte";
	import LinearCommand from "$lib/components/examples/command/linear/linear-command.svelte";
	import VercelCommand from "$lib/components/examples/command/vercel/vercel-command.svelte";
	import FramerCommand from "$lib/components/examples/command/framer/framer-command.svelte";

	let theme: "raycast" | "linear" | "vercel" | "framer" = $state("raycast");
</script>

<main class="main">
	<div class="content">
		<div style:height="475px">
			{#if theme === "raycast"}
				<CommandWrapper>
					<RaycastCommand />
				</CommandWrapper>
			{:else if theme === "linear"}
				<CommandWrapper>
					<LinearCommand />
				</CommandWrapper>
			{:else if theme === "vercel"}
				<CommandWrapper>
					<VercelCommand />
				</CommandWrapper>
			{:else if theme === "framer"}
				<CommandWrapper>
					<FramerCommand />
				</CommandWrapper>
			{/if}
		</div>
		<ThemeSwitcher bind:theme />

		<div aria-hidden="true" class="line"></div>
	</div>
</main>
