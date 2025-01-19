import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import type { Toggle } from "bits-ui";
import { getTestKbd } from "../utils.js";
import ToggleTest from "./toggle-test.svelte";

const kbd = getTestKbd();

function setup(props: Toggle.RootProps = {}) {
	const user = userEvent.setup();
	const returned = render(ToggleTest, { ...props });
	const root = returned.getByTestId("root");
	return {
		root,
		user,
		...returned,
	};
}

describe("toggle", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(ToggleTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { root } = setup();
		expect(root).toHaveAttribute("data-toggle-root");
	});

	it("should toggle when clicked", async () => {
		const { user, root } = setup();
		expect(root).toHaveAttribute("data-state", "off");
		expect(root).toHaveAttribute("aria-pressed", "false");
		await user.click(root);
		expect(root).toHaveAttribute("data-state", "on");
		expect(root).toHaveAttribute("aria-pressed", "true");
	});

	it.each([kbd.ENTER, kbd.SPACE])("should toggle when the `%s` key is pressed", async (key) => {
		const { user, root } = setup();
		expect(root).toHaveAttribute("data-state", "off");
		expect(root).toHaveAttribute("aria-pressed", "false");
		root.focus();
		await user.keyboard(key);
		expect(root).toHaveAttribute("data-state", "on");
		expect(root).toHaveAttribute("aria-pressed", "true");
	});

	it("should be disabled then the `disabled` prop is set to true", async () => {
		const { root } = setup({ disabled: true });
		expect(root).toHaveAttribute("data-disabled");
		expect(root).toBeDisabled();
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newValue = false;
		function onPressedChange(next: boolean) {
			newValue = next;
		}

		const { user, root } = setup({ onPressedChange });
		expect(newValue).toBe(false);
		await user.click(root);
		expect(newValue).toBe(true);
	});

	it("should respect binding to the `pressed` prop", async () => {
		const { getByTestId, user, root } = setup();
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		expect(root).toHaveAttribute("data-state", "on");
	});
});
