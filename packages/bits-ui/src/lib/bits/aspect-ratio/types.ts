import type { WithChild, Without } from "$lib/internal/index.js";
import type { PrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type AspectRatioPropsWithoutHTML = WithChild<{
	ratio?: number;
}>;

export type AspectRatioProps = AspectRatioPropsWithoutHTML &
	Without<PrimitiveDivAttributes, AspectRatioPropsWithoutHTML>;
