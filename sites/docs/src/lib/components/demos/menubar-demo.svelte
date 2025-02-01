<script lang="ts">
	import { Menubar } from "bits-ui";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import Cat from "phosphor-svelte/lib/Cat";
	import Check from "phosphor-svelte/lib/Check";
	import { SwitchOff, SwitchOn } from "$icons/index.js";

	let selectedView = $state("table");
	let selectedProfile = $state("pavel");

	let grids = $state([
		{
			checked: true,
			label: "Pixel",
		},
		{
			checked: false,
			label: "Layout",
		},
	]);

	let showConfigs = $state([
		{
			checked: true,
			label: "Show Bookmarks",
		},
		{
			checked: false,
			label: "Show Full URLs",
		},
	]);

	const profiles = [
		{
			value: "hunter",
			label: "Hunter",
		},
		{
			value: "pavel",
			label: "Pavel",
		},
		{
			value: "adrian",
			label: "Adrian",
		},
	];

	const views = [
		{
			value: "table",
			label: "Table",
		},
		{
			value: "board",
			label: "Board",
		},
		{
			value: "gallery",
			label: "Gallery",
		},
	];
</script>

<Menubar.Root
	class="flex h-12 items-center gap-1 rounded-10px border border-dark-10 bg-background-alt px-[3px] shadow-mini"
>
	<div class="px-2.5">
		<Cat class="size-6" />
	</div>
	<Menubar.Menu>
		<Menubar.Trigger
			class="inline-flex h-10 cursor-default items-center justify-center rounded-9px px-3 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
		>
			File
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override z-50 w-fit  rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover focus-visible:outline-none"
				align="start"
				sideOffset={3}
			>
				{#each grids as grid}
					<Menubar.CheckboxItem
						class="flex h-10 select-none items-center gap-3 rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						bind:checked={grid.checked}
					>
						{#snippet children({ checked })}
							{grid.label} grid
							<div class="ml-auto flex items-center">
								{#if checked}
									<SwitchOn />
								{:else}
									<SwitchOff />
								{/if}
							</div>
						{/snippet}
					</Menubar.CheckboxItem>
				{/each}
				<Menubar.Separator class="my-1 -ml-1 -mr-1 block h-px bg-muted" />
				<Menubar.RadioGroup bind:value={selectedView}>
					{#each views as view}
						<Menubar.RadioItem
							value={view.value}
							class="flex h-10 select-none items-center gap-2 rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						>
							{#snippet children({ checked })}
								{view.label}
								<div class="ml-auto size-5">
									{#if checked}
										<Check class="size-5" />
									{/if}
								</div>
							{/snippet}
						</Menubar.RadioItem>
					{/each}
				</Menubar.RadioGroup>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>

	<Menubar.Menu>
		<Menubar.Trigger
			class="inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
		>
			Edit
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override z-50 w-full rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover focus-visible:outline-none"
				align="start"
				sideOffset={3}
			>
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Undo
				</Menubar.Item>
				<Menubar.Item
					class="flex h-10 min-w-[130px] select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Redo
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Sub>
					<Menubar.SubTrigger
						class="flex h-10 select-none items-center gap-3 rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
					>
						Find
						<div class="ml-auto flex items-center">
							<CaretRight class="h-4 w-4 text-foreground-alt" />
						</div>
					</Menubar.SubTrigger>
					<Menubar.SubContent
						class="focus-override w-full max-w-[209px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover focus-visible:outline-none"
					>
						<Menubar.Item
							class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						>
							Search the web
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Item
							class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						>
							Find...
						</Menubar.Item>
						<Menubar.Item
							class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						>
							Find Next
						</Menubar.Item>
						<Menubar.Item
							class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						>
							Find Previous
						</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Separator />
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Cut
				</Menubar.Item>
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Copy
				</Menubar.Item>
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Paste
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			class="inline-flex h-10 cursor-default items-center justify-center rounded-9px px-3 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
		>
			View
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override z-50 w-full max-w-[220px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover focus-visible:outline-none"
				align="start"
				sideOffset={3}
			>
				{#each showConfigs as config}
					<Menubar.CheckboxItem
						class="flex h-10 select-none items-center gap-3 rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						bind:checked={config.checked}
					>
						{#snippet children({ checked })}
							{config.label}
							<div class="ml-auto flex items-center">
								{#if checked}
									<SwitchOn />
								{:else}
									<SwitchOff />
								{/if}
							</div>
						{/snippet}
					</Menubar.CheckboxItem>
				{/each}
				<Menubar.Separator />
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Reload
				</Menubar.Item>
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Force Reload
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Toggle Fullscreen
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				>
					Hide Sidebar
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger
			class="mr-[20px] inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted data-[state=open]:bg-muted"
		>
			Profiles
		</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content
				class="focus-override z-50 w-full max-w-[220px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover focus-visible:outline-none"
				align="start"
				sideOffset={3}
			>
				<Menubar.RadioGroup bind:value={selectedProfile}>
					{#each profiles as profile}
						<Menubar.RadioItem
							class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
							value={profile.value}
						>
							{#snippet children({ checked })}
								{profile.label}
								<div class="ml-auto flex items-center">
									{#if checked}
										<Check class="size-5" />
									{/if}
								</div>
							{/snippet}
						</Menubar.RadioItem>
					{/each}
				</Menubar.RadioGroup>
				<Menubar.Separator />
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
					>Edit...</Menubar.Item
				>
				<Menubar.Separator />
				<Menubar.Item
					class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
					>Add Profile...</Menubar.Item
				>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
</Menubar.Root>
