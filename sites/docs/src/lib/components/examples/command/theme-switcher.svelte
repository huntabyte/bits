<script lang="ts">
	import type { Component } from "svelte";
	import { crossfade } from "svelte/transition";
	import { cubicInOut } from "svelte/easing";
	import { FramerIcon, LinearIcon, RaycastIcon, VercelIcon } from "./icons/index.js";

	type Themes = "raycast" | "linear" | "vercel" | "framer";

	let { theme = $bindable("raycast") }: { theme: Themes } = $props();

	let showArrowKeyHint = $state(false);

	function isTheme(value: unknown): value is Themes {
		return (
			typeof value === "string" && ["raycast", "linear", "vercel", "framer"].includes(value)
		);
	}

	type ThemeObj = {
		icon: Component;
		key: Themes;
	};

	const themes: ThemeObj[] = [
		{
			icon: RaycastIcon,
			key: "raycast",
		},
		{
			icon: LinearIcon,
			key: "linear",
		},
		{
			icon: VercelIcon,
			key: "vercel",
		},
		{
			icon: FramerIcon,
			key: "framer",
		},
	];

	function handleKeydown(e: KeyboardEvent) {
		const themeNames = themes.map(({ key }) => key);

		if (e.key === "ArrowRight") {
			const currentIndex = themeNames.indexOf(theme);
			const nextIndex = currentIndex + 1;
			const nextTheme = themeNames[nextIndex];

			if (isTheme(nextTheme)) {
				theme = nextTheme;
			}
		}
		if (e.key === "ArrowLeft") {
			const currentIndex = themeNames.indexOf(theme);
			const nextIndex = currentIndex - 1;
			const nextTheme = themeNames[nextIndex];

			if (isTheme(nextTheme)) {
				theme = nextTheme;
			}
		}
	}

	function handleButtonClick(key: Themes) {
		theme = key;
		if (showArrowKeyHint === false) {
			showArrowKeyHint = true;
		}
	}

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut,
	});
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="switcher">
	<span class="arrow" style:left="100px" style:transform="translateX(-24px) translateZ(0px)">
		←
	</span>
	{#each themes as { key, icon }}
		{@const isActive = theme === key}
		{@const Icon = icon}
		<button data-selected={isActive} onclick={() => handleButtonClick(key)}>
			<Icon />
			{key}
			{#if isActive}
				<div
					class="activeTheme"
					in:send={{ key: "active" }}
					out:receive={{ key: "active" }}
				></div>
			{/if}
		</button>
	{/each}
	<span class="arrow" style:right="100px" style:transform="translateX(20px) translateZ(0px)">
		→
	</span>
</div>
