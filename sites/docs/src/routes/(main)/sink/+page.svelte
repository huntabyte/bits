<script>
	import { Slider, Tooltip } from "bits-ui";
	import { on } from "svelte/events";

	let value = $state([0]);
	let open = $state(false);
	let pointerdown = $state(false);

	// @ts-expect-error - shh
	function onOpenChange(value) {
		if (pointerdown) {
			return;
		}

		open = value;
	}

	function onPointerDown() {
		pointerdown = true;
		open = true;
	}

	function onPointerUp() {
		pointerdown = false;
		open = false;
	}

	$effect(() => {
		return on(document, "pointerup", onPointerUp);
	});
</script>

<div class="container">
	<Slider.Root type="multiple" bind:value class="root">
		{#snippet children({ thumbs })}
			<div class="track">
				<Slider.Range class="range" />
			</div>
			<Tooltip.Provider>
				{#each thumbs as index}
					<Tooltip.Root bind:open={() => open, onOpenChange} delayDuration={0}>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Slider.Thumb
									{...props}
									{index}
									onpointerdown={() => {
										onPointerDown();
									}}
									class="thumb"
								/>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Portal>
							<Tooltip.Content updatePositionStrategy="always">
								<div class="tooltip-content">
									{value[index]}
								</div>
								<Tooltip.Arrow />
							</Tooltip.Content>
						</Tooltip.Portal>
					</Tooltip.Root>
				{/each}
			</Tooltip.Provider>
		{/snippet}
	</Slider.Root>
</div>

<style>
	.container {
		width: 280px;
	}

	:global(.root) {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
	}

	:global(.track) {
		position: relative;
		height: 8px;
		width: 100%;
		flex-grow: 1;
		overflow: hidden;
		border-radius: 9999px;
		background-color: gray;
	}

	:global(.range) {
		position: absolute;
		height: 100%;
		background-color: orange;
	}

	:global(.thumb) {
		height: 25px;
		width: 25px;
		border-radius: 9999px;
		background-color: orange;
	}

	.tooltip-content {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 25px;
		height: 25px;
		border-radius: 9999px;
		background-color: orange;
		color: black;
		font-size: 0.75rem;
		font-weight: 500;
	}
</style>
