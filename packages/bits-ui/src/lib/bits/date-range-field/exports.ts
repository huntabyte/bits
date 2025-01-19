export { default as Root } from "./components/date-range-field.svelte";
export { default as Input } from "./components/date-range-field-input.svelte";
export { default as Label } from "./components/date-range-field-label.svelte";
export { default as Segment } from "../date-field/components/date-field-segment.svelte";

export type {
	DateRangeFieldRootProps as RootProps,
	DateRangeFieldLabelProps as LabelProps,
	DateRangeFieldInputProps as InputProps,
	DateRangeFieldSegmentProps as SegmentProps,
} from "./types.js";
