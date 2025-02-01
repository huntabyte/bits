import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd } from "../utils.js";
import ToggleGroupTest from "./toggle-group-test.svelte";
import type { Item, SingleToggleGroupTestProps } from "./toggle-group-test.svelte";
import ToggleGroupMultipleTest, {
	type MultipleToggleGroupTestProps,
} from "./toggle-group-multi-test.svelte";

const kbd = getTestKbd();

const items: Item[] = [
	{
		value: "1",
		disabled: false,
	},
	{
		value: "2",
		disabled: false,
	},
	{
		value: "3",
		disabled: false,
	},
	{
		value: "4",
		disabled: false,
	},
];

function setupMultiple(props: Partial<MultipleToggleGroupTestProps> = {}) {
	const user = userEvent.setup();
	// @ts-expect-error - shh
	const returned = render(ToggleGroupMultipleTest, { ...props, items });
	const root = returned.getByTestId("root");
	const binding = returned.getByTestId("binding");
	return {
		root,
		user,
		binding,
		...returned,
	};
}

function setup(props: Partial<SingleToggleGroupTestProps> = {}) {
	const user = userEvent.setup();
	// @ts-expect-error - shh
	const returned = render(ToggleGroupTest, { ...props, items });
	const root = returned.getByTestId("root");
	const binding = returned.getByTestId("binding");
	return {
		root,
		user,
		binding,
		...returned,
	};
}

describe("toggleGroup", () => {
	it("should have no accessibility violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { root, getByTestId } = setup();
		const item = getByTestId("item-1");
		expect(root).toHaveAttribute("data-toggle-group-root");
		expect(item).toHaveAttribute("data-toggle-group-item");
	});

	it("should toggle when clicked", async () => {
		const { user, binding, getByTestId } = setup();
		expect(binding).toHaveTextContent("");
		const item = getByTestId("item-1");
		await user.click(item);
		expect(binding).toHaveTextContent("1");
		const item2 = getByTestId("item-2");
		await user.click(item2);
		expect(binding).toHaveTextContent("2");
	});

	it.each([kbd.ENTER, kbd.SPACE])("should toggle when the %s key is pressed", async (key) => {
		const { user, binding, getByTestId } = setup();
		expect(binding).toHaveTextContent("");
		const item = getByTestId("item-1");
		item.focus();
		await user.keyboard(key);
		expect(binding).toHaveTextContent("1");
		const item2 = getByTestId("item-2");
		item2.focus();
		await user.keyboard(key);
		expect(binding).toHaveTextContent("2");
	});

	it("should navigate between the items using the arrow keys", async () => {
		const { user, binding, getByTestId } = setup();
		expect(binding).toHaveTextContent("");
		const item1 = getByTestId("item-1");
		const item2 = getByTestId("item-2");
		const item3 = getByTestId("item-3");
		const item4 = getByTestId("item-4");
		item1.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item2).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item3).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item4).toHaveFocus();
	});

	it("should loop around when navigating with the arrow keys", async () => {
		const { user, binding, getByTestId } = setup();
		expect(binding).toHaveTextContent("");
		const item1 = getByTestId("item-1");
		const item4 = getByTestId("item-4");
		item1.focus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(item4).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item1).toHaveFocus();
	});

	it("should respect the loop prop", async () => {
		const { user, binding, getByTestId } = setup({
			loop: false,
		});
		expect(binding).toHaveTextContent("");
		const item1 = getByTestId("item-1");
		const item4 = getByTestId("item-4");
		item1.focus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(item4).not.toHaveFocus();
		expect(item1).toHaveFocus();
		item4.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item1).not.toHaveFocus();
		expect(item4).toHaveFocus();
	});

	it("should be disabled then the `disabled` prop is set to true", async () => {
		const { getByTestId } = setup({ disabled: true });
		expect(getByTestId("item-1")).toBeDisabled();
		expect(getByTestId("item-2")).toBeDisabled();
		expect(getByTestId("item-3")).toBeDisabled();
		expect(getByTestId("item-4")).toBeDisabled();
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newValue = "";
		function onValueChange(next: string) {
			newValue = next;
		}

		const { user, getByTestId } = setup({ onValueChange });
		expect(newValue).toBe("");
		await user.click(getByTestId("item-2"));
		expect(newValue).toBe("2");
	});

	it("should respect binding to the `value` prop", async () => {
		const { getByTestId, user } = setup();
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("");
		await user.click(binding);
		expect(binding).toHaveTextContent("4");
		const item4 = getByTestId("item-4");
		expect(item4).toHaveAttribute("aria-checked", "true");
		expect(item4).toHaveAttribute("data-state", "on");
	});

	it("should allow multiple items to be selected when `kind` is `'multiple'`", async () => {
		const { getByTestId, user } = setupMultiple();
		const item1 = getByTestId("item-1");
		const item2 = getByTestId("item-2");
		const item3 = getByTestId("item-3");
		const item4 = getByTestId("item-4");
		const binding = getByTestId("binding");
		await user.click(item1);
		await user.click(item2);
		expect(binding).toHaveTextContent("1,2");
		await user.click(item3);
		expect(binding).toHaveTextContent("1,2,3");
		await user.click(item4);
		expect(binding).toHaveTextContent("1,2,3,4");
		await user.click(item1);
		expect(binding).toHaveTextContent("2,3,4");
		await user.click(item2);
		expect(binding).toHaveTextContent("3,4");
		await user.click(item3);
		expect(binding).toHaveTextContent("4");
		await user.click(item4);
		expect(binding).toHaveTextContent("");
	});
});
