import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveSpanAttributes } from "$lib/shared/attributes.js";
import type { Direction, Orientation } from "$lib/shared/index.js";

export type SliderRootSnippetProps = {
	ticks: number[];
	thumbs: number[];
};

export type BaseSliderRootPropsWithoutHTML = {
	/**
	 * Whether to automatically sort the values in the array when moving thumbs past
	 * one another.
	 *
	 * @defaultValue true
	 */
	autoSort?: boolean;
	/**
	 * The minimum value of the slider.
	 *
	 * @defaultValue 0
	 */
	min?: number;

	/**
	 * The maximum value of the slider.
	 *
	 * @defaultValue 100
	 */
	max?: number;

	/**
	 * The amount to increment the value by when the user presses the arrow keys.
	 *
	 * @defaultValue 1
	 */
	step?: number;

	/**
	 * The direction of the slider.
	 *
	 * For vertical sliders, setting `dir` to `'rtl'` will caus the slider to start
	 * from the top and move downwards. For horizontal sliders, setting `dir` to `'rtl'`
	 * will cause the slider to start from the left and move rightwards.
	 *
	 * @defaultValue 'ltr'
	 */
	dir?: Direction;

	/**
	 * The orientation of the slider.
	 *
	 * @defaultValue "horizontal"
	 */
	orientation?: Orientation;

	/**
	 * Whether the slider is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;
};

export type SliderSingleRootPropsWithoutHTML = BaseSliderRootPropsWithoutHTML & {
	/**
	 * The type of slider. If set to `'multiple'`, the slider will
	 * allow multiple ticks and the `value` will be an array of numbers.
	 *
	 * @required
	 */
	type: "single";

	/**
	 * The value of the slider.
	 * @bindable
	 */
	value?: number;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<number>;

	/**
	 * A callback function called when the user stops dragging the
	 * thumb and the value is committed.
	 */
	onValueCommit?: OnChangeFn<number>;
};

export type SliderMultiRootPropsWithoutHTML = BaseSliderRootPropsWithoutHTML & {
	/**
	 * The type of slider. If set to `'multiple'`, the slider will
	 * allow multiple ticks and the `value` will be an array of numbers.
	 *
	 * @required
	 */
	type: "multiple";

	/**
	 * The value of the slider.
	 * @bindable
	 */
	value?: number[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<number[]>;

	/**
	 * A callback function called when the user stops dragging the
	 * thumb and the value is committed.
	 */
	onValueCommit?: OnChangeFn<number[]>;
};

export type SliderRootPropsWithoutHTML =
	| WithChild<SliderSingleRootPropsWithoutHTML, SliderRootSnippetProps>
	| WithChild<SliderMultiRootPropsWithoutHTML, SliderRootSnippetProps>;

export type SliderSingleRootProps = SliderSingleRootPropsWithoutHTML &
	Without<
		BitsPrimitiveSpanAttributes,
		WithChild<SliderSingleRootPropsWithoutHTML, SliderRootSnippetProps>
	>;

export type SliderMultipleRootProps = SliderMultiRootPropsWithoutHTML &
	Without<
		BitsPrimitiveSpanAttributes,
		WithChild<SliderMultiRootPropsWithoutHTML, SliderRootSnippetProps>
	>;

export type SliderRootProps = SliderRootPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderRootPropsWithoutHTML>;

export type SliderRangePropsWithoutHTML = WithChild;

export type SliderRangeProps = SliderRangePropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderRangePropsWithoutHTML>;

export type SliderThumbPropsWithoutHTML = WithChild<{
	/**
	 * Whether the thumb is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * The index of the thumb in the array of thumbs provided by the `children` snippet prop of the
	 * `Slider.Root` component.
	 */
	index: number;
}>;

export type SliderThumbProps = SliderThumbPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderThumbPropsWithoutHTML>;

export type SliderTickPropsWithoutHTML = WithChild<{
	/**
	 * The index of the tick in the array of ticks provided by the `children` snippet prop of the
	 * `Slider.Root` component.
	 */
	index: number;
}>;

export type SliderTickProps = SliderTickPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderTickPropsWithoutHTML>;
