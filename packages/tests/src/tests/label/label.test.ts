import { render } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import LabelTest from "./label-test.svelte";

describe("label", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(LabelTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = render(LabelTest);
		const root = getByTestId("label");
		expect(root).toHaveAttribute("data-label-root");
	});

	it("should render the label text", async () => {
		const { getByTestId } = render(LabelTest);
		const label = getByTestId("label");
		expect(label).toHaveTextContent("Label");
	});

	it("should focus the associated input on click", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(LabelTest);
		await user.click(getByTestId("label"));
		expect(getByTestId("input")).toHaveFocus();
	});
});
