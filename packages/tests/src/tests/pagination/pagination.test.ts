import { render } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { setupUserEvents } from "../utils.js";
import PaginationTest, { type PaginationTestProps } from "./pagination-test.svelte";

function setup(props: PaginationTestProps = { count: 100 }) {
	const user = setupUserEvents();
	const returned = render(PaginationTest, { ...props });

	const root = returned.getByTestId("root");
	const range = returned.getByTestId("range");
	const prev = returned.getByTestId("prev-button");
	const next = returned.getByTestId("next-button");

	return {
		root,
		range,
		prev,
		next,
		user,
		...returned,
	};
}

function getPageButton(el: HTMLElement, page: number) {
	const btn = el.querySelector(`[data-value="${page}"]`);
	if (!(btn instanceof HTMLElement)) {
		throw new TypeError(`Page button ${page} not found`);
	}
	return btn;
}

function getValue(el: HTMLElement) {
	return el.querySelector("[data-selected]")?.getAttribute("data-value");
}

describe("pagination", () => {
	it("should have no  accessibility violations", async () => {
		const { container } = render(PaginationTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should navigate previous and Next button accordingly", async () => {
		const { root, prev, next, user } = setup();

		expect(getValue(root)).toBe("1");
		await user.click(prev);
		expect(getValue(root)).toBe("1");
		await user.click(next);
		expect(getValue(root)).toBe("2");
		await user.click(next);
		expect(getValue(root)).toBe("3");
		await user.click(prev);
		expect(getValue(root)).toBe("2");
	});

	it("should change on clicked button", async () => {
		const { getByTestId, user } = setup();

		const root = getByTestId("root");
		const page2 = getPageButton(root, 2);

		expect(getValue(root)).toBe("1");
		await user.click(page2);
		expect(getValue(root)).toBe("2");

		const page10 = getPageButton(root, 10);
		await user.click(page10);
		expect(getValue(root)).toBe("10");
	});
});
