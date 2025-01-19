import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import {
	CalendarDate,
	CalendarDateTime,
	type DateFields,
	type TimeFields,
	now,
	parseAbsoluteToLocal,
	toZoned,
} from "@internationalized/date";
import { getTestKbd, setupUserEvents } from "../utils.js";
import DateFieldTest, { type DateFieldTestProps } from "./date-field-test.svelte";

const kbd = getTestKbd();

const TIME_PLACEHOLDER = "––";

const calendarDate = new CalendarDate(1980, 1, 20);
const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

function setup(props: DateFieldTestProps = {}) {
	const user = setupUserEvents();
	const returned = render(DateFieldTest, { ...props });
	const month = returned.getByTestId("month");
	const day = returned.getByTestId("day");
	const year = returned.getByTestId("year");
	const value = returned.getByTestId("value");
	const input = returned.getByTestId("input");
	const label = returned.getByTestId("label");

	return { ...returned, user, month, day, year, value, input, label };
}

describe("date field", () => {
	it("should have no axe violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should populate segment with value - `CalendarDate`", async () => {
		const { month, day, year, value } = setup({
			value: calendarDate,
		});

		expect(month).toHaveTextContent(String(calendarDate.month));
		expect(day).toHaveTextContent(String(calendarDate.day));
		expect(year).toHaveTextContent(String(calendarDate.year));
		expect(value).toHaveTextContent(calendarDate.toString());
	});

	it("should populate segment with value - `CalendarDateTime`", async () => {
		const { month, day, year, value, getByTestId } = setup({
			value: calendarDateTime,
		});

		expect(month).toHaveTextContent(String(calendarDateTime.month));
		expect(day).toHaveTextContent(String(calendarDateTime.day));
		expect(year).toHaveTextContent(String(calendarDateTime.year));
		expect(getByTestId("hour")).toHaveTextContent(String(calendarDateTime.hour));
		expect(getByTestId("minute")).toHaveTextContent(String(calendarDateTime.minute));
		expect(value).toHaveTextContent(calendarDate.toString());
	});

	it("should populate segment with value - `ZonedDateTime`", async () => {
		const { month, day, year, value, getByTestId } = setup({
			value: zonedDateTime,
		});

		expect(month).toHaveTextContent(String(zonedDateTime.month));
		expect(day).toHaveTextContent(String(zonedDateTime.day));
		expect(year).toHaveTextContent(String(zonedDateTime.year));
		expect(getByTestId("hour")).toHaveTextContent(String(zonedDateTime.hour));
		expect(getByTestId("minute")).toHaveTextContent(String(zonedDateTime.minute));
		expect(getByTestId("dayPeriod")).toHaveTextContent("PM");
		expect(getByTestId("timeZoneName")).toHaveTextContent("EST");
		expect(value).toHaveTextContent(calendarDate.toString());
	});

	it("should change segment positioning based on `locale`", async () => {
		const { input } = setup({
			locale: "en-UK",
		});

		const firstSeg = input.children[0];
		// skipping the literal slashes here
		const secondSeg = input.children[2];
		const thirdSeg = input.children[4];

		expect(firstSeg).toHaveTextContent("dd");
		expect(secondSeg).toHaveTextContent("mm");
		expect(thirdSeg).toHaveTextContent("yyyy");
	});

	it("should not show the day period for locales that don't use them", async () => {
		const { queryByTestId } = setup({
			locale: "en-UK",
			value: calendarDateTime,
		});
		expect(queryByTestId("dayPeriod")).toBeNull();
	});

	it("should show the day period for locales that do use them", async () => {
		const { queryByTestId } = setup({
			value: calendarDateTime,
		});
		expect(queryByTestId("dayPeriod")).not.toBeNull();
	});

	it("should focus first segment on label click", async () => {
		const { user, label, month } = setup();
		await user.click(label);
		expect(month).toHaveFocus();
	});

	it("should focus segments on click", async () => {
		const { user, day, month, year, getByTestId } = setup({
			value: zonedDateTime,
		});

		const hour = getByTestId("hour");
		const minute = getByTestId("minute");
		const dayPeriod = getByTestId("dayPeriod");
		const timeZoneName = getByTestId("timeZoneName");
		const segments = [day, month, year, hour, minute, dayPeriod, timeZoneName];

		for (const segment of segments) {
			await user.click(segment);
			expect(segment).toHaveFocus();
		}
	});

	it("should increment segment on arrow up", async () => {
		const { user, day, month, year, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const hour = getByTestId("hour");
		const minute = getByTestId("minute");
		const second = getByTestId("second");

		function cycle(segment: keyof TimeFields | keyof DateFields) {
			return String(zonedDateTime.cycle(segment, 1)[segment]);
		}

		await user.click(day);
		await user.keyboard(kbd.ARROW_UP);
		expect(day).toHaveTextContent(cycle("day"));
		await user.click(month);
		await user.keyboard(kbd.ARROW_UP);
		expect(month).toHaveTextContent(cycle("month"));
		await user.click(year);
		await user.keyboard(kbd.ARROW_UP);
		expect(year).toHaveTextContent(cycle("year"));
		await user.click(hour);
		await user.keyboard(kbd.ARROW_UP);
		expect(hour).toHaveTextContent("1");
		await user.click(minute);
		await user.keyboard(kbd.ARROW_UP);
		expect(minute).toHaveTextContent(cycle("minute"));
		await user.click(second);
		await user.keyboard(kbd.ARROW_UP);
		expect(second).toHaveTextContent(cycle("second"));
	});

	it("should decrement segment on arrow down", async () => {
		const { user, day, month, year, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const hour = getByTestId("hour");
		const minute = getByTestId("minute");
		const second = getByTestId("second");

		function cycle(segment: keyof TimeFields | keyof DateFields) {
			return String(zonedDateTime.cycle(segment, -1)[segment]);
		}

		await user.click(day);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(day).toHaveTextContent(cycle("day"));
		await user.click(month);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(month).toHaveTextContent(cycle("month"));
		await user.click(year);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(year).toHaveTextContent(cycle("year"));
		await user.click(hour);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(hour).toHaveTextContent(cycle("hour"));
		await user.click(minute);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(minute).toHaveTextContent(cycle("minute"));
		await user.click(second);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(second).toHaveTextContent(cycle("second"));
	});

	it("should navigate segments using the arrow keys", async () => {
		const { getByTestId, user, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const { getHour, getMinute, getSecond, getDayPeriod, getTimeZoneName } =
			getTimeSegments(getByTestId);

		const segments = [
			month,
			day,
			year,
			getHour(),
			getMinute(),
			getSecond(),
			getDayPeriod(),
			getTimeZoneName(),
		];

		await user.click(month);

		for (const seg of segments) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.ARROW_RIGHT);
		}
		expect(getTimeZoneName()).toHaveFocus();

		for (const seg of segments.reverse()) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.ARROW_LEFT);
		}
		expect(month).toHaveFocus();
	});

	it("should navigate the segments using tab", async () => {
		const { getByTestId, user, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const { getHour, getMinute, getSecond, getDayPeriod, getTimeZoneName } =
			getTimeSegments(getByTestId);

		const segments = [month, day, year, getHour(), getMinute(), getSecond(), getDayPeriod()];

		await user.click(month);

		for (const seg of segments) {
			expect(seg).toHaveFocus();
			await user.keyboard(kbd.TAB);
		}
		expect(getTimeZoneName()).toHaveFocus();

		for (const seg of segments.reverse()) {
			await user.keyboard(kbd.SHIFT_TAB);
			expect(seg).toHaveFocus();
		}
	});

	it("should prevent interaction when `disabled`", async () => {
		const { user, getByTestId, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
			disabled: true,
		});

		const { getHour, getMinute, getSecond, getDayPeriod, getTimeZoneName } =
			getTimeSegments(getByTestId);

		const segments = [
			month,
			day,
			year,
			getHour(),
			getMinute(),
			getSecond(),
			getDayPeriod(),
			getTimeZoneName(),
		];

		for (const seg of segments) {
			await user.click(seg);
			expect(seg).not.toHaveFocus();
		}
	});

	it("should prevent modification when `readonly`", async () => {
		const { user, getByTestId, day, month, year } = setup({
			value: zonedDateTime,
			granularity: "second",
			readonly: true,
		});
		const { getHour, getMinute, getSecond } = getTimeSegments(getByTestId);
		const segments = [month, day, year, getHour(), getMinute(), getSecond()];

		for (const segment of segments) {
			await user.click(segment);
			expect(segment).toHaveFocus();
			await user.keyboard(kbd.ARROW_UP);
			expect(segment).toHaveTextContent(
				String(
					zonedDateTime[segment.dataset.segment as keyof TimeFields | keyof DateFields]
				)
			);
		}
	});

	it("should marks the field as invalid if the value is invalid", async () => {
		const { getByTestId, day, month, year, input, label, user } = setup({
			granularity: "second",
			validate: (date) => (date.day === 19 ? "Invalid date" : undefined),
			value: zonedDateTime,
		});

		const { getHour, getMinute, getSecond, getDayPeriod, getTimeZoneName } =
			getTimeSegments(getByTestId);
		const segments = [
			month,
			day,
			year,
			getHour(),
			getMinute(),
			getSecond(),
			getDayPeriod(),
			getTimeZoneName(),
		];

		await user.click(month);
		await user.keyboard(`{2}`);
		expect(month).toHaveTextContent("2");
		expect(day).toHaveFocus();
		await user.keyboard(`{19}`);
		expect(day).toHaveTextContent("19");
		expect(year).toHaveFocus();
		await user.keyboard(`{1111}`);
		expect(year).toHaveTextContent("1111");

		for (const seg of segments) {
			expect(seg).toHaveAttribute("aria-invalid", "true");
			expect(seg).toHaveAttribute("data-invalid");
		}

		expect(input).toHaveAttribute("data-invalid");
		expect(label).toHaveAttribute("data-invalid");
	});

	it("should adjust the hour cycle with the `hourCycle` prop", async () => {
		const { getByTestId, queryByTestId, user } = setup({
			value: zonedDateTime,
			hourCycle: 24,
		});

		expect(queryByTestId("dayPeriod")).toBeNull();
		const hour = getByTestId("hour");
		expect(hour).toHaveTextContent("12");
		await user.click(hour);
		expect(hour).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(hour).toHaveTextContent("13");
	});

	it("should override the default displayed segments with the `granularity` prop - `'day'`", async () => {
		const { queryByTestId, month, day, year } = setup({
			value: calendarDateTime,
			granularity: "day",
		});

		const nonDisplayedSegments = ["hour", "minute", "second", "dayPeriod"];
		const displayedSegments = [month, day, year];
		for (const seg of nonDisplayedSegments) {
			expect(queryByTestId(seg)).toBeNull();
		}

		for (const seg of displayedSegments) {
			expect(seg).toBeVisible();
		}
	});

	it("should override the default displayed segments with the `granularity` prop - `'minute'`", async () => {
		const { queryByTestId, getByTestId, month, day, year } = setup({
			value: calendarDateTime,
			granularity: "minute",
		});

		const displayedSegments = [
			month,
			day,
			year,
			getByTestId("hour"),
			getByTestId("minute"),
			getByTestId("dayPeriod"),
		];

		expect(queryByTestId("second")).toBeNull();

		for (const seg of displayedSegments) {
			expect(seg).toBeVisible();
		}
	});

	it("should change the value when the dayPeriod segment is changed", async () => {
		const { getByTestId, user, value } = setup({
			value: calendarDateTime,
		});

		expect(value).toHaveTextContent("1980-01-20T12:30");
		const dayPeriod = getByTestId("dayPeriod");
		expect(dayPeriod).toHaveTextContent("PM");

		await user.click(dayPeriod);
		expect(dayPeriod).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(dayPeriod).toHaveTextContent("AM");
		expect(value).toHaveTextContent("1980-01-20T00:30");
	});

	it("should go all the way through the segment with spamming 3", async () => {
		const { getByTestId, user, month, day, year } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		const { getHour, getMinute, getSecond, getDayPeriod } = getTimeSegments(getByTestId);

		await user.click(month);
		await user.keyboard(`{3}`);
		expect(day).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(year).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(getHour()).toHaveFocus();
		await user.keyboard(`{3}`);
		expect(getMinute()).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(getSecond()).toHaveFocus();
		await user.keyboard(`{3}`);
		await user.keyboard(`{3}`);
		expect(getDayPeriod()).toHaveFocus();
	});

	it("should overwrite on first click and type - `month`", async () => {
		const { user, month } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await user.click(month);
		expect(month).toHaveFocus();
		expect(month).toHaveTextContent(String(zonedDateTime.month));
		await user.keyboard(`{3}`);
		expect(month).toHaveTextContent("3");
	});

	it("should fully overwrite on first click and type - `day`", async () => {
		const { user, day } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await user.click(day);
		expect(day).toHaveFocus();
		expect(day).toHaveTextContent(String(zonedDateTime.day));
		await user.keyboard(`{1}`);
		expect(day).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `year`", async () => {
		const { user, year } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await user.click(year);
		expect(year).toHaveFocus();
		expect(year).toHaveTextContent(String(zonedDateTime.year));
		await user.keyboard(`{1}`);
		expect(year).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `hour`", async () => {
		const { user, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const hour = getByTestId("hour");

		await user.click(hour);
		expect(hour).toHaveFocus();
		expect(hour).toHaveTextContent(String(zonedDateTime.hour));
		await user.keyboard(`{1}`);
		expect(hour).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `minute`", async () => {
		const { user, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const minute = getByTestId("minute");

		await user.click(minute);
		expect(minute).toHaveFocus();
		expect(minute).toHaveTextContent(String(zonedDateTime.minute));
		await user.keyboard(`{1}`);
		expect(minute).toHaveTextContent("1");
	});

	it("should overwrite on first click and type - `second`", async () => {
		const { user, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second",
		});
		const second = getByTestId("second");

		await user.click(second);
		expect(second).toHaveFocus();
		expect(second).toHaveTextContent(String(zonedDateTime.second));
		await user.keyboard(`{1}`);
		expect(second).toHaveTextContent("1");
	});

	it("should move to the previous segment when backspace is pressed while empty - `day`", async () => {
		const { user, day, month } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await user.click(day);
		expect(day).toHaveFocus();
		expect(day).toHaveTextContent(String(zonedDateTime.day));
		await user.keyboard(kbd.BACKSPACE);
		expect(day).toHaveTextContent("2");
		await user.keyboard(kbd.BACKSPACE);
		expect(day).toHaveTextContent("dd");
		expect(day).toHaveFocus();
		await user.keyboard(kbd.BACKSPACE);
		expect(month).toHaveFocus();
	});

	it("should to the previous segment when backspace is pressed while empty - `year`", async () => {
		const { user, year, day } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		await user.click(year);
		expect(year).toHaveFocus();
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("198");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("19");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("1");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("yyyy");
		expect(year).toHaveFocus();
		await user.keyboard(kbd.BACKSPACE);
		expect(day).toHaveFocus();
	});

	it.skip("displays correct timezone with ZonedDateTime value - `now`", async () => {
		const { getByTestId } = setup({
			value: now("America/Los_Angeles"),
		});

		const timeZone = getByTestId("timeZoneName");
		if (isDaylightSavingsTime()) {
			expect(timeZone).toHaveTextContent("PDT");
		} else {
			expect(timeZone).toHaveTextContent("PST");
		}
	});

	it("should display correct timezone with ZonedDateTime value - absolute -> local", async () => {
		const { getByTestId } = setup({
			value: parseAbsoluteToLocal("2023-10-12T12:30:00Z"),
		});

		const timeZone = getByTestId("timeZoneName");
		expect(timeZone).toHaveTextContent(thisTimeZone("2023-10-12T12:30:00Z"));
	});

	it("should not allow changing the dayPeriod without a value", async () => {
		const { getByTestId, user } = setup({
			granularity: "second",
		});
		const { getDayPeriod, getHour } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent(TIME_PLACEHOLDER);
		await user.click(getDayPeriod());
		await user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent(TIME_PLACEHOLDER);
	});

	it("should handle backspacing the year segment appropriately", async () => {
		const { getByTestId, user, year } = setup({
			granularity: "hour",
		});

		year.focus();

		await user.keyboard(`{0}`);
		await user.keyboard(`{0}`);
		await user.keyboard(`{9}`);
		await user.keyboard(`{8}`);

		const { getHour } = getTimeSegments(getByTestId);
		const hour = getHour();
		expect(hour).toHaveFocus();

		await user.keyboard(kbd.ARROW_LEFT);
		expect(year).toHaveFocus();

		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("009");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("00");
		await user.keyboard(`{8}`);
		await user.keyboard(`{7}`);
		expect(year).toHaveTextContent("0087");
		expect(hour).toHaveFocus();
	});

	it("should allow going from 12PM -> 12AM without changing the display hour to 0", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent("12");

		await user.click(getDayPeriod());
		await user.keyboard(kbd.ARROW_UP);

		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");
	});

	it("should never allow the hour to be 0 when in a 12 hour cycle", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getDayPeriod } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent("12");

		await user.click(getDayPeriod());
		await user.keyboard(kbd.ARROW_UP);

		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");

		await user.click(getHour());
		await user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent("01");
		expect(getHour()).not.toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("AM");
		await user.click(getDayPeriod());
		await user.keyboard(kbd.ARROW_UP);
		expect(getHour()).toHaveTextContent("01");
		expect(getDayPeriod()).toHaveTextContent("PM");
		await user.click(getHour());
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getHour()).toHaveTextContent("12");
		expect(getDayPeriod()).toHaveTextContent("PM");
	});

	it("should add missing leading zeroes to the day,month, and year segments on focusout", async () => {
		const { user, month, day, year } = setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await user.click(month);
		await user.keyboard(`{1}`);
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(day).toHaveFocus();
		expect(month).toHaveTextContent("01");

		await user.keyboard(`{1}`);
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(year).toHaveFocus();
		expect(day).toHaveTextContent("01");
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("202");
		await user.keyboard(kbd.ARROW_LEFT);
		expect(day).toHaveFocus();
		expect(year).toHaveTextContent("0202");
	});

	it("should not intercept number keys when the ctrl or meta key is pressed, allowing default browser behavior", async () => {
		const { user, month } = setup({
			value: new CalendarDate(2023, 10, 12),
		});

		await user.click(month);
		await user.keyboard(`{1}`);
		await user.keyboard(`{2}`);
		expect(month).toHaveTextContent("12");

		await user.keyboard(`{Shift>}1{/Shift}`);
		expect(month).toHaveTextContent("12");

		await user.keyboard(`{Ctrl>}2{/Ctrl}`);
		expect(month).toHaveTextContent("12");

		await user.keyboard(`{Meta>}2{/Meta}`);
		expect(month).toHaveTextContent("12");
	});

	it("should not allow typing 24 hour cycle hours when the hourcycle is 12", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent("12");
		await user.click(getHour());
		await user.keyboard(`{1}{4}`);
		expect(getMinute()).toHaveFocus();
		expect(getHour()).toHaveTextContent("04");
	});

	it("should not go to zero on arrow navigation with a 12 hour cycle", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent("12");
		await user.click(getHour());
		await user.keyboard(`{1}{4}`);
		expect(getMinute()).toHaveFocus();
		expect(getHour()).toHaveTextContent("04");
		await user.click(getHour());
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getHour()).toHaveTextContent("12");
	});

	it("should allow double zeroes to be set in the minute segment", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent("12");
		await user.click(getMinute());
		await user.keyboard(`{0}{0}`);
		expect(getMinute()).toHaveTextContent("00");
	});

	it("should advance to the next segment when typing two zeroes into the minute segment", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 0, 0),
		});
		const { getHour, getMinute, getDayPeriod } = getTimeSegments(getByTestId);

		expect(getHour()).toHaveTextContent("12");
		await user.click(getMinute());
		await user.keyboard(`{0}{0}`);
		expect(getDayPeriod()).toHaveFocus();
	});

	it("should allow double zeroes to be set in the second segment", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getSecond } = getTimeSegments(getByTestId);

		expect(getSecond()).toHaveTextContent("30");
		await user.click(getSecond());
		await user.keyboard(`{0}{0}`);
		expect(getSecond()).toHaveTextContent("00");
	});

	it("should advance to the next segment when typing two zeroes into the second segment", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getSecond, getDayPeriod } = getTimeSegments(getByTestId);

		expect(getSecond()).toHaveTextContent("30");
		await user.click(getSecond());
		await user.keyboard(`{0}{0}`);
		expect(getDayPeriod()).toHaveFocus();
	});

	it("should not allow typing characters that are not `a` or `p` into the dayPeriod segment", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getDayPeriod } = getTimeSegments(getByTestId);

		expect(getDayPeriod()).toHaveTextContent("PM");
		await user.click(getDayPeriod());
		await user.keyboard("{i}{d}{k}");
		expect(getDayPeriod().textContent).toBe("PM");
	});

	it("should not allow typing non-numeric characters into the date/time segments", async () => {
		const { getByTestId, user, day, month, year } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});
		const { getHour, getMinute, getSecond } = getTimeSegments(getByTestId);

		const segments = [day, month, year, getHour(), getMinute(), getSecond()];

		for (const seg of segments) {
			await user.click(seg);
			await user.keyboard("{i}{d}{k}");
			expect(seg).not.toHaveTextContent("idk");
		}
	});

	it("should allow changing the day period with capital or lowercase `a` and `p`", async () => {
		const { getByTestId, user } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});

		const { getDayPeriod } = getTimeSegments(getByTestId);
		const dp = getDayPeriod();

		expect(dp).toHaveTextContent("PM");
		await user.click(dp);
		await user.keyboard("{Shift>}a{/Shift}");
		expect(dp).toHaveTextContent("AM");
		await user.keyboard("{Shift>}p{/Shift}");
		expect(dp).toHaveTextContent("PM");
		await user.keyboard("a");
		expect(dp).toHaveTextContent("AM");
		await user.keyboard("p");
		expect(dp).toHaveTextContent("PM");
	});

	it("should not allow more than 4 digits in the year segment, even if the user types more", async () => {
		const { user, year } = setup({
			value: new CalendarDate(2023, 10, 12),
		});
		await user.click(year);
		await user.keyboard(kbd.BACKSPACE);
		await user.keyboard(kbd.BACKSPACE);
		await user.keyboard(kbd.BACKSPACE);
		await user.keyboard(kbd.BACKSPACE);
		expect(year).toHaveTextContent("yyyy");
		for (const i of "222222") {
			await user.keyboard(i);
		}
		expect(year).not.toHaveTextContent("222222");
		expect(year).toHaveTextContent("2222");
	});

	it("should render a hidden input if the `name` prop is passed", async () => {
		const { container } = setup({
			name: "date-field",
		});
		const input = container.querySelector("input");
		expect(input).not.toBeNull();
		expect(input).toHaveAttribute("name", "date-field");
		expect(input).toHaveAttribute("aria-hidden", "true");
	});

	it("should not render a hidden input if the name prop isn't passed", async () => {
		const { container } = setup();
		const input = container.querySelector("input");
		expect(input).toBeNull();
	});

	it("should keep the value of the hidden input in sync with the fields value", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		const { container, year, user } = setup({
			name: "hello",
			value,
		});
		const input = container.querySelector("input");
		expect(input).toHaveValue(value.toString());

		await user.click(year);
		await user.keyboard(kbd.ARROW_UP);
		expect(input).toHaveValue(value.add({ years: 1 }).toString());
	});

	it("should handle 24 hour time appropriately", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		const { getByTestId, user } = setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(getByTestId);
		const hour = getHour();
		hour.focus();
		await user.keyboard("22");
		expect(hour).toHaveTextContent("22");
	});

	it("should allow 00 to be entered when hourCycle is 24", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0);
		const { getByTestId, user } = setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(getByTestId);
		const hour = getHour();
		hour.focus();
		await user.keyboard("00");
		expect(hour).toHaveTextContent("00");
	});

	it("navigating to 00 with ArrowUp/Down when hourCycle is 24 should show 00 and not 0", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 1, 30, 30, 0);
		const { getByTestId, user } = setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(getByTestId);
		const hour = getHour();
		hour.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(hour).toHaveTextContent("00");
		expect(hour.textContent).not.toBe("0");
		await user.keyboard(kbd.ARROW_DOWN);
		expect(hour).toHaveTextContent("23");
		await user.keyboard(kbd.ARROW_UP);
		expect(hour).toHaveTextContent("00");
	});

	it("should display correct hour when prepopulated with value and hourCycle is 24", async () => {
		const value = new CalendarDateTime(2023, 10, 12, 0, 30, 30, 0);
		const { getByTestId } = setup({
			name: "hello",
			value,
			hourCycle: 24,
		});

		const { getHour } = getTimeSegments(getByTestId);
		const hour = getHour();
		expect(hour).toHaveTextContent("00");
	});

	it("should reset the segment values when the value is reset", async () => {
		const { getByTestId, user, day, month, year } = setup({
			value: new CalendarDateTime(2023, 10, 12, 12, 30, 30, 0),
			granularity: "second",
		});

		const reset = getByTestId("reset");

		await user.click(reset);

		expect(day).toHaveTextContent("dd");
		expect(month).toHaveTextContent("mm");
		expect(year).toHaveTextContent("yyyy");
	});
});

/**
 * Since the time segments are not always present, this function returns an
 * object with functions that return the time segments if they exist, so they
 * can be used on an as-needed basis without invoking errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTimeSegments(getByTestId: (...args: any[]) => HTMLElement) {
	return {
		getHour: () => getByTestId("hour"),
		getMinute: () => getByTestId("minute"),
		getSecond: () => getByTestId("second"),
		getDayPeriod: () => getByTestId("dayPeriod"),
		getTimeZoneName: () => getByTestId("timeZoneName"),
	};
}

function isDaylightSavingsTime(): boolean {
	const now = new Date();
	const january = new Date(now.getFullYear(), 0, 1);
	const july = new Date(now.getFullYear(), 6, 1);
	const timezoneOffset = now.getTimezoneOffset();
	const isDaylightSavingsTime =
		timezoneOffset < Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
	return isDaylightSavingsTime;
}

function thisTimeZone(date: string): string {
	const timezone =
		Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
			.formatToParts(new Date(date))
			.find((p) => p.type === "timeZoneName")?.value ?? "";
	return timezone;
}
