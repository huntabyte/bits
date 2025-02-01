import type { DateValue } from "@internationalized/date";
import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveDivAttributes,
	BitsPrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";
import type {
	DateOnInvalid,
	DateRange,
	DateRangeValidator,
	EditableSegmentPart,
	SegmentPart,
} from "$lib/shared/index.js";
import type { DateFieldSegmentProps, DateFieldSegmentPropsWithoutHTML } from "$lib/types.js";
import type { Granularity } from "$lib/shared/date/types.js";

export type DateRangeFieldRootPropsWithoutHTML = WithChild<{
	/**
	 * The value of the date range field.
	 *
	 * @bindable
	 */
	value?: DateRange;

	/**
	 * A callback that is called when the value of the date range field changes.
	 */
	onValueChange?: OnChangeFn<DateRange | undefined>;

	/**
	 * The placeholder value of the date field. This determines the format
	 * and what date the field starts at when it is empty.
	 *
	 * @bindable
	 */
	placeholder?: DateValue;

	/**
	 * A callback that is called when the date field's placeholder value changes.
	 */
	onPlaceholderChange?: OnChangeFn<DateValue | undefined>;

	/**
	 * A function that returns a string or array of strings as validation errors if the date is
	 * invalid, or nothing if the date is valid
	 */
	validate?: DateRangeValidator;

	/**
	 * A callback fired when the date field's value is invalid. Use this to display an error
	 * message to the user.
	 */
	onInvalid?: DateOnInvalid;

	/**
	 * The minimum acceptable date. When provided, the date field
	 * will be marked as invalid if the user enters a date before this date.
	 */
	minValue?: DateValue;

	/**
	 * The maximum acceptable date. When provided, the date field
	 * will be marked as invalid if the user enters a date after this date.
	 */
	maxValue?: DateValue;

	/**
	 * If true, the date field will be disabled and users will not be able
	 * to interact with it. This also disables the hidden input element if
	 * the date field is used in a form.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * If true, the date field will be readonly, and users will not be able to
	 * edit the values of any of the individual segments.
	 *
	 * @defaultValue false
	 */
	readonly?: boolean;

	/**
	 * If true, the date field will be required, which is useful when used within
	 * a form. If the date field is empty when the form is submitted, the form
	 * will not be valid.
	 *
	 * @defaultValue false
	 */
	required?: boolean;

	/**
	 * An array of segment names that should be readonly. If provided, only the
	 * segments not in this array will be editable.
	 */
	readonlySegments?: EditableSegmentPart[];

	/**
	 * The format to use for displaying the time in the input.
	 * If using a 12 hour clock, ensure you also include the `dayPeriod`
	 * segment in your input to ensure the user can select AM/PM.
	 *
	 * @defaultValue the locale's default time format
	 */
	hourCycle?: 12 | 24;

	/**
	 * The locale to use for formatting the date field.
	 *
	 * @defaultValue 'en'
	 */
	locale?: string;

	/**
	 * The granularity of the date field. This determines which
	 * segments will be includes in the segments array used to
	 * build the date field.
	 *
	 * By default, when a `CalendarDate` value is used, the granularity
	 * will default to `'day'`, and when a `CalendarDateTime` or `ZonedDateTime`
	 * value is used, the granularity will default to `'minute'`.
	 *
	 * Granularity is only used for visual purposes, and does not impact
	 * the value of the date field. You can have the same value synced
	 * between multiple date fields with different granularities and they
	 * will all contain the same value.
	 *
	 * @defaultValue 'day'
	 */
	granularity?: Granularity;

	/**
	 * Whether or not to hide the timeZoneName segment from the date field.
	 *
	 * @defaultValue false;
	 */
	hideTimeZone?: boolean;

	/**
	 * A callback function called when the start value changes. This doesn't necessarily mean
	 * the `value` has updated and should be used to apply cosmetic changes to the calendar when
	 * only part of the value is changed/completed.
	 */
	onStartValueChange?: OnChangeFn<DateValue | undefined>;

	/**
	 * A callback function called when the end value changes. This doesn't necessarily mean
	 * the `value` has updated and should be used to apply cosmetic changes to the calendar when
	 * only part of the value is changed/completed.
	 */
	onEndValueChange?: OnChangeFn<DateValue | undefined>;

	/**
	 * The `id` of the element which contains the error messages for the date field when the
	 * date is invalid.
	 */
	errorMessageId?: string;
}>;

export type DateRangeFieldRootProps = DateRangeFieldRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DateRangeFieldRootPropsWithoutHTML>;

export type DateRangeFieldLabelPropsWithoutHTML = WithChild;

export type DateRangeFieldLabelProps = DateRangeFieldLabelPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, DateRangeFieldLabelPropsWithoutHTML>;

export type DateRangeFieldInputSnippetProps = {
	segments: Array<{ part: SegmentPart; value: string }>;
};

export type DateRangeFieldInputPropsWithoutHTML = WithChild<
	{
		/**
		 * The name to use for the hidden input element associated with this input
		 * used for form submission.
		 */
		name?: string;

		/**
		 * Whether this input represents the start or end of the date range.
		 */
		type: "start" | "end";
	},
	DateRangeFieldInputSnippetProps
>;

export type DateRangeFieldInputProps = DateRangeFieldInputPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DateRangeFieldInputPropsWithoutHTML>;

export type DateRangeFieldSegmentPropsWithoutHTML = DateFieldSegmentPropsWithoutHTML;

export type DateRangeFieldSegmentProps = DateFieldSegmentProps;
