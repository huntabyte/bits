import type {
	HTMLAnchorAttributes,
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLImgAttributes,
	HTMLInputAttributes,
	HTMLLabelAttributes,
	HTMLLiAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes,
	SVGAttributes,
} from "svelte/elements";

export type BitsDivAttributes = HTMLAttributes<HTMLDivElement>;
export type BitsSpanAttributes = HTMLAttributes<HTMLSpanElement>;
export type BitsHeadingAttributes = HTMLAttributes<HTMLHeadingElement>;
export type BitsUListAttributes = HTMLAttributes<HTMLUListElement>;
export type BitsElementAttributes = HTMLAttributes<HTMLElement>;
export type BitsTableSectionAttributes = HTMLAttributes<HTMLTableSectionElement>;
export type BitsTableRowAttributes = HTMLAttributes<HTMLTableRowElement>;
export type BitsSVGElementAttributes = SVGAttributes<SVGElement>;

/**
 * We override the `id` prop type to not allow it to be `null`. We rely on the
 * `id` heavily in the internals of Bits UI for node references. We also override
 * children to allow for custom children snippet props. We extend `style` to allow
 * for either a `StyleProperties` object or a string of CSS properties.
 */
type BitsPrimitive<T> = Omit<T, "style" | "id" | "children"> & { id?: string };

export type BitsPrimitiveButtonAttributes = BitsPrimitive<HTMLButtonAttributes>;
export type BitsPrimitiveDivAttributes = BitsPrimitive<BitsDivAttributes>;
export type BitsPrimitiveInputAttributes = BitsPrimitive<HTMLInputAttributes>;
export type BitsPrimitiveSpanAttributes = BitsPrimitive<BitsSpanAttributes>;
export type BitsPrimitiveImgAttributes = BitsPrimitive<HTMLImgAttributes>;
export type BitsPrimitiveHeadingAttributes = BitsPrimitive<BitsHeadingAttributes>;
export type BitsPrimitiveLabelAttributes = BitsPrimitive<HTMLLabelAttributes>;
export type BitsPrimitiveSVGAttributes = BitsPrimitive<BitsSVGElementAttributes>;
export type BitsPrimitiveAnchorAttributes = BitsPrimitive<HTMLAnchorAttributes>;
export type BitsPrimitiveLiAttributes = BitsPrimitive<HTMLLiAttributes>;
export type BitsPrimitiveElementAttributes = BitsPrimitive<BitsElementAttributes>;
export type BitsPrimitiveUListAttributes = BitsPrimitive<BitsUListAttributes>;
export type BitsPrimitiveTdAttributes = BitsPrimitive<HTMLTdAttributes>;
export type BitsPrimitiveThAttributes = BitsPrimitive<HTMLThAttributes>;
export type BitsPrimitiveTableAttributes = BitsPrimitive<HTMLTableAttributes>;
export type BitsPrimitiveTbodyAttributes = BitsPrimitive<BitsTableSectionAttributes>;
export type BitsPrimitiveTrAttributes = BitsPrimitive<BitsTableRowAttributes>;
export type BitsPrimitiveTheadAttributes = BitsPrimitive<BitsTableSectionAttributes>;
export type BitsPrimitiveHeaderAttributes = BitsPrimitive<BitsElementAttributes>;
