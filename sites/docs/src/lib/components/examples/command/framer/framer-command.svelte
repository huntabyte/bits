<script lang="ts">
	import type { Component } from "svelte";
	import { Command } from "bits-ui";
	import {
		AvatarIcon,
		BadgeIcon,
		ButtonIcon,
		ContainerIcon,
		InputIcon,
		RadioIcon,
		SearchIcon,
		SliderIcon,
	} from "./icons/index.js";
	import "./framer.pcss";

	let value = $state("Button");

	type Comp = {
		value: string;
		subtitle: string;
		icon: Component;
	};

	const components: Comp[] = [
		{
			value: "Button",
			subtitle: "Trigger actions",
			icon: ButtonIcon,
		},
		{
			value: "Input",
			subtitle: "Retrieve user input",
			icon: InputIcon,
		},
		{
			value: "Radio",
			subtitle: "Single choice input",
			icon: RadioIcon,
		},
		{
			value: "Badge",
			subtitle: "Annotate context",
			icon: BadgeIcon,
		},
		{
			value: "Slider",
			subtitle: "Free range picker",
			icon: SliderIcon,
		},
		{
			value: "Avatar",
			subtitle: "Illustrate the user",
			icon: AvatarIcon,
		},
		{
			value: "Container",
			subtitle: "Lay out items",
			icon: ContainerIcon,
		},
	];
</script>

<div class="framer">
	<Command.Root bind:value>
		<div data-command-framer-header="">
			<SearchIcon />
			<Command.Input autofocus placeholder="Find components, packages, and interactions..." />
		</div>
		<Command.List>
			<Command.Viewport>
				<div data-command-framer-items="">
					<div data-command-framer-left="">
						<Command.Group>
							<Command.GroupHeading>Components</Command.GroupHeading>
							<Command.GroupItems>
								{#each components as { value, subtitle, icon }}
									{@const Icon = icon}
									<Command.Item {value}>
										<div data-command-framer-icon-wrapper="">
											<Icon />
										</div>
										<div data-command-framer-item-meta="">
											{value}
											<span data-command-framer-item-subtitle="">
												{subtitle}
											</span>
										</div>
									</Command.Item>
								{/each}
							</Command.GroupItems>
						</Command.Group>
					</div>
					<hr data-command-framer-separator="" />
					<div data-command-framer-right="">
						{#if value === "Button"}
							<button>Primary</button>
						{:else if value === "Input"}
							<input type="text" placeholder="Placeholder" />
						{:else if value === "Badge"}
							<div data-command-framer-badge="">Badge</div>
						{:else if value === "Radio"}
							<label data-command-framer-radio="">
								<input type="radio" checked />
								Radio Button
							</label>
						{:else if value === "Avatar"}
							<img src="/rauno.jpeg" alt="Avatar of Rauno" />
						{:else if value === "Slider"}
							<div data-command-framer-slider="">
								<div></div>
							</div>
						{:else if value === "Container"}
							<div data-command-framer-container=""></div>
						{/if}
					</div>
				</div>
			</Command.Viewport>
		</Command.List>
	</Command.Root>
</div>
