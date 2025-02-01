<script lang="ts">
	import Fan from "phosphor-svelte/lib/Fan";
	import { Tabs } from "bits-ui";
	import HomeSlider from "$lib/components/homepage/home-slider.svelte";

	let foo = $state([50]);

	const temps: number[] = [50, 80, 95, 80, 50, 40, 60];
</script>

<div class="relative order-2 lg:order-3 lg:-translate-y-3">
	<div
		class="m-2.5 flex aspect-square flex-col justify-between rounded-card-lg bg-[#e0f2fe] px-5 pb-8 pt-5 dark:bg-[#C7E6FA]"
	>
		<div class="flex justify-between">
			<Tabs.Root value="c" class="flex items-center font-medium">
				<Tabs.Content value="c" class="select-none"
					><span class="text-[3.625rem] leading-[1] text-indigo-950">21</span
					></Tabs.Content
				>
				<Tabs.Content value="f" class="select-none"
					><span class="text-[3.625rem] leading-[1] text-indigo-950">69</span
					></Tabs.Content
				>
				<Tabs.List class="ml-1 flex flex-col gap-2 text-[14px]">
					<Tabs.Trigger
						value="c"
						class="text-indigo-950/30 data-[state=active]:text-indigo-950"
						>°C</Tabs.Trigger
					>
					<Tabs.Trigger
						value="f"
						class="text-indigo-950/30 data-[state=active]:text-indigo-950"
						>°F</Tabs.Trigger
					>
				</Tabs.List>
			</Tabs.Root>

			<div class="text-right font-semibold text-indigo-950">
				<div
					class="spin_anim ml-auto w-min"
					style="animation-duration: {(101 - foo[0]) * 100}ms;"
				>
					<Fan class="ml-auto size-6 " />
				</div>
				<div class="mt-[0.6em] text-xxs leading-[110%] tracking-[-0.01em]">
					Air<br />Conditioner
				</div>
			</div>
		</div>

		<div class="">
			<div class="relative my-5 flex justify-between">
				{#each temps as temp}
					<div class="outer relative h-16 w-4 rounded-[35px] bg-[#000231]/10">
						<div
							class="inner absolute bottom-0 w-full rounded-[35px] bg-indigo-950"
							style="height: {temp}%"
						></div>
					</div>
				{/each}
				<div
					class="absolute -left-1.5 top-1/2 aspect-[212/30] w-[calc(100%+10px)] -translate-y-1/2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 212 30"
						fill="none"
						class="absolute left-0 top-0 h-full w-full object-contain"
					>
						<path
							d="M1 29C10.3489 20.1254 38.5826 2.10999 76.7262 1.04504C124.406 -0.286151 145.441 28.3343 170.332 28.3344C192.075 28.3345 205.975 13.5804 211 7.36823"
							stroke="#F43F5E"
							stroke-width="2"
						/>
					</svg>
				</div>
			</div>

			<HomeSlider bind:value={foo} />
		</div>
	</div>
</div>

<style lang="postcss">
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.spin_anim {
		animation-name: spin;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
</style>
