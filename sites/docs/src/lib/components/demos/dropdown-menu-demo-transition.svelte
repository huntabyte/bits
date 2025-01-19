<script lang="ts">
	import { Avatar, DropdownMenu } from "bits-ui";
	import Cardholder from "phosphor-svelte/lib/Cardholder";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import DotsThree from "phosphor-svelte/lib/DotsThree";
	import GearSix from "phosphor-svelte/lib/GearSix";
	import UserCircle from "phosphor-svelte/lib/UserCircle";
	import UserCirclePlus from "phosphor-svelte/lib/UserCirclePlus";
	import Bell from "phosphor-svelte/lib/Bell";
	import Check from "phosphor-svelte/lib/Check";
	import DotOutline from "phosphor-svelte/lib/DotOutline";
	import { fly } from "svelte/transition";

	let notifications = $state<boolean>(false);
	let invited = $state("");
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="focus-visible border-bordinput bg-backgrounder-lt text-a-foreground inline-flex h-10 w-10 select-none items-center justify-center rounded-full border text-sm font-medium shadow-btn hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
	>
		<DotsThree class="h-6 w-6 text-foreground" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="focus-override w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none focus-visible:outline-none"
			sideOffset={8}
			forceMount
		>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly={{ duration: 300 }}>
							<DropdownMenu.Item
								class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
							>
								<div class="flex items-center">
									<UserCircle class="mr-2 size-5 text-foreground-alt" />
									Profile
								</div>
								<div class="ml-auto flex items-center gap-px">
									<kbd
										class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
									>
										⌘
									</kbd>
									<kbd
										class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
									>
										P
									</kbd>
								</div>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
							>
								<div class="flex items-center">
									<Cardholder class="mr-2 size-5 text-foreground-alt" />
									Billing
								</div>
								<div class="ml-auto flex items-center gap-px">
									<kbd
										class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
									>
										⌘
									</kbd>
									<kbd
										class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
									>
										B
									</kbd>
								</div>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
							>
								<div class="flex items-center">
									<GearSix class="mr-2 size-5 text-foreground-alt" />
									Settings
								</div>
								<div class="ml-auto flex items-center gap-px">
									<kbd
										class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
									>
										⌘
									</kbd>
									<kbd
										class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
									>
										S
									</kbd>
								</div>
							</DropdownMenu.Item>
							<DropdownMenu.CheckboxItem
								bind:checked={notifications}
								class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
							>
								{#snippet children({ checked })}
									<div class="flex items-center pr-4">
										<Bell class="mr-2 size-5 text-foreground-alt" />
										Notifications
									</div>
									<div class="ml-auto flex items-center gap-px">
										{#if checked}
											<Check class="size-4" />
										{/if}
									</div>
								{/snippet}
							</DropdownMenu.CheckboxItem>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger
									class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
								>
									<div class="flex items-center">
										<UserCirclePlus class="mr-2 size-5 text-foreground-alt" />
										Workspace
									</div>
									<div class="ml-auto flex items-center gap-px">
										<CaretRight class="size-5 text-foreground-alt" />
									</div>
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent
									id="subcontent"
									class="w-[209px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover !ring-0 !ring-transparent"
									sideOffset={10}
								>
									<DropdownMenu.RadioGroup bind:value={invited}>
										<DropdownMenu.RadioItem
											value="huntabyte"
											class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
										>
											{#snippet children({ checked })}
												<Avatar.Root
													class="relative mr-3 flex size-5 shrink-0 overflow-hidden rounded-full border border-foreground/50"
												>
													<Avatar.Image
														src="https://github.com/huntabyte.png"
														alt="@huntabyte"
														class="aspect-square h-full w-full"
													/>
													<Avatar.Fallback
														class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xxs"
														>HJ</Avatar.Fallback
													>
												</Avatar.Root>
												@huntabyte
												{#if checked}
													<DotOutline class="ml-auto size-4" />
												{/if}
											{/snippet}
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem
											value="pavel"
											class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
										>
											{#snippet children({ checked })}
												<Avatar.Root
													class="relative mr-3 flex size-5 shrink-0 overflow-hidden rounded-full border border-foreground/50"
												>
													<Avatar.Image
														src="https://github.com/pavelstianko.png"
														alt="@pavel_stianko"
														class="aspect-square h-full w-full"
													/>
													<Avatar.Fallback
														class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs"
														>PS</Avatar.Fallback
													>
												</Avatar.Root>
												@pavel_stianko
												{#if checked}
													<DotOutline class="ml-auto size-4" />
												{/if}
											{/snippet}
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem
											value="cokakoala"
											class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
										>
											{#snippet children({ checked })}
												<Avatar.Root
													class="relative mr-3 flex size-5 shrink-0 overflow-hidden rounded-full border border-foreground/50"
												>
													<Avatar.Image
														src="https://github.com/adriangonz97.png"
														alt="@cokakoala_"
														class="aspect-square h-full w-full"
													/>
													<Avatar.Fallback
														class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs"
														>CK</Avatar.Fallback
													>
												</Avatar.Root>
												@cokakoala_
												{#if checked}
													<DotOutline class="ml-auto size-4" />
												{/if}
											{/snippet}
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem
											value="tglide"
											class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
										>
											{#snippet children({ checked })}
												<Avatar.Root
													class="relative mr-3 flex size-5 shrink-0 overflow-hidden rounded-full border border-foreground/50"
												>
													<Avatar.Image
														src="https://github.com/tglide.png"
														alt="@tglide"
														class="aspect-square h-full w-full"
													/>
													<Avatar.Fallback
														class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs"
													>
														TL
													</Avatar.Fallback>
												</Avatar.Root>
												@thomasglopes
												{#if checked}
													<DotOutline class="ml-auto size-4" />
												{/if}
											{/snippet}
										</DropdownMenu.RadioItem>
									</DropdownMenu.RadioGroup>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						</div>
					</div>
				{/if}
			{/snippet}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
