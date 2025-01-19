import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import type { Switch } from "bits-ui";
import { getTestKbd } from "../utils.js";
import SwitchTest from "./switch-test.svelte";

const kbd = getTestKbd();

function setup(props: Switch.RootProps = {}) {
	const user = userEvent.setup();
	const returned = render(SwitchTest, { name: "switch-input", ...props });
	const root = returned.getByTestId("root");
	const thumb = returned.getByTestId("thumb");
	const input = document.querySelector("input") as HTMLInputElement;
	return {
		root,
		thumb,
		user,
		input,
		...returned,
	};
}

describe("switch", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(SwitchTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { root, thumb } = setup();
		expect(root).toHaveAttribute("data-switch-root");
		expect(thumb).toHaveAttribute("data-switch-thumb");
	});

	it('should default the value to "on", when no value prop is passed', async () => {
		const { input } = setup();
		expect(input).toHaveAttribute("value", "on");
	});

	it("should toggle when clicked", async () => {
		const { user, root, input } = setup();
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).not.toHaveAttribute("data-checked");
		expect(input.checked).toBe(false);
		await user.click(root);
		expect(root).toHaveAttribute("data-state", "checked");
		expect(root).toHaveAttribute("aria-checked", "true");
		expect(input.checked).toBe(true);
	});

	it.each([kbd.ENTER, kbd.SPACE])("should toggle when the `%s` key is pressed", async (key) => {
		const { user, root, input } = setup();
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).toHaveAttribute("aria-checked", "false");
		expect(input.checked).toBe(false);
		root.focus();
		await user.keyboard(key);
		expect(root).toHaveAttribute("data-state", "checked");
		expect(root).toHaveAttribute("aria-checked", "true");
		expect(input.checked).toBe(true);
	});

	it("should be disabled then the `disabled` prop is set to true", async () => {
		const { root, input } = setup({ disabled: true });
		expect(root).toHaveAttribute("data-disabled");
		expect(root).toBeDisabled();
		expect(input.disabled).toBe(true);
	});

	it("should be required then the `required` prop is set to true", async () => {
		const { root, input } = setup({ required: true });
		expect(root).toHaveAttribute("aria-required", "true");
		expect(input.required).toBe(true);
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newValue = false;
		function onCheckedChange(next: boolean) {
			newValue = next;
		}

		const { user, root } = setup({ onCheckedChange });
		expect(newValue).toBe(false);
		await user.click(root);
		expect(newValue).toBe(true);
	});

	it("should respect binding to the `checked` prop", async () => {
		const { getByTestId, user, root, input } = setup();
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		expect(root).toHaveAttribute("data-state", "checked");
		expect(input.checked).toBe(true);
	});

	it("should not include the input when the `name` prop isn't passed/undefined", async () => {
		const { input } = setup({ name: undefined });
		expect(input).not.toBeInTheDocument();
	});

	it("should render the input when the `name` prop is passed", async () => {
		// passed by default
		const { input } = setup();
		expect(input).toBeInTheDocument();
	});
});
