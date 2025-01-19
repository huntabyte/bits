import type { Component } from "svelte";
import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
import CirclesThreePlus from "phosphor-svelte/lib/CirclesThreePlus";
import CodeBlock from "phosphor-svelte/lib/CodeBlock";
import Compass from "phosphor-svelte/lib/Compass";
import Link from "phosphor-svelte/lib/Link";
import Palette from "phosphor-svelte/lib/Palette";
import Resize from "phosphor-svelte/lib/Resize";
import Sticker from "phosphor-svelte/lib/Sticker";
import FigmaLogo from "phosphor-svelte/lib/FigmaLogo";
import { componentDocs, typeHelperDocs, utilityDocs } from "$content/index.js";

export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
	icon?: Component;
};

export type SidebarNavItem = NavItem & {
	items: SidebarNavItem[];
};

export type NavItemWithChildren = NavItem & {
	items: NavItemWithChildren[];
};

export type Navigation = {
	main: NavItem[];
	sidebar: SidebarNavItem[];
};

const filteredComponents = componentDocs;

/**
 * Generates the navigation items for the components section of the sidebar.
 */
function generateComponentsNav() {
	const componentNavItems: SidebarNavItem[] = [];

	for (const comp of filteredComponents) {
		componentNavItems.push({
			title: comp.title,
			href: `/docs/components/${comp.slug}`,
			label: "navLabel" in comp ? (comp.navLabel as string) : undefined,
			items: [],
		});
	}

	componentNavItems.sort((a, b) => a.title.localeCompare(b.title));
	return componentNavItems;
}

/**
 * Generates the navigation items for the utilities section of the sidebar.
 */
function generateUtilitiesNav(): SidebarNavItem[] {
	const utilityNavItems: SidebarNavItem[] = [];

	for (const comp of utilityDocs) {
		utilityNavItems.push({
			title: comp.title,
			href: `/docs/utilities/${comp.slug}`,
			items: [],
		});
	}

	utilityNavItems.sort((a, b) => a.title.localeCompare(b.title));
	return utilityNavItems;
}

/**
 * Generates the navigation items for the type helpers section of the sidebar.
 */
function generateTypeHelpersNav(): SidebarNavItem[] {
	const utilityNavItems: SidebarNavItem[] = [];

	for (const comp of typeHelperDocs) {
		utilityNavItems.push({
			title: comp.title,
			href: `/docs/type-helpers/${comp.slug}`,
			items: [],
		});
	}

	utilityNavItems.sort((a, b) => a.title.localeCompare(b.title));
	return utilityNavItems;
}

export const navigation: Navigation = {
	main: [
		{
			title: "Docs",
			href: "/docs",
		},
	],
	sidebar: [
		{
			title: "Overview",
			items: [
				{
					title: "Introduction",
					href: "/docs/introduction",
					items: [],
					icon: Sticker,
				},
				{
					title: "Getting Started",
					href: "/docs/getting-started",
					items: [],
					icon: Compass,
				},
				{
					title: "Child Snippet",
					href: "/docs/child-snippet",
					items: [],
					icon: CodeBlock,
				},
				{
					title: "Ref",
					href: "/docs/ref",
					items: [],
					icon: Link,
				},
				{
					title: "Transitions",
					href: "/docs/transitions",
					items: [],
					icon: Resize,
				},
				{
					title: "Styling",
					href: "/docs/styling",
					items: [],
					icon: Palette,
				},
				{
					title: "Dates",
					href: "/docs/dates",
					items: [],
					icon: CalendarBlank,
				},
				{
					title: "Controlled State",
					href: "/docs/controlled-state",
					items: [],
					icon: CirclesThreePlus,
				},
				{
					title: "Figma",
					href: "/docs/figma-file",
					items: [],
					icon: FigmaLogo,
					label: "New",
				},
			],
		},
		{
			title: "Components",
			items: generateComponentsNav(),
		},
		{
			title: "Utilities",
			items: generateUtilitiesNav(),
		},
		{
			title: "Type Helpers",
			items: generateTypeHelpersNav(),
		},
	],
};
