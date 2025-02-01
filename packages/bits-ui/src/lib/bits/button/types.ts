import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type { WithoutChildren } from "svelte-toolbelt";
import type { WithChildren } from "$lib/shared/index.js";

export type ButtonRootPropsWithoutHTML = WithChildren<{
	ref?: HTMLElement | null;
}>;

type AnchorElement = ButtonRootPropsWithoutHTML &
	WithoutChildren<Omit<HTMLAnchorAttributes, "href" | "type">> & {
		href: HTMLAnchorAttributes["href"];
		type?: never;
		disabled?: HTMLButtonAttributes["disabled"];
	};

type ButtonElement = ButtonRootPropsWithoutHTML &
	WithoutChildren<Omit<HTMLButtonAttributes, "type" | "href">> & {
		type?: HTMLButtonAttributes["type"];
		href?: never;
		disabled?: HTMLButtonAttributes["disabled"];
	};

export type ButtonRootProps = AnchorElement | ButtonElement;
