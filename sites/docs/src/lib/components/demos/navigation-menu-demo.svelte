<script lang="ts">
	import { NavigationMenu } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import { cn } from "$lib/utils/styles.js";

	const components: { title: string; href: string; description: string }[] = [
		{
			title: "Alert Dialog",
			href: "/docs/components/alert-dialog",
			description:
				"A modal dialog that interrupts the user with important content and expects a response.",
		},
		{
			title: "Link Preview",
			href: "/docs/components/link-preview",
			description: "For sighted users to preview content available behind a link.",
		},
		{
			title: "Progress",
			href: "/docs/components/progress",
			description:
				"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
		},
		{
			title: "Scroll-area",
			href: "/docs/components/scroll-area",
			description: "Visually or semantically separates content.",
		},
		{
			title: "Tabs",
			href: "/docs/components/tabs",
			description:
				"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
		},
		{
			title: "Tooltip",
			href: "/docs/components/tooltip",
			description:
				"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
		},
	];

	type ListItemProps = {
		className?: string;
		title: string;
		href: string;
		content: string;
	};
</script>

{#snippet ListItem({ className, title, content, href }: ListItemProps)}
	<li>
		<NavigationMenu.Link
			class={cn(
				"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground",
				className
			)}
			{href}
		>
			<div class="text-sm font-medium leading-none">{title}</div>
			<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
				{content}
			</p>
		</NavigationMenu.Link>
	</li>
{/snippet}

<NavigationMenu.Root class="relative z-10 flex max-w-max flex-1 items-center justify-center">
	<NavigationMenu.List class="group flex flex-1 list-none items-center justify-center space-x-1">
		<NavigationMenu.Item>
			<NavigationMenu.Trigger
				class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50 data-[state=open]:bg-muted/50"
			>
				Getting started
				<CaretDown
					class="group-data[state=open]:rotate-180 relative top-[1px] ml-1 size-3 transition duration-200"
					aria-hidden="true"
				/>
			</NavigationMenu.Trigger>
			<NavigationMenu.Content
				class="left-0 top-0 z-50 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto"
			>
				<ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
					<li class="row-span-3">
						<NavigationMenu.Link
							href="/"
							class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
						>
							<!-- <Icons.logo class="h-6 w-6" /> -->
							<div class="mb-2 mt-4 text-lg font-medium">Bits UI</div>
							<p class="text-sm leading-tight text-muted-foreground">
								The headless components for Svelte.
							</p>
						</NavigationMenu.Link>
					</li>

					{@render ListItem({
						href: "/docs",
						title: "Introduction",
						content: "Headless components for Svelte and SvelteKit",
					})}
					{@render ListItem({
						href: "/docs/getting-started",
						title: "Getting Started",
						content: "How to install and use Bits UI",
					})}
					{@render ListItem({
						href: "/docs/styling",
						title: "Styling",
						content: "How to style Bits UI components",
					})}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger
				class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50 data-[state=open]:bg-muted/50"
			>
				Components
				<CaretDown
					class="group-data[state=open]:rotate-180 relative top-[1px] ml-1 size-3 transition duration-200"
					aria-hidden="true"
				/>
			</NavigationMenu.Trigger>
			<NavigationMenu.Content
				class="left-0 top-0 z-50 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto"
			>
				<ul class="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
					{#each components as component (component.title)}
						{@render ListItem({
							href: component.href,
							title: component.title,
							content: component.description,
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link
				class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50 data-[state=open]:bg-muted/50"
				href="/docs"
			>
				Documentation
			</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Indicator
			class="top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in"
		>
			<div
				class="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md"
			></div>
		</NavigationMenu.Indicator>
	</NavigationMenu.List>
	<div class="absolute left-0 top-full flex justify-center">
		<NavigationMenu.Viewport
			class="origin-top-center text-popover-foreground relative mt-1.5 h-[var(--bits-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--bits-navigation-menu-viewport-width)]"
		/>
	</div>
</NavigationMenu.Root>
