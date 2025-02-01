import type { DateValue } from "@internationalized/date";
import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
	BitsPrimitiveHeaderAttributes,
	BitsPrimitiveTableAttributes,
	BitsPrimitiveTbodyAttributes,
	BitsPrimitiveTdAttributes,
	BitsPrimitiveThAttributes,
	BitsPrimitiveTheadAttributes,
	BitsPrimitiveTrAttributes,
} from "$lib/shared/attributes.js";
import type { DateMatcher, Month, WeekStartsOn } from "$lib/shared/date/types.js";

export type CalendarRootSnippetProps = {
	months: Month<DateValue>[];
	weekdays: string[];
};

type CalendarBaseRootPropsWithoutHTML = {
	/**
	 * The placeholder date, used to control the view of the
	 * calendar when no value is present.
	 *
	 * @defaultValue the current date
	 */
	placeholder?: DateValue;

	/**
	 * A callback function called when the placeholder value
	 * changes.
	 */
	onPlaceholderChange?: OnChangeFn<DateValue>;

	/**
	 * Whether or not users can deselect a date once selected
	 * without selecting another date.
	 *
	 * @defaultValue false
	 */
	preventDeselect?: boolean;

	/**
	 * The minimum date that can be selected in the calendar.
	 */
	minValue?: DateValue;

	/**
	 * The maximum date that can be selected in the calendar.
	 */
	maxValue?: DateValue;

	/**
	 * Whether or not the calendar is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

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
	 * A function that receives a date and returns `true` or `false` to indicate whether
	 * the date is disabled.
	 *
	 * @remarks
	 * Disabled dates cannot be focused or selected. Additionally, they are tagged
	 * with a data attribute to enable custom styling.
	 *
	 * `[data-disabled]` - applied to disabled dates
	 *
	 */
	isDateDisabled?: DateMatcher;

	/**
	 * Dates matching the provided matchers are marked as "unavailable." Unlike disabled dates,
	 * users can still focus and select unavailable dates. However, selecting an unavailable date
	 * renders the date picker as invalid.
	 *
	 * For example, in a calendar for booking appointments, you might mark already booked dates as
	 * unavailable. These dates could become available again before the appointment date, allowing
	 * users to select them to learn more about the appointment.
	 *
	 * `[data-unavailable]` - applied to unavailable dates
	 *
	 */
	isDateUnavailable?: DateMatcher;

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
	 * The default locale setting.
	 *
	 * @defaultValue 'en'
	 */
	locale?: string;

	/**
	 * Whether the calendar is readonly. When true, the user will be able
	 * to focus and navigate the calendar, but will not be able to select
	 * dates. @see disabled for a similar prop that prevents focusing
	 * and selecting dates.
	 *
	 * @defaultValue false
	 */
	readonly?: boolean;

	/**
	 * If `true`, the calendar will focus the selected day, today, or the first day of the month
	 * in that order depending on what is visible when the calendar is mounted.
	 */
	initialFocus?: boolean;

	/**
	 * Whether to disable the selection of days outside the current month. By default,
	 * days outside the current month are rendered to fill the calendar grid, but they
	 * are not selectable. Setting this prop to `true` will disable this behavior.
	 *
	 * @defaultValue false
	 */
	disableDaysOutsideMonth?: boolean;
};

export type CalendarSingleRootPropsWithoutHTML = {
	/**
	 * The type of calendar. If set to `'single'`, the calendar will
	 * only allow a single date to be selected. If set to `'multiple'`,
	 * the calendar will allow multiple dates to be selected.
	 */
	type: "single";

	/**
	 * The value of the selected date in the calendar.
	 */
	value?: DateValue;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<DateValue | undefined>;
};

export type CalendarMultipleRootPropsWithoutHTML = {
	/**
	 * The type of calendar. If set to `'single'`, the calendar will
	 * only allow a single date to be selected. If set to `'multiple'`,
	 * the calendar will allow multiple dates to be selected.
	 */
	type: "multiple";

	/**
	 * The value of the selected dates in the calendar.
	 */
	value?: DateValue[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<DateValue[]>;
};

export type _CalendarSingleRootPropsWithoutHTML = CalendarBaseRootPropsWithoutHTML &
	CalendarSingleRootPropsWithoutHTML;

export type CalendarSingleRootProps = _CalendarSingleRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, _CalendarSingleRootPropsWithoutHTML>;

export type _CalendarMultipleRootPropsWithoutHTML = CalendarBaseRootPropsWithoutHTML &
	CalendarMultipleRootPropsWithoutHTML;

export type CalendarMultipleRootProps = _CalendarMultipleRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, _CalendarMultipleRootPropsWithoutHTML>;

export type CalendarRootPropsWithoutHTML = CalendarBaseRootPropsWithoutHTML &
	(
		| WithChild<CalendarSingleRootPropsWithoutHTML, CalendarRootSnippetProps>
		| WithChild<CalendarMultipleRootPropsWithoutHTML, CalendarRootSnippetProps>
	);

export type CalendarRootProps = CalendarRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CalendarRootPropsWithoutHTML>;

export type CalendarCellSnippetProps = {
	disabled: boolean;
	unavailable: boolean;
	selected: boolean;
};

export type CalendarCellPropsWithoutHTML = WithChild<
	{
		/**
		 * The date value of the cell.
		 *
		 * @required
		 */
		date: DateValue;

		/**
		 * The month DateValue that this cell is being rendered in.
		 */
		month: DateValue;
	},
	CalendarCellSnippetProps
>;

export type CalendarCellProps = CalendarCellPropsWithoutHTML &
	Without<BitsPrimitiveTdAttributes, CalendarCellPropsWithoutHTML>;

export type CalendarGridPropsWithoutHTML = WithChild;

export type CalendarGridProps = CalendarGridPropsWithoutHTML &
	Without<BitsPrimitiveTableAttributes, CalendarGridPropsWithoutHTML>;

export type CalendarGridBodyPropsWithoutHTML = WithChild;

export type CalendarGridBodyProps = CalendarGridBodyPropsWithoutHTML &
	Without<BitsPrimitiveTbodyAttributes, CalendarGridBodyPropsWithoutHTML>;

export type CalendarGridHeadPropsWithoutHTML = WithChild;

export type CalendarGridHeadProps = CalendarGridHeadPropsWithoutHTML &
	Without<BitsPrimitiveTheadAttributes, CalendarGridHeadPropsWithoutHTML>;

export type CalendarHeadCellPropsWithoutHTML = WithChild;

export type CalendarHeadCellProps = CalendarHeadCellPropsWithoutHTML &
	Without<BitsPrimitiveThAttributes, CalendarHeadCellPropsWithoutHTML>;

export type CalendarGridRowPropsWithoutHTML = WithChild;

export type CalendarGridRowProps = CalendarGridRowPropsWithoutHTML &
	Without<BitsPrimitiveTrAttributes, CalendarGridRowPropsWithoutHTML>;

export type CalendarHeaderPropsWithoutHTML = WithChild;

export type CalendarHeaderProps = CalendarHeaderPropsWithoutHTML &
	Without<BitsPrimitiveHeaderAttributes, CalendarHeaderPropsWithoutHTML>;

export type CalendarHeadingSnippetProps = {
	headingValue: string;
};

export type CalendarHeadingPropsWithoutHTML = WithChild<{}, CalendarHeadingSnippetProps>;

export type CalendarDaySnippetProps = {
	disabled: boolean;
	unavailable: boolean;
	selected: boolean;
	day: string;
};

export type CalendarDayPropsWithoutHTML = WithChild<{}, CalendarDaySnippetProps>;

export type CalendarDayProps = CalendarDayPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CalendarDayPropsWithoutHTML>;

export type CalendarHeadingProps = CalendarHeadingPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CalendarHeadingPropsWithoutHTML>;

export type CalendarNextButtonPropsWithoutHTML = WithChild;

export type CalendarNextButtonProps = CalendarNextButtonPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, CalendarNextButtonPropsWithoutHTML>;

export type CalendarPrevButtonPropsWithoutHTML = WithChild;

export type CalendarPrevButtonProps = CalendarPrevButtonPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, CalendarPrevButtonPropsWithoutHTML>;
