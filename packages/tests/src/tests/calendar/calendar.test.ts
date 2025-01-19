import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils.js";
import { getSelectedDay, getSelectedDays } from "../helpers/calendar.js";
import CalendarTest, { type CalendarSingleTestProps } from "./calendar-test.svelte";
import CalendarMultiTest, { type CalendarMultiTestProps } from "./calendar-multi-test.svelte";

const kbd = getTestKbd();

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

const narrowWeekdays = ["S", "M", "T", "W", "T", "F", "S"];
const shortWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const longWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October" ,"November", "December"];

function setup(props: Partial<CalendarSingleTestProps> = {}) {
	const user = userEvent.setup();
	const returned = render(CalendarTest, { ...props, type: "single" });
	const calendar = returned.getByTestId("calendar");
	expect(calendar).toBeVisible();
	return { ...returned, user, calendar };
}

function setupMulti(props: Partial<CalendarMultiTestProps> = {}) {
	const user = userEvent.setup();
	const returned = render(CalendarMultiTest, { ...props, type: "multiple" });
	const calendar = returned.getByTestId("calendar");
	expect(calendar).toBeVisible();
	return { ...returned, user, calendar };
}

describe("calendar", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(CalendarTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should respect a default value if provided - `CalendarDate`", async () => {
		const { calendar, getByTestId } = setup({ value: calendarDate });

		expect(getSelectedDay(calendar)).toHaveTextContent(String(calendarDate.day));
		expect(getByTestId("heading")).toHaveTextContent("January 1980");
	});

	it("should respect a default value if provided - `CalendarDateTime`", async () => {
		const { calendar, getByTestId } = setup({ value: calendarDateTime });

		expect(getSelectedDay(calendar)).toHaveTextContent(String(calendarDateTime.day));
		expect(getByTestId("heading")).toHaveTextContent("January 1980");
	});

	it("should respect a default value if provided - `ZonedDateTime`", async () => {
		const { calendar, getByTestId } = setup({ value: zonedDateTime });

		expect(getSelectedDay(calendar)).toHaveTextContent(String(zonedDateTime.day));
		expect(getByTestId("heading")).toHaveTextContent("January 1980");
	});

	it("should  bind to `value` - `CalendarDate`", async () => {
		const { getByTestId, user } = setup({ value: calendarDate });

		const addDayBtn = getByTestId("add-day");
		await user.click(addDayBtn);
		const valueEl = getByTestId("value");
		expect(valueEl).toHaveTextContent("1980-01-21");

		const addMonthBtn = getByTestId("add-month");
		await user.click(addMonthBtn);
		expect(valueEl).toHaveTextContent("1980-02-21");

		const addYearBtn = getByTestId("add-year");
		await user.click(addYearBtn);
		expect(valueEl).toHaveTextContent("1981-02-21");
	});

	it("should bind to `value` - `CalendarDateTime`", async () => {
		const { getByTestId, user } = setup({ value: calendarDateTime });

		const addDayBtn = getByTestId("add-day");
		await user.click(addDayBtn);
		const valueEl = getByTestId("value");
		expect(valueEl).toHaveTextContent("1980-01-21");

		const addMonthBtn = getByTestId("add-month");
		await user.click(addMonthBtn);
		expect(valueEl).toHaveTextContent("1980-02-21");

		const addYearBtn = getByTestId("add-year");
		await user.click(addYearBtn);
		expect(valueEl).toHaveTextContent("1981-02-21");
	});

	it("properly binds to `value` - `ZonedDateTime`", async () => {
		const { getByTestId, user } = setup({ value: zonedDateTime });

		const addDayBtn = getByTestId("add-day");
		await user.click(addDayBtn);
		const valueEl = getByTestId("value");
		expect(valueEl).toHaveTextContent("1980-01-21");

		const addMonthBtn = getByTestId("add-month");
		await user.click(addMonthBtn);
		expect(valueEl).toHaveTextContent("1980-02-21");

		const addYearBtn = getByTestId("add-year");
		await user.click(addYearBtn);
		expect(valueEl).toHaveTextContent("1981-02-21");
	});

	it("should navigate the months forward using the next button", async () => {
		const { getByTestId, user } = setup({ value: calendarDate });

		const heading = getByTestId("heading");
		const nextBtn = getByTestId("next-button");

		for (const month of months) {
			expect(heading).toHaveTextContent(`${month} 1980`);
			await user.click(nextBtn);
		}
		expect(heading).toHaveTextContent("January 1981");
	});

	it("should navigate the months backwards using the prev button", async () => {
		const { getByTestId, user } = setup({ value: calendarDate });

		const heading = getByTestId("heading");
		const prevBtn = getByTestId("prev-button");
		const newMonths = [...months].reverse();
		newMonths.pop();

		expect(heading).toHaveTextContent("January 1980");
		await user.click(prevBtn);

		for (const month of newMonths) {
			expect(heading).toHaveTextContent(`${month} 1979`);
			await user.click(prevBtn);
		}
		expect(heading).toHaveTextContent("January 1979");
	});

	it("should allow dates to be deselected by clicking the selected date", async () => {
		const { getByTestId, user, calendar } = setup({
			value: calendarDate,
		});

		const value = getByTestId("value");
		expect(value).toHaveTextContent("1980-01-20");

		const selectedDay = getSelectedDay(calendar);
		expect(selectedDay).toHaveTextContent(String(calendarDate.day));

		await user.click(selectedDay);
		expect(value).toHaveTextContent("undefined");
	});

	it.each([kbd.ENTER, kbd.SPACE])("should allow deselection with %s key", async (key) => {
		const { getByTestId, user, calendar } = setup({
			value: calendarDate,
		});

		const value = getByTestId("value");
		expect(value).toHaveTextContent("1980-01-20");

		const selectedDay = getSelectedDay(calendar);
		expect(selectedDay).toHaveTextContent(String(calendarDate.day));
		selectedDay.focus();
		await user.keyboard(key);
		expect(value).toHaveTextContent("undefined");
	});

	it("should allow selection with mouse", async () => {
		const { getByTestId, user } = setup({
			placeholder: zonedDateTime,
		});

		const secondDayInMonth = getByTestId("date-1-2");
		expect(secondDayInMonth).toHaveTextContent("2");
		await user.click(secondDayInMonth);

		const newDate = zonedDateTime.set({ day: 2 });
		expect(getByTestId("value")).toHaveTextContent(newDate.toString());
	});

	it.each([kbd.SPACE, kbd.ENTER])("should allow selection with %s key", async (key) => {
		const { getByTestId, user } = setup({
			placeholder: zonedDateTime,
		});

		const secondDayInMonth = getByTestId("date-1-2");
		expect(secondDayInMonth).toHaveTextContent("2");
		secondDayInMonth.focus();
		await user.keyboard(key);

		const newDate = zonedDateTime.set({ day: 2 });
		expect(getByTestId("value")).toHaveTextContent(newDate.toString());
	});

	it("should display multiple months when `numberOfMonths` is greater than 1", async () => {
		const { getByTestId, calendar, user } = setup({
			value: calendarDateTime,
			numberOfMonths: 2,
		});

		const selectedDay = getSelectedDay(calendar);
		expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January - February 1980");

		const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();
		const firstMonthDay = getByTestId("date-1-12");
		expect(firstMonthDay).toHaveTextContent("12");
		expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);

		const secondMonthDay = getByTestId("date-2-15");
		const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();
		expect(secondMonthDay).toHaveTextContent("15");
		expect(secondMonthDay).toHaveAttribute("data-value", secondMonthDayDateStr);

		const prevButton = getByTestId("prev-button");
		const nextButton = getByTestId("next-button");

		await user.click(nextButton);
		expect(heading).toHaveTextContent("February - March 1980");
		expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);

		await user.click(prevButton);
		expect(heading).toHaveTextContent("January - February 1980");
		expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);

		await user.click(prevButton);
		expect(heading).toHaveTextContent("December 1979 - January 1980");
		expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);
	});

	it("should handles `pagedNavigation` with multiple months", async () => {
		const { getByTestId, calendar, user } = setup({
			value: calendarDateTime,
			numberOfMonths: 2,
			pagedNavigation: true,
		});

		const selectedDay = getSelectedDay(calendar);
		expect(selectedDay).toHaveTextContent(String(calendarDateTime.day));

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January - February 1980");

		const firstMonthDayDateStr = calendarDateTime.set({ day: 12 }).toString();
		const firstMonthDay = getByTestId("date-1-12");
		expect(firstMonthDay).toHaveTextContent("12");
		expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);

		const secondMonthDay = getByTestId("date-2-15");
		const secondMonthDayDateStr = calendarDateTime.set({ day: 15, month: 2 }).toString();
		expect(secondMonthDay).toHaveTextContent("15");
		expect(secondMonthDay).toHaveAttribute("data-value", secondMonthDayDateStr);

		const prevButton = getByTestId("prev-button");
		const nextButton = getByTestId("next-button");

		await user.click(nextButton);
		expect(heading).toHaveTextContent("March - April 1980");
		expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);

		await user.click(prevButton);
		expect(heading).toHaveTextContent("January - February 1980");
		expect(firstMonthDay).toHaveAttribute("data-value", firstMonthDayDateStr);

		await user.click(prevButton);
		expect(heading).toHaveTextContent("November - December 1979");
		expect(firstMonthDay).not.toHaveAttribute("data-value", firstMonthDayDateStr);
	});

	it("should renders six weeks when `fixedWeeks` is `true`", async () => {
		const { getByTestId, calendar, user } = setup({
			value: calendarDate,
			fixedWeeks: true,
		});

		function getNumberOfWeeks() {
			return calendar.querySelectorAll("[data-week]").length;
		}

		const nextButton = getByTestId("next-button");

		for (let i = 0; i < 12; i++) {
			expect(getNumberOfWeeks()).toBe(6);
			await user.click(nextButton);
		}

		for (let i = 0; i < 24; i++) {
			expect(getNumberOfWeeks()).toBe(6);
			await user.click(nextButton);
		}
	});

	it("should update the selected date when value controlled externally", async () => {
		const { getByTestId, user, calendar } = setup({
			value: calendarDate,
		});

		const selectedDate = getSelectedDay(calendar);
		expect(selectedDate).toHaveTextContent("20");
		expect(getSelectedDays(calendar).length).toBe(1);

		const addDayBtn = getByTestId("add-day");
		await user.click(addDayBtn);
		expect(getSelectedDay(calendar)).toHaveTextContent("21");
		expect(getSelectedDays(calendar).length).toBe(1);
	});

	it("should change view when controlled placeholder changes", async () => {
		const { getByTestId, user } = setup({
			placeholder: calendarDate,
		});

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");
		const addMonthBtn = getByTestId("add-month");
		await user.click(addMonthBtn);
		expect(heading).toHaveTextContent("February 1980");
		const addYearBtn = getByTestId("add-year");
		await user.click(addYearBtn);
		expect(heading).toHaveTextContent("February 1981");
		await user.click(addMonthBtn);
		await user.click(addMonthBtn);
		await user.click(addMonthBtn);
		expect(heading).toHaveTextContent("May 1981");
	});

	it("should not allow navigation before the `minValue` (prev button)", async () => {
		const { getByTestId, user } = setup({
			value: calendarDate,
			minValue: new CalendarDate(1979, 11, 25),
		});

		const prevBtn = getByTestId("prev-button");
		await user.click(prevBtn);
		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("December 1979");
		expect(prevBtn).not.toHaveAttribute("aria-disabled", "true");
		expect(prevBtn).not.toHaveAttribute("data-disabled");

		await user.click(prevBtn);
		expect(heading).toHaveTextContent("November 1979");
		expect(prevBtn).toHaveAttribute("aria-disabled", "true");
		expect(prevBtn).toHaveAttribute("data-disabled");

		await user.click(prevBtn);
		expect(heading).toHaveTextContent("November 1979");
	});

	it("should not allow navigation after the `maxValue` (next button)", async () => {
		const { getByTestId, user } = setup({
			value: calendarDate,
			maxValue: new CalendarDate(1980, 3, 25),
		});

		const nextBtn = getByTestId("next-button");
		await user.click(nextBtn);
		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("February 1980");
		expect(nextBtn).not.toHaveAttribute("aria-disabled", "true");
		expect(nextBtn).not.toHaveAttribute("data-disabled");

		await user.click(nextBtn);
		expect(heading).toHaveTextContent("March 1980");
		expect(nextBtn).toHaveAttribute("aria-disabled", "true");
		expect(nextBtn).toHaveAttribute("data-disabled");

		await user.click(nextBtn);
		expect(heading).toHaveTextContent("March 1980");
	});

	it("should not navigate after `maxValue` (with keyboard)", async () => {
		const { getByTestId, user } = setup({
			value: calendarDate,
			maxValue: new CalendarDate(1980, 3, 31),
		});

		const firstDayInMonth = getByTestId("date-1-1");
		firstDayInMonth.focus();
		expect(firstDayInMonth).toHaveFocus();

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");

		// five keypresses to February 1980
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-1-8")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-1-15")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-1-22")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-1-29")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-2-5")).toHaveFocus();
		expect(heading).toHaveTextContent("February 1980");

		// four keypresses to March 1980
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-2-12")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-2-19")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-2-26")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-3-4")).toHaveFocus();
		expect(heading).toHaveTextContent("March 1980");

		// four keypresses to April 1980
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-3-11")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-3-18")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-3-25")).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId("date-3-25")).toHaveFocus();
		expect(heading).toHaveTextContent("March 1980");
	});

	it("should not navigate before `minValue` (with keyboard)", async () => {
		const { getByTestId, user } = setup({
			value: calendarDate,
			minValue: new CalendarDate(1979, 12, 1),
		});

		const firstDayInMonth = getByTestId("date-1-1");
		firstDayInMonth.focus();
		expect(firstDayInMonth).toHaveFocus();

		const heading = getByTestId("heading");
		expect(heading).toHaveTextContent("January 1980");

		// one keypress to get to December 1979
		await user.keyboard(kbd.ARROW_UP);
		expect(getByTestId("date-12-25")).toHaveFocus();
		expect(heading).toHaveTextContent("December 1979");

		// four keypresses to November 1979
		await user.keyboard(kbd.ARROW_UP);
		expect(getByTestId("date-12-18")).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(getByTestId("date-12-11")).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(getByTestId("date-12-4")).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(getByTestId("date-12-4")).toHaveFocus();
		expect(heading).toHaveTextContent("December 1979");
	});

	it("should handle unavailable dates appropriately", async () => {
		const { getByTestId, user } = setup({
			placeholder: calendarDate,
			isDateUnavailable: (date) => {
				return date.day === 3;
			},
		});

		const thirdDayInMonth = getByTestId("date-1-3");
		expect(thirdDayInMonth).toHaveTextContent("3");
		expect(thirdDayInMonth).toHaveAttribute("data-unavailable");
		expect(thirdDayInMonth).toHaveAttribute("aria-disabled", "true");
		await user.click(thirdDayInMonth);
		expect(thirdDayInMonth).not.toHaveAttribute("data-selected");
	});

	it("should not allow focus or interaction when `disabled` is `true`", async () => {
		const { getByTestId, user } = setup({
			placeholder: calendarDate,
			disabled: true,
		});

		const grid = getByTestId("grid-1");
		expect(grid).toHaveAttribute("aria-disabled", "true");
		expect(grid).toHaveAttribute("data-disabled");

		const firstDayOfMonth = getByTestId("date-1-1");
		expect(firstDayOfMonth).toHaveAttribute("aria-disabled", "true");
		expect(firstDayOfMonth).toHaveAttribute("data-disabled");
		await user.click(firstDayOfMonth);
		expect(firstDayOfMonth).not.toHaveAttribute("data-selected");
		firstDayOfMonth.focus();
		expect(firstDayOfMonth).not.toHaveFocus();

		const tenthDayOfMonth = getByTestId("date-1-10");
		expect(tenthDayOfMonth).toHaveAttribute("aria-disabled", "true");
		expect(tenthDayOfMonth).toHaveAttribute("data-disabled");
		await user.click(tenthDayOfMonth);
		expect(tenthDayOfMonth).not.toHaveAttribute("data-selected");
		tenthDayOfMonth.focus();
		expect(tenthDayOfMonth).not.toHaveFocus();
	});

	it("should prevent selection but allows focus when `readonly` is `true`", async () => {
		const { getByTestId, user } = setup({
			placeholder: calendarDate,
			readonly: true,
		});

		const grid = getByTestId("grid-1");
		expect(grid).toHaveAttribute("aria-readonly", "true");
		expect(grid).toHaveAttribute("data-readonly");

		const firstDayOfMonth = getByTestId("date-1-1");
		await user.click(firstDayOfMonth);
		expect(firstDayOfMonth).not.toHaveAttribute("data-selected");
		firstDayOfMonth.focus();
		expect(firstDayOfMonth).toHaveFocus();

		const tenthDayOfMonth = getByTestId("date-1-10");
		await user.click(tenthDayOfMonth);
		expect(tenthDayOfMonth).not.toHaveAttribute("data-selected");
		tenthDayOfMonth.focus();
		expect(tenthDayOfMonth).toHaveFocus();
	});

	it("should format the weekday labels correctly - `'narrow'`", async () => {
		const { getByTestId } = setup({
			placeholder: calendarDate,
			weekdayFormat: "narrow",
		});
		for (const [i, weekday] of narrowWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("should format the weekday labels correctly - `'short'`", async () => {
		const { getByTestId } = setup({
			placeholder: calendarDate,
			weekdayFormat: "short",
		});
		for (const [i, weekday] of shortWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});

	it("should format the weekday labels correctly - `'long'`", async () => {
		const { getByTestId } = setup({
			placeholder: calendarDate,
			weekdayFormat: "long",
		});
		for (const [i, weekday] of longWeekdays.entries()) {
			const weekdayEl = getByTestId(`weekday-1-${i}`);
			expect(weekdayEl).toHaveTextContent(weekday);
		}
	});
});

describe("calendar - `multiple`", () => {
	it("should handle default value when `value` prop is provided - `CalendarDate[]`", async () => {
		const d1 = new CalendarDate(1980, 1, 2);
		const d2 = new CalendarDate(1980, 1, 5);

		const { calendar } = setupMulti({
			value: [d1, d2],
		});

		const selectedDays = getSelectedDays(calendar);
		expect(selectedDays.length).toBe(2);
		expect(selectedDays[0]).toHaveTextContent(String(d1.day));
		expect(selectedDays[1]).toHaveTextContent(String(d2.day));
	});

	it("should handle default value when `value` prop is provided - `CalendarDateTime[]`", async () => {
		const d1 = new CalendarDateTime(1980, 1, 2);
		const d2 = new CalendarDateTime(1980, 1, 5);

		const { calendar } = setupMulti({
			value: [d1, d2],
		});

		const selectedDays = getSelectedDays(calendar);
		expect(selectedDays.length).toBe(2);
		expect(selectedDays[0]).toHaveTextContent(String(d1.day));
		expect(selectedDays[1]).toHaveTextContent(String(d2.day));
	});

	it("should handle default value when `value` prop is provided - `ZonedDateTime[]`", async () => {
		const d1 = toZoned(new CalendarDateTime(1980, 1, 2), "America/New_York");
		const d2 = toZoned(new CalendarDateTime(1980, 1, 5), "America/New_York");

		const { calendar } = setupMulti({
			value: [d1, d2],
		});

		const selectedDays = getSelectedDays(calendar);
		expect(selectedDays.length).toBe(2);
		expect(selectedDays[0]).toHaveTextContent(String(d1.day));
		expect(selectedDays[1]).toHaveTextContent(String(d2.day));
	});

	it("should set placeholder to last value in `value` prop", async () => {
		const d1 = new CalendarDate(1980, 1, 2);
		const d2 = new CalendarDate(1980, 5, 5);

		const { calendar, getByTestId } = setupMulti({
			value: [d1, d2],
		});

		const selectedDays = getSelectedDays(calendar);
		expect(selectedDays.length).toBe(1);
		expect(getByTestId("heading")).toHaveTextContent("May 1980");
	});

	it("should allow deselection", async () => {
		const d1 = new CalendarDate(1980, 1, 2);
		const d2 = new CalendarDate(1980, 1, 5);

		const { calendar, user } = setupMulti({
			value: [d1, d2],
		});
		const selectedDays = getSelectedDays(calendar);
		expect(selectedDays.length).toBe(2);
		await user.click(selectedDays[0] as HTMLElement);
		expect(getSelectedDays(calendar).length).toBe(1);
	});

	it("should prevent deselection when only one date is selected and `preventDeselect` is `true`", async () => {
		const d1 = new CalendarDate(1980, 1, 2);

		const { calendar, user } = setupMulti({
			value: [d1],
			preventDeselect: true,
		});
		const selectedDays = getSelectedDays(calendar);
		await user.click(selectedDays[0] as HTMLElement);
		const selectedDays2 = getSelectedDays(calendar);
		expect(selectedDays2.length).toBe(1);
		await user.click(selectedDays2[0] as HTMLElement);
		expect(getSelectedDays(calendar).length).toBe(1);
	});
});
