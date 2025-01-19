/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Snippet } from "svelte";

import type { Box, ReadableBoxedValues, WritableBoxedValues } from "./box.svelte.js";
import type { StyleProperties } from "$lib/shared/index.js";

export type OnChangeFn<T> = (value: T) => void;

export type ElementRef = Box<HTMLElement | null>;

export type WithChild<
	/**
	 * The props that the component accepts.
	 */
	Props extends Record<PropertyKey, unknown> = {},
	/**
	 * The props that are passed to the `child` and `children` snippets. The `ElementProps` are
	 * merged with these props for the `child` snippet.
	 */
	SnippetProps extends Record<PropertyKey, unknown> = { _default: never },
	/**
	 * The underlying DOM element being rendered. You can bind to this prop to
	 * programmatically interact with the element.
	 */
	Ref = HTMLElement,
> = Omit<Props, "child" | "children"> & {
	child?: SnippetProps extends { _default: never }
		? Snippet<[{ props: Record<string, unknown> }]>
		: Snippet<[SnippetProps & { props: Record<string, unknown> }]>;
	children?: SnippetProps extends { _default: never } ? Snippet : Snippet<[SnippetProps]>;
	style?: StyleProperties | string | null | undefined;
	ref?: Ref | null | undefined;
};

export type WithChildNoChildrenSnippetProps<
	/**
	 * The props that the component accepts.
	 */
	Props extends Record<PropertyKey, unknown> = {},
	/**
	 * The props that are passed to the `child` and `children` snippets. The `ElementProps` are
	 * merged with these props for the `child` snippet.
	 */
	SnippetProps extends Record<PropertyKey, unknown> = { _default: never },
	/**
	 * The underlying DOM element being rendered. You can bind to this prop to
	 * programmatically interact with the element.
	 */
	Ref = HTMLElement,
> = Omit<Props, "child" | "children"> & {
	child?: SnippetProps extends { _default: never }
		? Snippet<[{ props: Record<string, unknown> }]>
		: Snippet<[SnippetProps & { props: Record<string, unknown> }]>;
	children?: Snippet;
	style?: StyleProperties | string | null | undefined;
	ref?: Ref | null | undefined;
};

export type WithChildren<Props = {}> = Props & {
	children?: Snippet | undefined;
};

/**
 * Constructs a new type by omitting properties from type
 * 'T' that exist in type 'U'.
 *
 * @template T - The base object type from which properties will be omitted.
 * @template U - The object type whose properties will be omitted from 'T'.
 * @example
 * type Result = Without<{ a: number; b: string; }, { b: string; }>;
 * // Result type will be { a: number; }
 */
export type Without<T extends object, U extends object> = Omit<T, keyof U>;

export type Arrayable<T> = T[] | T;

export type Fn = () => void;
export type AnyFn = (...args: any[]) => any;

export type WithRefProps<T = {}> = T &
	ReadableBoxedValues<{ id: string }> &
	WritableBoxedValues<{ ref: HTMLElement | null }>;

export type BitsEvent<T extends Event = Event, U extends HTMLElement = HTMLElement> = T & {
	currentTarget: U;
};

export type BitsPointerEvent<T extends HTMLElement = HTMLElement> = BitsEvent<PointerEvent, T>;
export type BitsKeyboardEvent<T extends HTMLElement = HTMLElement> = BitsEvent<KeyboardEvent, T>;
export type BitsMouseEvent<T extends HTMLElement = HTMLElement> = BitsEvent<MouseEvent, T>;
export type BitsFocusEvent<T extends HTMLElement = HTMLElement> = BitsEvent<FocusEvent, T>;
