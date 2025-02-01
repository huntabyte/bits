export { default as Root } from "./components/date-field.svelte";
export { default as Input } from "./components/date-field-input.svelte";
export { default as Label } from "./components/date-field-label.svelte";
export { default as Segment } from "./components/date-field-segment.svelte";

export type {
	DateFieldRootProps as RootProps,
	DateFieldInputProps as InputProps,
	DateFieldLabelProps as LabelProps,
	DateFieldSegmentProps as SegmentProps,
	// DateFieldDescriptionProps as DescriptionProps,
} from "./types.js";
