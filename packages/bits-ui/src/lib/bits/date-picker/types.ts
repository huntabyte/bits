import type { DateValue } from "@internationalized/date";
import type { OnChangeFn, WithChild, WithChildren, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes.js";
import type { CalendarRootSnippetProps } from "$lib/types.js";
import type {
	DateMatcher,
	DateOnInvalid,
	DateValidator,
	EditableSegmentPart,
} from "$lib/shared/index.js";
import type { Granularity, WeekStartsOn } from "$lib/shared/date/types.js";

export type DatePickerRootPropsWithoutHTML = WithChildren<{
	/**
	 * The value of the date picker.
	 *
	 * @bindable
	 */
	value?: DateValue;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<DateValue | undefined>;

	/**
	 * The placeholder value of the date field. This determines the format
	 * and what date the field starts at when it is empty.
	 * @bindable
	 */
	placeholder?: DateValue;

	/**
	 * A callback function called when the placeholder value changes.
	 */
	onPlaceholderChange?: OnChangeFn<DateValue>;

	/**
	 * The open state of the date picker popover.
	 *
	 * @bindable
	 */
	open?: boolean;

	/**
	 * A callback function called when the open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * A function that returns true if the given date is unavailable,
	 * where if selected, the date field will be marked as invalid.
	 */
	isDateUnavailable?: DateMatcher;

	/**
	 * A function that returns true if the given date is disabled,
	 * which makes the date unable to be selected in the calendar.
	 */
	isDateDisabled?: DateMatcher;

	/**
	 * A function that returns a string or array of strings as validation errors if the date is
	 * invalid, or nothing if the date is valid
	 */
	validate?: DateValidator;

	/**
	 * A callback fired when the date field's value is invalid. Use this to display an error
	 * message to the user.
	 */
	onInvalid?: DateOnInvalid;

	/**
	 * The minimum acceptable date. When provided, the date field
	 * will be marked as invalid if the user enters a date before this date.
	 */
	minValue?: DateValue | undefined;

	/**
	 * The maximum acceptable date. When provided, the date field
	 * will be marked as invalid if the user enters a date after this date.
	 */
	maxValue?: DateValue | undefined;

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
	 * Whether or not the hidden input of the date field requires a value
	 * to be submitted.
	 *
	 * @defaultValue false
	 */
	required?: boolean;

	/**
	 * Applicable only when `numberOfMonths` is greater than 1.
	 *
	 * Controls whether to use paged navigation for the next and previous buttons in the
	 * date picker. With paged navigation set to `true`, clicking the next/prev buttons
	 * changes all months in view. When set to `false`, it shifts the view by a single month.
	 *
	 * For example, with `pagedNavigation` set to `true` and 2 months displayed (January and
	 * February), clicking the next button changes the view to March and April. If `pagedNavigation`
	 * is `false`, the view shifts to February and March.
	 *
	 * @defaultValue false
	 */
	pagedNavigation?: boolean;

	/**
	 * The day of the week to start the calendar on, which must
	 * be a number between 0 and 6, where 0 is Sunday and 6 is
	 * Saturday.
	 *
	 * @defaultValue 0 (Sunday)
	 */
	weekStartsOn?: WeekStartsOn;

	/**
	 * How the string representation of the weekdays provided via the `weekdays` state store
	 * should be formatted.
	 *
	 * ```md
	 * - "long": "Sunday", "Monday", "Tuesday", etc.
	 * - "short": "Sun", "Mon", "Tue", etc.
	 * - "narrow": "S", "M", "T", etc.
	 *```
	 *
	 * @defaultValue "narrow"
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#weekday
	 */
	weekdayFormat?: Intl.DateTimeFormatOptions["weekday"];

	/**
	 * Display 6 weeks per month, regardless the month's number of weeks.
	 * This is useful for displaying a consistent calendar, where the size
	 * of the calendar doesn't change month to month.
	 *
	 * To display 6 weeks per month, you will need to render out the previous
	 * and next month's dates in the calendar as well.
	 *
	 * @defaultValue false
	 */
	fixedWeeks?: boolean;

	/**
	 * Determines the number of months to display on the calendar simultaneously.
	 * For navigation between months, refer to the `pagedNavigation` prop.
	 *
	 * @defaultValue 1
	 */
	numberOfMonths?: number;

	/**
	 * This label is exclusively used for accessibility, remaining hidden from the page.
	 * It's read by screen readers when the calendar is opened. The current month and year
	 * are automatically appended to the label, so you only need to provide the base label.
	 *
	 * For instance:
	 * - 'Date of birth' will be read as 'Date of birth, January 2021' if the current month is January 2021.
	 * - 'Appointment date' will be read as 'Appointment date, January 2021' if the current month is January 2021.
	 * - 'Booking date' will be read as 'Booking date, January 2021' if the current month is January 2021.
	 */
	calendarLabel?: string;

	/**
	 * Whether to disable the selection of days outside the current month. By default,
	 * days outside the current month are rendered to fill the calendar grid, but they
	 * are not selectable. Setting this prop to `true` will disable this behavior.
	 *
	 * @defaultValue false
	 */
	disableDaysOutsideMonth?: boolean;

	/**
	 * Whether or not users can deselect a date once selected
	 * without selecting another date.
	 *
	 * @defaultValue false
	 */
	preventDeselect?: boolean;

	/**
	 * Whether to close the popover when a date is selected.
	 *
	 * @defaultValue true
	 */
	closeOnDateSelect?: boolean;

	/**
	 * Whether to focus a date when the picker is first opened.
	 */
	initialFocus?: boolean;

	/**
	 * The `id` of the element which contains the error messages for the date field when the
	 * date is invalid.
	 */
	errorMessageId?: string;
}>;

export type DatePickerRootProps = DatePickerRootPropsWithoutHTML;

export type {
	PopoverTriggerPropsWithoutHTML as DatePickerTriggerPropsWithoutHTML,
	PopoverTriggerProps as DatePickerTriggerProps,
	PopoverContentPropsWithoutHTML as DatePickerContentPropsWithoutHTML,
	PopoverContentProps as DatePickerContentProps,
	PopoverContentStaticPropsWithoutHTML as DatePickerContentStaticPropsWithoutHTML,
	PopoverContentStaticProps as DatePickerContentStaticProps,
	PopoverArrowPropsWithoutHTML as DatePickerArrowPropsWithoutHTML,
	PopoverArrowProps as DatePickerArrowProps,
	PopoverClosePropsWithoutHTML as DatePickerClosePropsWithoutHTML,
	PopoverCloseProps as DatePickerCloseProps,
} from "$lib/bits/popover/types.js";

export type {
	DateFieldInputPropsWithoutHTML as DatePickerInputPropsWithoutHTML,
	DateFieldInputProps as DatePickerInputProps,
	DateFieldLabelPropsWithoutHTML as DatePickerLabelPropsWithoutHTML,
	DateFieldLabelProps as DatePickerLabelProps,
	DateFieldSegmentPropsWithoutHTML as DatePickerSegmentPropsWithoutHTML,
	DateFieldSegmentProps as DatePickerSegmentProps,
} from "$lib/bits/date-field/types.js";

export type DatePickerCalendarPropsWithoutHTML = WithChild<{}, CalendarRootSnippetProps>;

export type DatePickerCalendarProps = DatePickerCalendarPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DatePickerCalendarPropsWithoutHTML>;

export type {
	CalendarCellPropsWithoutHTML as DatePickerCellPropsWithoutHTML,
	CalendarCellProps as DatePickerCellProps,
	CalendarDayPropsWithoutHTML as DatePickerDayPropsWithoutHTML,
	CalendarDayProps as DatePickerDayProps,
	CalendarGridPropsWithoutHTML as DatePickerGridPropsWithoutHTML,
	CalendarGridProps as DatePickerGridProps,
	CalendarGridBodyPropsWithoutHTML as DatePickerGridBodyPropsWithoutHTML,
	CalendarGridBodyProps as DatePickerGridBodyProps,
	CalendarGridHeadPropsWithoutHTML as DatePickerGridHeadPropsWithoutHTML,
	CalendarGridHeadProps as DatePickerGridHeadProps,
	CalendarGridRowPropsWithoutHTML as DatePickerGridRowPropsWithoutHTML,
	CalendarGridRowProps as DatePickerGridRowProps,
	CalendarHeadCellPropsWithoutHTML as DatePickerHeadCellPropsWithoutHTML,
	CalendarHeadCellProps as DatePickerHeadCellProps,
	CalendarHeaderPropsWithoutHTML as DatePickerHeaderPropsWithoutHTML,
	CalendarHeaderProps as DatePickerHeaderProps,
	CalendarHeadingPropsWithoutHTML as DatePickerHeadingPropsWithoutHTML,
	CalendarHeadingProps as DatePickerHeadingProps,
	CalendarNextButtonPropsWithoutHTML as DatePickerNextButtonPropsWithoutHTML,
	CalendarNextButtonProps as DatePickerNextButtonProps,
	CalendarPrevButtonPropsWithoutHTML as DatePickerPrevButtonPropsWithoutHTML,
	CalendarPrevButtonProps as DatePickerPrevButtonProps,
} from "$lib/bits/calendar/types.js";
