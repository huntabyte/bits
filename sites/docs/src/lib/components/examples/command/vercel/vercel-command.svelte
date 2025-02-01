<script lang="ts">
	import { Command } from "bits-ui";
	import Home from "./home.svelte";
	import Projects from "./projects.svelte";
	import "./vercel.pcss";

	let inputValue = $state("");

	let pages = $state<string[]>(["home"]);

	const activePage = $derived(pages[pages.length - 1]);
	const isHome = $derived(activePage === "home");

	function popPage() {
		const next = [...pages];
		next.splice(-1, 1);
		pages = next;
	}

	function bounce(node: HTMLElement) {
		node.style.transform = "scale(0.96)";
		setTimeout(() => {
			node.style.transform = "";
		}, 100);

		inputValue = "";
	}

	function handleKeydown(e: KeyboardEvent & { currentTarget: HTMLElement }) {
		const currTarget = e.currentTarget;
		if (!currTarget) return;

		if (e.key === "Enter") {
			bounce(currTarget);
		}

		if (isHome || inputValue.length) {
			return;
		}

		if (e.key === "Backspace") {
			e.preventDefault();
			popPage();
			bounce(currTarget);
		}
	}
</script>

<div class="vercel">
	<Command.Root onkeydown={handleKeydown}>
		<div>
			{#each pages as page}
				<div data-command-vercel-badge="">
					{page}
				</div>
			{/each}
		</div>
		<Command.Input autofocus placeholder="What do you need?" bind:value={inputValue} />
		<Command.List>
			<Command.Viewport>
				<Command.Empty>No results found.</Command.Empty>
				{#key activePage}
					{#if activePage === "home"}
						<Home
							searchProjects={() => {
								pages = [...pages, "projects"];
							}}
						/>
					{/if}
					{#if activePage === "projects"}
						<Projects />
					{/if}
				{/key}
			</Command.Viewport>
		</Command.List>
	</Command.Root>
</div>
