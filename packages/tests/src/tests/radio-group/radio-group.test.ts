import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd } from "../utils.js";
import RadioGroupTest from "./radio-group-test.svelte";
import type { Item, RadioGroupTestProps } from "./radio-group-test.svelte";

const kbd = getTestKbd();

const testItems: Item[] = [
	{
		value: "a",
		disabled: false,
	},
	{
		value: "b",
		disabled: false,
	},
	{
		value: "c",
		disabled: false,
	},
	{
		value: "d",
		disabled: false,
	},
];

const itemIds = testItems.map((item) => `${item.value}-item`);
const labelIds = testItems.map((item) => `${item.value}-label`);
const indicatorIds = testItems.map((item) => `${item.value}-indicator`);

function setup(props: Partial<RadioGroupTestProps> = {}, items: Item[] = testItems) {
	const user = userEvent.setup();
	const returned = render(RadioGroupTest, { ...props, items });
	const input = document.querySelector("input") as HTMLInputElement;
	return {
		user,
		input,
		...returned,
	};
}

function randItem() {
	return Math.floor(Math.random() * 3);
}

describe("radio group", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(RadioGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = render(RadioGroupTest, {
			items: [testItems[0] as Item],
			value: testItems[0]?.value,
		});
		const root = getByTestId("root");
		const item = getByTestId(`${testItems[0]?.value}-item`);

		expect(root).toHaveAttribute("data-radio-group-root");
		expect(item).toHaveAttribute("data-radio-group-item");
	});

	it("should change the value when an item is clicked", async () => {
		const { getByTestId, user } = setup();

		for (const indicator of indicatorIds) {
			expect(getByTestId(indicator)).toHaveTextContent("false");
		}
		const itemIdx = randItem();
		const item = getByTestId(itemIds[itemIdx] as string);
		await user.click(item);
		expect(getByTestId(indicatorIds[itemIdx] as string)).toHaveTextContent("true");
	});

	it("should not change the value when a disabled item is clicked", async () => {
		const { getByTestId, user } = setup({}, [...testItems, { value: "e", disabled: true }]);

		const item = getByTestId("e-item");
		await user.click(item);
		expect(getByTestId("e-indicator")).toHaveTextContent("false");
	});

	it("should navigate through the items using the keyboard (up and down)", async () => {
		const { getByTestId, user } = setup();

		const item0 = getByTestId(itemIds[0] as string);
		const item1 = getByTestId(itemIds[1] as string);
		const item2 = getByTestId(itemIds[2] as string);
		const item3 = getByTestId(itemIds[3] as string);
		item0.focus();
		expect(item0).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(item1).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(item2).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(item3).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(item2).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(item1).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(item0).toHaveFocus();
	});

	it("should navigate through the items using the keyboard (left and right)", async () => {
		const { getByTestId, user } = setup();

		const item0 = getByTestId(itemIds[0] as string);
		const item1 = getByTestId(itemIds[1] as string);
		const item2 = getByTestId(itemIds[2] as string);
		const item3 = getByTestId(itemIds[3] as string);
		item0.focus();
		expect(item0).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item1).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item2).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item3).toHaveFocus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(item2).toHaveFocus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(item1).toHaveFocus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(item0).toHaveFocus();
	});

	it("should respect the loop prop", async () => {
		const { getByTestId, user } = setup({
			loop: false,
		});

		const item0 = getByTestId(itemIds[0] as string);
		const item3 = getByTestId(itemIds[3] as string);
		item0.focus();
		expect(item0).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(item0).toHaveFocus();

		item3.focus();
		expect(item3).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(item3).toHaveFocus();
	});

	it("should respect the value prop & binding", async () => {
		const { getByTestId, user, queryByTestId } = setup({
			value: "b",
		});
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("b");
		const bindingIndic = getByTestId("b-indicator");
		expect(bindingIndic).toHaveTextContent("true");
		await user.click(binding);
		expect(binding).toHaveTextContent("a");
		expect(queryByTestId("b-indicator")).toHaveTextContent("false");
		const bindingIndic2 = getByTestId("a-indicator");
		expect(bindingIndic2).toHaveTextContent("true");
	});

	it("should respect the loop prop using arrow left and right keys", async () => {
		const { getByTestId, user } = setup({
			loop: false,
		});

		const item0 = getByTestId(itemIds[0] as string);
		const item3 = getByTestId(itemIds[3] as string);
		item0.focus();
		expect(item0).toHaveFocus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(item0).toHaveFocus();

		item3.focus();
		expect(item3).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(item3).toHaveFocus();
	});

	it("should not render an input if the `name` prop isn't passed", async () => {
		const { input } = setup();

		expect(input).not.toBeInTheDocument();
	});

	it("should render an input if the `name` prop is passed", async () => {
		const { input } = setup({
			name: "radio-group",
		});

		expect(input).toBeInTheDocument();
	});

	it("should syncs the inputs value with the radio group value", async () => {
		const { getByTestId, user, input } = setup({ name: "radio-group" });

		await user.click(getByTestId("a-item"));
		expect(input).toHaveValue("a");
		await user.click(getByTestId("b-item"));
		expect(input).toHaveValue("b");
	});

	it("should make the input required if the radio group is required", async () => {
		const { input } = setup({
			required: true,
			name: "radio-group",
		});

		expect(input).toHaveAttribute("required");
	});

	it("should make the input disabled if the radio group is disabled", async () => {
		const { input } = setup({
			disabled: true,
			name: "radio-group",
		});

		expect(input).toHaveAttribute("disabled");
	});

	it("should not automatically select the first item focused when the radio group does not have a value", async () => {
		const { getByTestId, user, input } = setup({ name: "radio-group" });

		const aItem = getByTestId("a-item");
		aItem.focus();
		expect(input).toHaveValue("");
		await user.keyboard(kbd.ARROW_DOWN);
		expect(input).toHaveValue("");
		const bItem = getByTestId("b-item");
		expect(bItem).toHaveFocus();
		await user.keyboard(kbd.SPACE);
		expect(input).toHaveValue("b");
		await user.keyboard(kbd.ARROW_UP);
		expect(aItem).toHaveFocus();
		expect(input).toHaveValue("a");
	});

	it("should change the value when a label associated with an item is clicked", async () => {
		const { getByTestId, user } = setup();

		for (const indicator of indicatorIds) {
			expect(getByTestId(indicator)).toHaveTextContent("false");
		}
		const itemIdx = randItem();

		const label = getByTestId(labelIds[itemIdx] as string);

		await user.click(label);
		expect(getByTestId(indicatorIds[itemIdx] as string)).toHaveTextContent("true");
	});
});
