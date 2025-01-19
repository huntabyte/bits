import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { type ComponentProps, tick } from "svelte";
import type { Checkbox } from "bits-ui";
import { getTestKbd, setupUserEvents } from "../utils.js";
import CheckboxTest from "./checkbox-test.svelte";
import CheckboxGroupTest from "./checkbox-group-test.svelte";

const kbd = getTestKbd();

const groupItems = ["a", "b", "c", "d"];

function setup(props?: Checkbox.RootProps) {
	const user = setupUserEvents();
	const returned = render(CheckboxTest, props);
	const root = returned.getByTestId("root");
	const input = document.querySelector("input") as HTMLInputElement;
	return {
		...returned,
		root,
		input,
		user,
	};
}

function setupGroup(props: ComponentProps<typeof CheckboxGroupTest> = {}) {
	const items = props.items ?? groupItems;
	const user = setupUserEvents();
	const returned = render(CheckboxGroupTest, {
		...props,
		items,
	});
	const group = returned.getByTestId("group");
	const groupLabel = returned.getByTestId("group-label");
	const submit = returned.getByTestId("submit");
	const binding = returned.getByTestId("binding");
	const updateBtn = returned.getByTestId("update");

	const getCheckbox = (v: string) => returned.getByTestId(`${v}-checkbox`);
	const getIndicator = (v: string) => returned.getByTestId(`${v}-indicator`);
	const checkboxes = items.map((v) => getCheckbox(v));
	const indicators = items.map((v) => returned.getByTestId(`${v}-indicator`));

	return {
		...returned,
		group,
		groupLabel,
		getCheckbox,
		getIndicator,
		checkboxes,
		indicators,
		user,
		submit,
		binding,
		updateBtn,
	};
}

describe("checkbox", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(CheckboxTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { root } = setup();
		expect(root).toHaveAttribute("data-checkbox-root");
	});

	it("should not render the checkbox input if a name prop isn't passed", async () => {
		const { input } = setup({ name: "" });
		expect(input).not.toBeInTheDocument();
	});

	it("should render the checkbox input if a name prop is passed", async () => {
		const { input } = setup({ name: "checkbox" });
		expect(input).toBeInTheDocument();
	});

	it('should default the value to "on", when no value prop is passed', async () => {
		const { input } = setup();
		expect(input).toHaveAttribute("value", "on");
	});

	it("should be able to be indeterminate", async () => {
		const { getByTestId, root, input } = setup({ indeterminate: true });
		const indicator = getByTestId("indicator");
		expect(root).toHaveAttribute("data-state", "indeterminate");
		expect(root).toHaveAttribute("aria-checked", "mixed");
		expect(input.checked).toBe(false);
		expect(indicator).toHaveTextContent("indeterminate");
		expect(indicator).not.toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("false");
	});

	it("should toggle when clicked", async () => {
		const { getByTestId, root, input, user } = setup();
		const indicator = getByTestId("indicator");
		expectUnchecked(root);
		expect(input.checked).toBe(false);
		expect(indicator).toHaveTextContent("false");
		expect(indicator).not.toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("indeterminate");
		await user.click(root);
		expectChecked(root);
		expect(input.checked).toBe(true);
		expect(indicator).toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("false");
		expect(indicator).not.toHaveTextContent("indeterminate");
	});

	it("should toggle when the `Space` key is pressed", async () => {
		const { root, input, user } = setup();
		expectUnchecked(root);
		expect(input.checked).toBe(false);
		root.focus();
		await user.keyboard(kbd.SPACE);
		expectChecked(root);
		expect(input.checked).toBe(true);
	});

	it("should not toggle when the `Enter` key is pressed", async () => {
		const { getByTestId, root, input, user } = setup();
		const indicator = getByTestId("indicator");
		expectUnchecked(root);
		expect(input.checked).toBe(false);
		expect(indicator).toHaveTextContent("false");
		expect(indicator).not.toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("indeterminate");
		root.focus();
		await user.keyboard(kbd.ENTER);
		expectUnchecked(root);
		expect(indicator).toHaveTextContent("false");
		expect(indicator).not.toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("indeterminate");
		expect(input.checked).toBe(false);
	});

	it("should be disabled when the `disabled` prop is passed", async () => {
		const { root, input, user } = setup({ disabled: true });
		expectUnchecked(root);
		expect(input.checked).toBe(false);
		expect(input.disabled).toBe(true);
		await user.click(root);
		expectUnchecked(root);
		expect(root).toBeDisabled();
		expect(input.checked).toBe(false);
	});

	it("should be required when the `required` prop is passed", async () => {
		const { root, input } = setup({ required: true });
		expect(root).toHaveAttribute("aria-required", "true");
		expect(input.required).toBe(true);
	});

	it('should fire the "onChange" callback when changing', async () => {
		let newValue: boolean | "indeterminate" = false;
		function onCheckedChange(next: boolean | "indeterminate") {
			newValue = next;
		}
		const { root, user } = setup({ onCheckedChange });
		await user.click(root);
		expect(newValue).toBe(true);
	});

	it("should respect binding the `checked` prop", async () => {
		const { root, getByTestId, user } = setup();
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(root);
		await tick();
		expect(binding).toHaveTextContent("true");
	});
});

describe("checkbox group", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(CheckboxGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { group, groupLabel } = setupGroup();
		expect(group).toHaveAttribute("data-checkbox-group");
		expect(groupLabel).toHaveAttribute("data-checkbox-group-label");
	});

	it("should handle default values appropriately", async () => {
		const t = setupGroup({
			value: ["a", "b"],
		});

		const [a, b, c, d] = t.checkboxes;
		expectChecked(a, b);
		expectUnchecked(c, d);

		await t.user.click(a);
		expectUnchecked(a);
		await t.user.click(d);
		expectChecked(d);
	});

	it("should submit the form data correctly using the checkbox values and group name", async () => {
		let submittedValues: string[] | undefined;
		const t = setupGroup({
			name: "myGroup",
			onFormSubmit: (fd) => {
				submittedValues = fd.getAll("myGroup") as string[];
			},
		});
		const [a, b] = t.checkboxes;
		await t.user.click(a);
		expectChecked(a);
		await t.user.click(t.submit);
		expect(submittedValues).toEqual(["a"]);
		await t.user.click(b);
		await t.user.click(t.submit);
		expect(submittedValues).toEqual(["a", "b"]);
	});

	it("should handle binding value", async () => {
		const t = setupGroup();

		const [a, b, _, d] = t.checkboxes;
		expect(t.binding).toHaveTextContent("");
		await t.user.click(a);
		expect(t.binding).toHaveTextContent("a");
		await t.user.click(b);
		expect(t.binding).toHaveTextContent("a,b");
		await t.user.click(a);
		expect(t.binding).toHaveTextContent("b");
		await t.user.click(d);
		expect(t.binding).toHaveTextContent("b,d");
	});

	it("should handle programmatic value changes", async () => {
		const t = setupGroup({
			value: ["a", "b"],
		});

		const [a, b, c, d] = t.checkboxes;
		expectChecked(a, b);
		await t.user.click(t.updateBtn);
		expectUnchecked(a, b);
		expectChecked(c, d);
	});

	it("should propagate disabled state to children checkboxes", async () => {
		const t = setupGroup({
			disabled: true,
			required: true,
		});

		for (const checkbox of t.checkboxes) {
			expect(checkbox).toBeDisabled();
			expect(checkbox).toHaveAttribute("aria-required", "true");
		}
	});

	it("should allow disabling a single item in the group", async () => {
		const t = setupGroup({
			disabledItems: ["a"],
		});

		const [a, ...rest] = t.checkboxes;

		expect(a).toBeDisabled();

		for (const checkbox of rest) {
			expect(checkbox).not.toBeDisabled();
		}
	});
});

function expectChecked(...nodes: HTMLElement[]) {
	for (const n of nodes) {
		expect(n).toHaveAttribute("data-state", "checked");
		expect(n).toHaveAttribute("aria-checked", "true");
	}
}

function expectUnchecked(...nodes: HTMLElement[]) {
	for (const n of nodes) {
		expect(n).toHaveAttribute("data-state", "unchecked");
		expect(n).toHaveAttribute("aria-checked", "false");
	}
}
