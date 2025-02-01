<script lang="ts">
	import "$lib/styles/app.postcss";
	import { Button } from "bits-ui";
	import Sparkle from "phosphor-svelte/lib/Sparkle";
	import SlidersHorizontal from "phosphor-svelte/lib/SlidersHorizontal";
	import Keyboard from "phosphor-svelte/lib/Keyboard";
	import Stack from "phosphor-svelte/lib/Stack";
	import { mode } from "mode-watcher";
	import CardAir from "$lib/components/homepage/card-air.svelte";
	import CardSound from "$lib/components/homepage/card-sound.svelte";
	import CardTimer from "$lib/components/homepage/card-timer.svelte";
	import CardToggle from "$lib/components/homepage/card-toggle.svelte";
	import { Logo } from "$icons/index.js";
	import LightSwitch from "$lib/components/light-switch.svelte";

	import Customizable from "$lib/components/homepage/svg-customizable.svelte";
	import Accessible from "$lib/components/homepage/svg-accessible.svelte";
	import Consistent from "$lib/components/homepage/svg-consistent.svelte";
</script>

<div class="border-b border-solid border-black/10 bg-white dark:border-white/20 dark:bg-[#171717]">
	<header class="grid grid-cols-3 px-5 py-[17px]">
		<a
			href="/"
			class="ml-2 mt-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<Logo />
		</a>

		<nav class="mt-2 text-center">
			<ul>
				<li class="inline-block">
					<a
						data-active
						href="/"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground dark:text-white/50 dark:data-[active]:bg-white/10 dark:data-[active]:text-white/100"
						>Home</a
					>
				</li>
				<li class="inline-block">
					<a
						href="/"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground dark:text-white/50 dark:data-[active]:bg-white/10 dark:data-[active]:text-white/100"
						>Showcase</a
					>
				</li>
				<li class="inline-block">
					<a
						href="/docs"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground dark:text-white/50 dark:data-[active]:bg-white/10 dark:data-[active]:text-white/100"
						>Docs</a
					>
				</li>
			</ul>
		</nav>

		<div class="flex justify-end gap-3">
			<LightSwitch />

			<Button.Root
				class="inline-flex h-10 items-center justify-center rounded-input bg-dark
        px-5 text-[14px] font-semibold text-background shadow-mini
        hover:bg-dark/95 active:scale-98 active:transition-all"
				href="/docs"
			>
				Get started
			</Button.Root>
		</div>
	</header>

	<section
		class="flex h-[calc(100svh-76px)] flex-col justify-between overflow-hidden pt-[7em] desktop:max-h-[900px]"
	>
		<div class="mx-auto w-7/12 text-center">
			<a
				href="/docs"
				class="inline-flex gap-2 rounded-card-lg border border-border-input bg-white py-1.5 pl-3 pr-4 shadow-mini dark:border-[#F4F4F5]/20 dark:bg-[#242429]"
			>
				<Sparkle class="mt-[2px] size-4" aria-label="Stars" />
				<span
					class="inline-block border-l border-l-border-input pl-3 text-[13px] font-medium text-foreground"
					>New Svelte 5 version</span
				>
			</a>
			<h1
				class="mb-[0.35em] mt-[0.2em] text-balance pb-[0.1em] font-['Cal_Sans'] text-[4.25rem] font-semibold leading-[102%] text-transparent antialiased selection:text-foreground dark:!text-[#EAEAEA]"
			>
				The headless components for Svelte
			</h1>
			<p
				class="mx-auto mb-[2em] w-9/12 text-[1.125rem] font-medium leading-[144%] text-muted-foreground"
			>
				Bits UI is a collection of headless component primitives that enable you to build
				your own custom components.
			</p>
			<Button.Root
				class="inline-flex h-10 items-center justify-center rounded-input bg-dark
        px-3 shadow-mini
        hover:bg-dark/95 active:scale-98 active:transition-all dark:bg-white"
				href="/docs"
			>
				<kbd
					class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background-alt px-1.5 font-mono text-xxs font-medium opacity-100 shadow-[0px_2px_0px_0px_#59595b] dark:border-[rgba(0,_0,_0,_0.10)] dark:bg-white dark:shadow-[0px_2px_0px_0px_#B8B8B8] sm:flex"
				>
					<span class="text-xs text-foreground-alt">S</span>
				</kbd>
				<span
					class="ml-4 mr-3 text-[14px] font-semibold leading-[1] tracking-[0.01em] text-background"
					>Start building</span
				>
			</Button.Root>
		</div>

		<div class="mx-auto mt-20 grid grid-cols-2 gap-0 lg:grid-cols-[1fr_repeat(4,259px)_1fr]">
			<div class="relative hidden lg:order-1 lg:block">
				<div class="square {$mode === 'dark' ? 'dark' : ''}"></div>
			</div>

			<CardSound />
			<CardAir />
			<CardToggle />
			<CardTimer />

			<div class="relative hidden lg:order-6 lg:block">
				<div class="circle {$mode === 'dark' ? 'dark' : ''}"></div>
			</div>
		</div>
	</section>
</div>

<section class="mx-auto mb-44 mt-20 w-10/12">
	<h2 class=" mb-10 w-1/3 text-balance text-foreground">
		<small
			class="rounded-3xl border border-foreground px-2 py-[3px] text-[13px] font-medium tracking-[0.01em]"
			><span class="mr-3 inline-block h-[10px] w-[10px] rounded-full bg-foreground/90"
			></span>Explore</small
		>
		<span
			class="mt-2 block font-['Cal_Sans'] text-[32px] font-semibold leading-[118%] tracking-[0.02em]"
			>Main benefits of using our headless collection</span
		>
	</h2>
	<div class="grid grid-cols-3 gap-x-[15px]">
		<div class="overflow-hidden rounded-card-lg border border-border shadow-card">
			<div class="mx-2 my-[10px] rounded-15px bg-background pb-5 pl-6 pr-2 pt-2">
				<div class="flex items-center justify-between">
					<h3 class="text-[17px] font-semibold -tracking-[0.01em]">Customizable</h3>
					<div
						class="inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-foreground"
					>
						<SlidersHorizontal class="size-6 text-background" />
					</div>
				</div>

				<div class="pb-16 pt-9">
					<div class="relative left-[18px] aspect-[388/295] w-full bg-transparent">
						<Customizable />
					</div>
				</div>

				<div class="text-sm font-medium text-muted-foreground">
					Wide range of props for customizing
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-card-lg shadow-card">
			<div class="rounded-15px bg-[#F8F8F8] pb-[30px] pl-8 pr-4 pt-[18px]">
				<div class="flex items-center justify-between">
					<h3 class="text-[17px] font-semibold -tracking-[0.01em]">Accessible</h3>
					<div
						class="inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-foreground"
					>
						<Keyboard class="size-6 text-background" />
					</div>
				</div>

				<div class="pb-16 pt-9">
					<div class="relative left-[18px] aspect-[388/295] w-full bg-transparent">
						<Accessible />
					</div>
				</div>

				<div class="text-sm font-medium text-muted-foreground">
					Components are accessible by default
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-card-lg shadow-card">
			<div class="rounded-15px bg-foreground pb-[30px] pl-8 pr-4 pt-[18px]">
				<div class="flex items-center justify-between">
					<h3 class="text-[17px] font-semibold -tracking-[0.01em] text-background">
						Consistent
					</h3>
					<div
						class="inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-background"
					>
						<Stack class="size-6 text-foreground" />
					</div>
				</div>

				<div class="pb-16 pt-9">
					<div class="relative left-[18px] aspect-[388/295] w-full bg-transparent">
						<Consistent />
					</div>
				</div>

				<div class="text-sm font-medium text-background/40">
					Components are as intuitive as possible
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	h1 {
		background: linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0) 41.43%
			),
			#272727;
		background-clip: text;
	}

	.square {
		display: inline-block;
		aspect-ratio: 1/1;
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23BABABAFF' stroke-width='2' stroke-dasharray='2%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
		border-radius: 40px;
		position: absolute;
		bottom: -50%;
		right: 10px;
		width: 100%;
		min-width: 200px;
		&:after {
			content: "";
			display: inline-block;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			aspect-ratio: 1/1;
			background: radial-gradient(
				83.66% 83.66% at 95.63% 5.58%,
				rgba(255, 255, 255, 0) 0%,
				#fff 100%
			);
		}
		&.dark {
			background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23B2B2B2FF' stroke-width='2' stroke-dasharray='2%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
			&:after {
				background: radial-gradient(
					83.66% 83.66% at 95.63% 5.58%,
					rgba(255, 255, 255, 0) 0%,
					#171717 100%
				);
			}
		}
	}

	.circle {
		display: inline-block;
		aspect-ratio: 1/1;
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='200' ry='200' stroke='%23BABABAFF' stroke-width='2' stroke-dasharray='2%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
		border-radius: 200px;
		width: 100%;
		position: absolute;
		bottom: -50%;
		left: 10px;
		min-width: 200px;
		&:after {
			content: "";
			display: inline-block;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			aspect-ratio: 1/1;
			background: radial-gradient(
				84.28% 84.28% at 40.53% 20.39%,
				rgba(255, 255, 255, 0) 0%,
				#fff 100%
			);
		}
		&.dark {
			background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='200' ry='200' stroke='%23B2B2B2FF' stroke-width='2' stroke-dasharray='2%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
			&:after {
				background: radial-gradient(
					84.28% 84.28% at 40.53% 20.39%,
					rgba(255, 255, 255, 0) 0%,
					#171717 100%
				);
			}
		}
	}
</style>
