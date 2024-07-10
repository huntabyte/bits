import { allComponentDocs } from "../../../.contentlayer/generated/index.mjs";

export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
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

/**
 * Generates the navigation items for the components section of the sidebar.
 */
function generateComponentsNav() {
	const componentNavItems: SidebarNavItem[] = [];

	for (const comp of allComponentDocs) {
		componentNavItems.push({
			title: comp.title,
			href: `/docs/components/${comp.slug}`,
			items: [],
		});
	}

	componentNavItems.sort((a, b) => a.title.localeCompare(b.title));
	return componentNavItems;
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
				},
				{
					title: "Getting Started",
					href: "/docs/getting-started",
					items: [],
				},
				{
					title: "Delegation",
					href: "/docs/delegation",
					items: [],
				},
				{
					title: "Styling",
					href: "/docs/styling",
					items: [],
				},
				{
					title: "Dates",
					href: "/docs/dates",
					items: [],
				},
			],
		},
		{
			title: "Components",
			items: generateComponentsNav(),
		},
	],
};
