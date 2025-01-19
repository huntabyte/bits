import { type VariantProps, tv } from "tailwind-variants";

import Root from "./alert.svelte";
import Description from "./alert-description.svelte";
import Title from "./alert-title.svelte";

export const alertVariants = tv({
	base: "relative w-full rounded-[16px] p-5 [&>h5]:tracking-normal",

	variants: {
		variant: {
			note: "bg-[#E0F2FE] text-[#363661] dark:bg-[#272730] dark:text-foreground [&>.dot]:bg-[#363661] dark:[&>.dot]:bg-[#C7E6FA] [&>h5]:text-[#363661] dark:[&>h5]:text-[#C7E6FA]",
			danger: "border-rose-200 bg-rose-50 text-foreground dark:border-rose-600 dark:bg-rose-500/20 [&>h5]:text-red-600 dark:[&>h5]:text-red-300 [&>svg]:text-red-800 dark:[&>svg]:text-red-300",
			tip: "bg-[#FFE5E0] text-[#0040A7] dark:bg-[#272730] dark:text-foreground [&>.dot]:bg-[#0040A7] dark:[&>.dot]:bg-[#FFC3BA] [&>h5]:text-[#0040A7] dark:[&>h5]:text-[#FFC3BA]",
			warning:
				"bg-[#FEFCE8] text-[#525252] dark:bg-[#272730] dark:text-foreground [&>.dot]:bg-[#525252] dark:[&>.dot]:bg-[#FFF8B7] [&>h5]:text-[#525252] dark:[&>h5]:text-[#FFF8B7]",
		},
	},
	defaultVariants: {
		variant: "note",
	},
});

export type Variant = VariantProps<typeof alertVariants>["variant"];
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export {
	Root,
	Description,
	Title,
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle,
};
