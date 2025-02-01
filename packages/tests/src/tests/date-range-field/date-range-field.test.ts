import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
import { getTestKbd } from "../utils.js";
import DateRangeFieldTest, { type DateRangeFieldTestProps } from "./date-range-field-test.svelte";

const kbd = getTestKbd();

const calendarDate = {
	start: new CalendarDate(2022, 1, 1),
	end: new CalendarDate(2022, 3, 1),
};

const calendarDateTime = {
	start: new CalendarDateTime(2022, 1, 1, 12, 30),
	end: new CalendarDateTime(2022, 3, 1, 12, 30),
};
const zonedDateTime = {
	start: toZoned(calendarDateTime.start, "America/New_York"),
	end: toZoned(calendarDateTime.end, "America/New_York"),
};

function setup(props: DateRangeFieldTestProps = {}) {
	const user = userEvent.setup();
	const returned = render(DateRangeFieldTest, { ...props });

	const start = {
		month: returned.getByTestId("start-month"),
		day: returned.getByTestId("start-day"),
		year: returned.getByTestId("start-year"),
		value: returned.getByTestId("start-value"),
	};

	const end = {
		month: returned.getByTestId("end-month"),
		day: returned.getByTestId("end-day"),
		year: returned.getByTestId("end-year"),
		value: returned.getByTestId("end-value"),
	};

	const root = returned.getByTestId("root");
	const startInput = returned.getByTestId("start-input");
	const endInput = returned.getByTestId("end-input");

	const label = returned.getByTestId("label");

	return { ...returned, user, start, end, root, startInput, endInput, label };
}

describe("date range field", () => {
	it("should have no axe violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should populate segment with value - `CalendarDate`", async () => {
		const { start, end } = setup({
			value: calendarDate,
		});

		expect(start.month).toHaveTextContent(String(calendarDate.start.month));
		expect(start.day).toHaveTextContent(String(calendarDate.start.day));
		expect(start.year).toHaveTextContent(String(calendarDate.start.year));
		expect(start.value).toHaveTextContent(calendarDate.start.toString());

		expect(end.month).toHaveTextContent(String(calendarDate.end.month));
		expect(end.day).toHaveTextContent(String(calendarDate.end.day));
		expect(end.year).toHaveTextContent(String(calendarDate.end.year));
		expect(end.value).toHaveTextContent(calendarDate.end.toString());
	});

	it("should populate segment with value - `CalendarDateTime`", async () => {
		const { start, end, getByTestId } = setup({
			value: calendarDateTime,
			granularity: "second",
		});

		expect(start.month).toHaveTextContent(String(calendarDateTime.start.month));
		expect(start.day).toHaveTextContent(String(calendarDateTime.start.day));
		expect(start.year).toHaveTextContent(String(calendarDateTime.start.year));
		expect(getByTestId("start-hour")).toHaveTextContent(String(calendarDateTime.start.hour));
		expect(getByTestId("start-minute")).toHaveTextContent(
			String(calendarDateTime.start.minute)
		);
		expect(getByTestId("start-second")).toHaveTextContent(
			String(calendarDateTime.start.second)
		);
		expect(start.value).toHaveTextContent(calendarDateTime.start.toString());

		expect(end.month).toHaveTextContent(String(calendarDateTime.end.month));
		expect(end.day).toHaveTextContent(String(calendarDateTime.end.day));
		expect(end.year).toHaveTextContent(String(calendarDateTime.end.year));
		expect(getByTestId("end-hour")).toHaveTextContent(String(calendarDateTime.end.hour));
		expect(getByTestId("end-minute")).toHaveTextContent(String(calendarDateTime.end.minute));
		expect(getByTestId("end-second")).toHaveTextContent(String(calendarDateTime.end.second));
		expect(end.value).toHaveTextContent(calendarDateTime.end.toString());
	});

	it("should populate segment with value - `ZonedDateTime`", async () => {
		const { start, end, getByTestId } = setup({
			value: zonedDateTime,
			granularity: "second",
		});

		expect(start.month).toHaveTextContent(String(calendarDateTime.start.month));
		expect(start.day).toHaveTextContent(String(calendarDateTime.start.day));
		expect(start.year).toHaveTextContent(String(calendarDateTime.start.year));
		expect(getByTestId("start-hour")).toHaveTextContent(String(calendarDateTime.start.hour));
		expect(getByTestId("start-minute")).toHaveTextContent(
			String(calendarDateTime.start.minute)
		);
		expect(getByTestId("start-second")).toHaveTextContent(
			String(calendarDateTime.start.second)
		);
		expect(start.value).toHaveTextContent(calendarDateTime.start.toString());

		expect(end.month).toHaveTextContent(String(calendarDateTime.end.month));
		expect(end.day).toHaveTextContent(String(calendarDateTime.end.day));
		expect(end.year).toHaveTextContent(String(calendarDateTime.end.year));
		expect(getByTestId("end-hour")).toHaveTextContent(String(calendarDateTime.end.hour));
		expect(getByTestId("end-minute")).toHaveTextContent(String(calendarDateTime.end.minute));
		expect(getByTestId("end-second")).toHaveTextContent(String(calendarDateTime.end.second));
		expect(end.value).toHaveTextContent(calendarDateTime.end.toString());
	});

	it("should navigate between the fields", async () => {
		const { getByTestId, user } = setup({
			value: calendarDate,
		});

		const fields = ["start", "end"] as const;
		const segments = ["month", "day", "year"] as const;

		await user.click(getByTestId("start-month"));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === "start" && segment === "month") continue;
				const seg = getByTestId(`${field}-${segment}`);
				await user.keyboard(kbd.ARROW_RIGHT);
				expect(seg).toHaveFocus();
			}
		}

		await user.click(getByTestId("start-month"));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === "start" && segment === "month") continue;
				const seg = getByTestId(`${field}-${segment}`);
				await user.keyboard(kbd.TAB);
				expect(seg).toHaveFocus();
			}
		}
	});

	it("should navigate between the fields - right to left", async () => {
		const { getByTestId, user } = setup({
			value: calendarDate,
		});

		const fields = ["end", "start"] as const;
		const segments = ["year", "day", "month"] as const;

		await user.click(getByTestId("end-year"));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === "end" && segment === "year") continue;
				const seg = getByTestId(`${field}-${segment}`);
				await user.keyboard(kbd.ARROW_LEFT);
				expect(seg).toHaveFocus();
			}
		}

		await user.click(getByTestId("end-year"));

		for (const field of fields) {
			for (const segment of segments) {
				if (field === "end" && segment === "year") continue;
				const seg = getByTestId(`${field}-${segment}`);
				await user.keyboard(kbd.SHIFT_TAB);
				expect(seg).toHaveFocus();
			}
		}
	});

	it("should respect `bind:value` to the value", async () => {
		const { start, end, user } = setup({
			value: calendarDate,
		});
		expect(start.value).toHaveTextContent(calendarDate.start.toString());
		expect(end.value).toHaveTextContent(calendarDate.end.toString());

		await user.click(start.month);
		await user.keyboard("2");
		expect(start.value).toHaveTextContent("2022-02-01");
		expect(end.value).toHaveTextContent(calendarDate.end.toString());
	});

	it("should render an input for the start and end", async () => {
		const { container } = setup({
			startProps: {
				name: "start-hidden-input",
			},
			endProps: {
				name: "end-hidden-input",
			},
		});
		expect(container.querySelector('input[name="start-hidden-input"]')).toBeInTheDocument();
		expect(container.querySelector('input[name="end-hidden-input"]')).toBeInTheDocument();
	});
});
