<script lang="ts">
	import { Tabs } from "bits-ui";
	import { cubicInOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import { buttonVariants } from "./ui/button/index.js";
	import { cn } from "$lib/utils/index.js";
	let className: string;
	export let align: "center" | "start" | "end" = "center";
	export { className as class };

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut,
	});

	let value = "preview";
</script>

<div
	class={cn("group relative mb-4 mt-10 flex flex-col space-y-2", className)}
	{...$$restProps}
	data-preview
>
	<Tabs.Root class="relative mr-auto w-full" bind:value>
		<Tabs.List
			class="absolute right-2.5 top-2.5 z-20 flex h-input-sm items-center justify-center rounded-card-sm bg-neutral-200 px-[4px] shadow-mini-inset dark:border dark:border-neutral-600/30 dark:bg-neutral-950"
		>
			<Tabs.Trigger
				value="preview"
				class={cn(
					buttonVariants(),
					value === "preview"
						? "font-semibold shadow-mini hover:bg-opacity-90"
						: "shadow-none transition-all hover:text-foreground-alt",
					"group relative bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				)}
			>
				<span
					class="z-20 group-data-[state=active]:text-foreground group-data-[state=inactive]:text-foreground-alt"
				>
					Preview
				</span>
				{#if value === "preview"}
					<div
						class="absolute left-0 top-0 h-8 w-full rounded-[7px] bg-background dark:bg-muted"
						in:send={{ key: "active" }}
						out:receive={{ key: "active" }}
					></div>
				{/if}
			</Tabs.Trigger>
			<Tabs.Trigger
				value="code"
				class={cn(
					buttonVariants(),
					value === "code"
						? "bg-transparent font-semibold shadow-mini hover:bg-opacity-90"
						: "bg-transparent shadow-none transition-all hover:text-foreground-alt",
					"group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				)}
			>
				<span
					class="z-20 group-data-[state=active]:text-foreground group-data-[state=inactive]:text-foreground-alt"
				>
					&lt;Code&gt;
				</span>
				{#if value === "code"}
					<div
						class="absolute left-0 top-0 h-8 w-full rounded-[7px] bg-background dark:bg-muted"
						in:send={{ key: "active" }}
						out:receive={{ key: "active" }}
					></div>
				{/if}
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="code" class="!ring-transparent">
			<div
				class="![&_pre]:mt-0 ![&_pre]:rounded-card w-full [&_pre]:max-h-[443px] [&_pre]:min-h-[443px] [&_pre]:overflow-auto"
			>
				<slot />
			</div>
		</Tabs.Content>
		<Tabs.Content
			value="preview"
			class="relative rounded-card border-2 border-muted bg-zinc-50 !ring-transparent dark:bg-neutral-900/50"
		>
			<div
				class={cn(
					"preview flex min-h-[443px] w-full justify-center p-12",
					{
						"items-center": align === "center",
						"items-start": align === "start",
						"items-end": align === "end",
					},
					className
				)}
			>
				<slot name="preview" />
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>

<style lang="postcss">
	.activeTheme {
		background: var(--grayA5);
		border-radius: 9999px;
		height: 32px;
		width: 100%;
		top: 0;
		position: absolute;
		left: 0;
	}
</style>
