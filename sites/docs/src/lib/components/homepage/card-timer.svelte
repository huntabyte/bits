<script lang="ts">
	import { mode } from "mode-watcher";
	import X from "phosphor-svelte/lib/X";
	import HomeSwitch from "$lib/components/homepage/home-switch.svelte";
	import HomeSelect from "$lib/components/homepage/home-select.svelte";

	let checked = $state(false);
	let startTime = $state(0);
	let stopwatchInterval: number | null = null;
	let elapsedPausedTime = $state(0);
	let displayTime = $state("0:00:00");

	function startStopwatch() {
		if (stopwatchInterval !== null) return;
		startTime = new Date().getTime() - elapsedPausedTime;
		stopwatchInterval = window.setInterval(updateStopwatch, 1000);
	}

	function stopStopwatch() {
		if (stopwatchInterval !== null) {
			window.clearInterval(stopwatchInterval);
		}
		elapsedPausedTime = new Date().getTime() - startTime;
		stopwatchInterval = null;
	}

	function resetStopwatch() {
		stopStopwatch();
		elapsedPausedTime = 0;
		displayTime = "0:00:00";
	}

	function updateStopwatch() {
		const currentTime = new Date().getTime();
		const elapsedTime = currentTime - startTime;
		const seconds = Math.floor(elapsedTime / 1000) % 60;
		const minutes = Math.floor(elapsedTime / 1000 / 60) % 60;
		const hours = Math.floor(elapsedTime / 1000 / 60 / 60);
		displayTime = `${hours}:${pad(minutes)}:${pad(seconds)}`;
	}

	function pad(number: number) {
		return (number < 10 ? "0" : "") + number;
	}

	const chips = ["design", "code", "other"];
	let foo = $state("new");
</script>

<div class="relative order-1 lg:order-5 lg:translate-y-[7%]">
	<div
		class="line_top_gradient absolute -left-10 top-0 h-[1px] w-[calc(100%+50px)] {$mode ===
		'dark'
			? 'dark'
			: ''}"
	></div>
	<div
		class="line_right_gradient absolute -top-[200px] bottom-0 right-0 w-px rotate-180 {$mode ===
		'dark'
			? 'dark'
			: ''}"
	></div>
	<div class="m-[10px]">
		<div
			class="aspect-square w-full rounded-card-lg border border-border-input bg-white px-[14px] py-3 shadow-card dark:bg-[#FAF8F5]"
		>
			<div class="mb-5 rounded-15px bg-foreground p-1 dark:bg-[#171717]">
				<div class="rounded-xl bg-[rgba(81,84,95,0.6)] px-2 pb-8 pt-3 text-white">
					<div class="text-[2.563rem] font-medium leading-[100%]">
						{displayTime}
					</div>
					<div class="text-[13px] font-medium">
						Task:
						<span class="relative ml-1 mr-2 mt-[2px] inline-flex h-[10px] w-[10px]">
							<span
								class="{checked
									? 'ping_anim'
									: ''} absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"
							></span>
							<span
								class="relative inline-flex h-[10px] w-[10px] rounded-full bg-rose-500"
							></span>
						</span>
						<span class="capitalize">{foo}</span>
					</div>
				</div>
				<div class="labels mb-2 mt-[9px] flex gap-[3px] px-1 font-medium">
					{#each chips as chip, i}
						<div
							data-active={i === 0 ? "" : undefined}
							class="group flex select-none items-center rounded-[25px] bg-[#31343e] px-2 text-[11px] text-white/70 data-[active]:bg-white data-[active]:text-foreground dark:data-[active]:text-[#171717]"
						>
							{chip}
							<X
								class="relative ml-1.5 hidden size-1.5 group-data-[active]:block"
								weight="bold"
								aria-label="Close"
							/>
						</div>
					{/each}
				</div>
			</div>

			<div class="flex gap-2">
				<HomeSelect bind:value={foo} />
				<HomeSwitch
					bind:checked
					onCheckedChange={(c) => {
						if (c) {
							startStopwatch();
						} else {
							resetStopwatch();
						}
					}}
				/>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.line_top_gradient {
		background: linear-gradient(to right, transparent 50%, white 50%),
			linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			10px 1px,
			100% 1px;
		&.dark {
			background: linear-gradient(to right, transparent 50%, #171717 50%),
				linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
			background-size:
				10px 1px,
				100% 1px;
		}
	}
	.line_right_gradient {
		background: linear-gradient(to top, transparent 50%, white 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
		&.dark {
			background: linear-gradient(to top, transparent 50%, #171717 50%),
				linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
			background-size:
				1px 10px,
				100% 100%;
		}
	}

	.ping_anim {
		animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}
</style>
