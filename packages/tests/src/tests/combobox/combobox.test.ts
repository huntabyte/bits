import { render, waitFor } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { type Component, tick } from "svelte";
import { type AnyFn, getTestKbd, setupUserEvents, sleep } from "../utils.js";
import ComboboxTest from "./combobox-test.svelte";
import type { ComboboxSingleTestProps, Item } from "./combobox-test.svelte";
import type { ComboboxMultipleTestProps } from "./combobox-multi-test.svelte";
import ComboboxMultiTest from "./combobox-multi-test.svelte";
import ComboboxForceMountTest, {
	type ComboboxForceMountTestProps,
} from "./combobox-force-mount-test.svelte";

const kbd = getTestKbd();

const testItems: Item[] = [
	{
		value: "1",
		label: "A",
	},
	{
		value: "2",
		label: "B",
	},
	{
		value: "3",
		label: "C",
	},
	{
		value: "4",
		label: "D",
	},
];

function setupSingle(
	props: Partial<ComboboxSingleTestProps | ComboboxForceMountTestProps> = {},
	items: Item[] = testItems,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: Component<any, any, any> = ComboboxTest
) {
	const user = setupUserEvents();
	const returned = render(component, { name: "test", ...props, items });
	const input = returned.getByTestId("input");
	const trigger = returned.getByTestId("trigger");
	const openBinding = returned.getByTestId("open-binding");
	const valueBinding = returned.getByTestId("value-binding");
	const outside = returned.getByTestId("outside");

	function getContent() {
		return returned.queryByTestId("content");
	}

	function getHiddenInput(name = "test") {
		return returned.container.querySelector(`input[name="${name}"]`);
	}

	return {
		user,
		input,
		trigger,
		valueBinding,
		openBinding,
		outside,
		getHiddenInput,
		getContent,
		...returned,
	};
}

function setupMultiple(props: Partial<ComboboxMultipleTestProps> = {}, items: Item[] = testItems) {
	const user = setupUserEvents();
	const returned = render(ComboboxMultiTest, { name: "test", ...props, items });
	const input = returned.getByTestId("input");
	const trigger = returned.getByTestId("trigger");
	const openBinding = returned.getByTestId("open-binding");
	const valueBinding = returned.getByTestId("value-binding");
	const outside = returned.getByTestId("outside");
	const submit = returned.getByTestId("submit");

	function getHiddenInputs(name = "test") {
		return returned.container.querySelectorAll<HTMLElement>(`input[name="${name}"]`);
	}

	function getContent() {
		return returned.queryByTestId("content");
	}

	return {
		user,
		input,
		trigger,
		openBinding,
		valueBinding,
		outside,
		submit,
		getHiddenInputs,
		getContent,
		...returned,
	};
}

async function openSingle(
	props: Partial<ComboboxSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	searchValue?: string
) {
	const returned = setupSingle(props);

	const { queryByTestId, getByTestId, user, input, trigger } = returned;
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else if (openWith === "type" && searchValue) {
		await user.type(input, searchValue);
	} else {
		input.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	const group = returned.getByTestId("group");
	const groupHeading = returned.getByTestId("group-label");
	return {
		...returned,
		group,
		groupHeading,
		content,
	};
}

async function openMultiple(
	props: Partial<ComboboxMultipleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	searchValue?: string
) {
	const returned = setupMultiple(props);
	const { queryByTestId, getByTestId, user, input, trigger } = returned;
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else if (openWith === "type" && searchValue) {
		await user.type(input, searchValue);
	} else {
		input.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	return {
		...returned,
		content,
	};
}

const OPEN_KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP];

describe("combobox - single", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(ComboboxTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should open on click", async () => {
		await openSingle();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openSingle({}, key);
	});

	it("should applie the appropriate `aria-labelledby` attribute to the group", async () => {
		const { group, groupHeading } = await openSingle();

		expect(group).toHaveAttribute("aria-labelledby", groupHeading.id);
	});

	it("should select item with the enter key", async () => {
		const { user, input } = await openSingle();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		await tick();
		expect(input).toHaveValue("B");
	});

	it("should render an input if the `name` prop is passed", async () => {
		const { getHiddenInput } = setupSingle();
		expect(getHiddenInput()).toBeInTheDocument();
	});

	it("should not render an input if the `name` prop isn't passed or is an empty string/undefined", async () => {
		const { getHiddenInput } = setupSingle({ name: "" });
		expect(getHiddenInput()).not.toBeInTheDocument();
	});

	it("should sync the value prop to the hidden input", async () => {
		const { getHiddenInput } = setupSingle({ value: "test" });
		expect(getHiddenInput()).toHaveValue("test");
	});

	it("should sync the required prop to the hidden input", async () => {
		const { getHiddenInput } = setupSingle({ required: true });
		expect(getHiddenInput()).toHaveAttribute("required");
	});

	it("should sync the disabled prop to the hidden input", async () => {
		const { getHiddenInput } = setupSingle({ disabled: true });
		expect(getHiddenInput()).toHaveAttribute("disabled");
	});

	it("should close on escape keydown", async () => {
		const { user, getContent } = await openSingle();
		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).toBeNull();
	});

	it("should close on outside click", async () => {
		const { user, getContent, outside } = await openSingle();
		await sleep(100);
		await user.click(outside);
		await sleep(100);
		expect(getContent()).toBeNull();
	});

	it("should portal to the body by default", async () => {
		const { content } = await openSingle();
		expect(content.parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const { content, getByTestId } = await openSingle({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const { content, getByTestId } = await openSingle({ portalProps: { disabled: true } });
		const main = getByTestId("main");
		expect(content.parentElement?.parentElement).toBe(main);
	});

	it("should respect binding the `open` prop", async () => {
		const { getContent, user, openBinding } = await openSingle();
		expect(openBinding).toHaveTextContent("true");
		await user.click(openBinding);
		expect(openBinding).toHaveTextContent("false");
		await waitFor(() => expect(getContent()).toBeNull());
		await user.click(openBinding);
		expect(openBinding).toHaveTextContent("true");
		await waitFor(() => expect(getContent()).not.toBeNull());
	});

	it("should respect binding the `value` prop", async () => {
		const { user, valueBinding } = await openSingle({ value: "1" });
		expect(valueBinding).toHaveTextContent("1");
		await user.click(valueBinding);
		expect(valueBinding).toHaveTextContent("empty");
	});

	it("should select items when clicked", async () => {
		const { getByTestId, user, queryByTestId, input, getHiddenInput } = await openSingle();
		const [item1] = getItems(getByTestId);
		expect(queryByTestId("1-indicator")).toBeNull();
		await user.click(item1!);
		expect(input).toHaveValue("A");
		expect(getHiddenInput()).toHaveValue("1");
		await user.click(input);
		expectSelected(item1!);
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const { getByTestId, user } = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
	});

	it("should navigate through the items using the keyboard (loop = true)", async () => {
		const { getByTestId, user } = await openSingle(
			{
				loop: true,
			},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item3!);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const { getByTestId, user, input, getHiddenInput } = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(input).toHaveValue("D");
		expect(getHiddenInput()).toHaveValue("4");
		await user.click(input);
		expectNotSelected([item0!, item1!, item2!]);
		expectSelected(item3!);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const { getByTestId, user } = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems(getByTestId);
		await user.hover(item1!);
		expectHighlighted(item1!);
		await user.hover(item2!);
		expectHighlighted(item2!);
		expectNotHighlighted(item1!);
	});

	it("should start keyboard navigation at the highlighted item even if hovered with mouse", async () => {
		const { getByTestId, user, input } = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2, item3] = getItems(getByTestId);
		await user.click(input);
		await user.hover(item1!);
		expectHighlighted(item1!);
		await user.hover(item2!);
		expectHighlighted(item2!);
		expectNotHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		expectNotHighlighted(item2!);
	});

	it("should select a default item when provided", async () => {
		const { getByTestId, queryByTestId, input, getHiddenInput } = await openSingle({
			value: "2",
			inputProps: {
				defaultValue: "B",
			},
		});
		expect(queryByTestId("2-indicator")).not.toBeNull();
		expect(input).toHaveValue("B");
		expect(getHiddenInput()).toHaveValue("2");
		const [_, item2] = getItems(getByTestId);
		expectSelected(item2!);
	});

	it("should allow navigating after navigating to the bottom, closing, and reopening the menu", async () => {
		const { getByTestId, user, getContent } = await openSingle();
		const [item0, item1, item2, item3] = getItems(getByTestId);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(getContent()).toBeNull());

		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getContent()).not.toBeNull());
		const [i0, i1] = getItems(getByTestId);
		expectHighlighted(i0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(i1!);
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const { getByTestId } = setupSingle({}, [], ComboboxForceMountTest);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const { queryByTestId, getByTestId, user, trigger } = setupSingle(
			{ withOpenCheck: true },
			[],
			ComboboxForceMountTest
		);

		expect(queryByTestId("content")).toBeNull();

		await user.click(trigger);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});

	it("should not allow deselecting an item when `allowDeselect` is false", async () => {
		const { getByTestId, user, trigger } = await openSingle({
			allowDeselect: false,
		});

		const [item0] = getItems(getByTestId);
		await user.click(item0!);
		expectSelected(item0!);
		await user.click(trigger);

		const [item0v2] = getItems(getByTestId);

		await user.click(item0v2!);
		expectSelected(item0v2!);
		await user.click(trigger);
		const [item0v3] = getItems(getByTestId);
		expectSelected(item0v3!);
	});
});

////////////////////////////////////
// MULTIPLE
////////////////////////////////////
describe("combobox - multiple", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(ComboboxMultiTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should open on click", async () => {
		await openMultiple();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openMultiple({}, key);
	});

	it("should select item with the enter key", async () => {
		const { user, input } = await openMultiple();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(input).toHaveValue("B");
	});

	it("should not render a hidden input if the `name` prop is passed and a value is not selected", async () => {
		const { getHiddenInputs } = setupMultiple();
		expect(getHiddenInputs()).toHaveLength(0);
	});

	it("should render a hidden input for each value in the `value` array, each with the same `name` prop", async () => {
		const { getHiddenInputs } = setupMultiple({ value: ["a", "b"] });
		const hiddenInputs = getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		expect(hiddenInputs[0]).toHaveAttribute("name", "test");
		expect(hiddenInputs[1]).toHaveAttribute("name", "test");
	});

	it("should sync the value prop to the hidden inputs", async () => {
		const { getHiddenInputs } = setupMultiple({ value: ["a", "b"] });
		const hiddenInputs = getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);
		expect(hiddenInputs[0]).toHaveValue("a");
		expect(hiddenInputs[1]).toHaveValue("b");
	});

	it("should sync the required prop to the hidden inputs", async () => {
		const { getHiddenInputs } = setupMultiple({ required: true, value: ["a", "b"] });
		const hiddenInputs = getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);

		for (const hiddenInput of hiddenInputs) {
			expect(hiddenInput).toHaveAttribute("required");
		}
	});

	it("should sync the disabled prop to the hidden inputs", async () => {
		const { getHiddenInputs } = setupMultiple({ disabled: true, value: ["a", "b"] });
		const hiddenInputs = getHiddenInputs();
		expect(hiddenInputs).toHaveLength(2);

		for (const hiddenInput of hiddenInputs) {
			expect(hiddenInput).toHaveAttribute("disabled");
		}
	});

	it("should close on escape keydown", async () => {
		const { user, getContent } = await openMultiple();
		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).toBeNull();
	});

	it("should close on outside click", async () => {
		const { user, getContent, outside } = await openMultiple();
		await sleep(100);
		await user.click(outside);
		await sleep(100);
		expect(getContent()).toBeNull();
	});

	it("should portal to the body by default", async () => {
		const { content } = await openMultiple();
		expect(content.parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const { content, getByTestId } = await openMultiple({
			portalProps: { to: "#portal-target" },
		});
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const { content, getByTestId } = await openMultiple({ portalProps: { disabled: true } });
		const form = getByTestId("form");
		expect(content.parentElement?.parentElement).toBe(form);
	});

	it("should respect binding the `open` prop", async () => {
		const { getContent, user, openBinding } = await openMultiple();
		expect(openBinding).toHaveTextContent("true");
		await user.click(openBinding);
		expect(openBinding).toHaveTextContent("false");
		await waitFor(() => expect(getContent()).toBeNull());
		await user.click(openBinding);
		expect(openBinding).toHaveTextContent("true");
		await waitFor(() => expect(getContent()).not.toBeNull());
	});

	it("should respect binding the `value` prop", async () => {
		const { user, valueBinding } = await openMultiple({ value: ["1", "2"] });
		expect(valueBinding.textContent).toEqual("1,2");
		await user.click(valueBinding);
		expect(valueBinding.textContent).toEqual("empty");
	});

	it("should select items when clicked", async () => {
		const { getByTestId, user, queryByTestId, input, getHiddenInputs } = await openMultiple();
		const [item] = getItems(getByTestId);
		await waitFor(() => expect(queryByTestId("1-indicator")).toBeNull());
		await user.click(item!);
		expect(input).toHaveValue("A");
		expect(getHiddenInputs()).toHaveLength(1);
		expect(getHiddenInputs()[0]).toHaveValue("1");
		await user.click(input);

		expectSelected(item!);
		await waitFor(() => expect(queryByTestId("1-indicator")).not.toBeNull());
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const { getByTestId, user } = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
	});

	it("should navigate through the items using the keyboard (loop = true)", async () => {
		const { getByTestId, user } = await openMultiple(
			{
				loop: true,
			},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item3!);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const { getByTestId, user, input, getHiddenInputs } = await openMultiple(
			{},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(input).toHaveValue("D");
		const hiddenInputs = getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		expect(hiddenInputs[0]).toHaveValue("4");
		await user.click(input);
		expectNotSelected([item0!, item1!, item2!]);
		expectSelected(item3!);
	});

	it("should allow multiple items to be selected using the keyboard", async () => {
		const { getByTestId, user, input, getHiddenInputs } = await openMultiple(
			{},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3] = getItems(getByTestId);

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(input).toHaveValue("D");
		const hiddenInputs = getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		expect(hiddenInputs[0]).toHaveValue("4");
		expectSelected(item3!);
		expectNotSelected([item0!, item1!, item2!]);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ENTER);
		expectSelected([item3!, item2!]);
		expectNotSelected([item0!, item1!]);
	});

	it("should apply the `data-highlighted` attribute on mouseover", async () => {
		const { getByTestId, user } = await openMultiple({}, kbd.ARROW_DOWN);
		const [item1, item2] = getItems(getByTestId);
		await user.hover(item1!);
		expectHighlighted(item1!);
		await user.hover(item2!);
		expectHighlighted(item2!);
		expectNotHighlighted(item1!);
	});

	it("should select a default item when provided", async () => {
		const { getByTestId, queryByTestId, input, getHiddenInputs } = await openMultiple({
			value: ["2"],
			inputProps: {
				defaultValue: "B",
			},
		});
		expect(queryByTestId("2-indicator")).not.toBeNull();
		expect(input).toHaveValue("B");

		expect(getHiddenInputs()[0]).toHaveValue("2");
		const [_, item2] = getItems(getByTestId);
		expectSelected(item2!);
	});

	it("should submit an empty array when the user submits the form without selecting any items", async () => {
		let submittedValues: string[] | undefined;
		const { submit, user } = setupMultiple({
			onFormSubmit: (fd) => {
				submittedValues = fd.getAll("themes") as string[];
			},
			name: "themes",
		});

		await user.click(submit);
		expect(submittedValues).toHaveLength(0);
	});
});

function getItems(getter: AnyFn, items = testItems) {
	const itemsArr: HTMLElement[] = [];
	for (const item of items) {
		itemsArr.push(getter(item.value));
	}
	return itemsArr as HTMLElement[];
}

////////////////////////////////////
// HELPERS
////////////////////////////////////

function expectSelected(node: HTMLElement | HTMLElement[]) {
	if (Array.isArray(node)) {
		for (const n of node) {
			expect(n).toHaveAttribute("data-selected");
			expect(n).toHaveAttribute("aria-selected", "true");
		}
	} else {
		expect(node).toHaveAttribute("data-selected");
		expect(node).toHaveAttribute("aria-selected", "true");
	}
}

function expectNotSelected(node: HTMLElement | HTMLElement[]) {
	if (Array.isArray(node)) {
		for (const n of node) {
			expect(n).not.toHaveAttribute("data-selected");
			expect(n).not.toHaveAttribute("aria-selected");
		}
	} else {
		expect(node).not.toHaveAttribute("data-selected");
		expect(node).not.toHaveAttribute("aria-selected");
	}
}

function expectHighlighted(node: HTMLElement | HTMLElement[]) {
	if (Array.isArray(node)) {
		for (const n of node) {
			expect(n).toHaveAttribute("data-highlighted");
		}
	} else {
		expect(node).toHaveAttribute("data-highlighted");
	}
}

function expectNotHighlighted(node: HTMLElement | HTMLElement[]) {
	if (Array.isArray(node)) {
		for (const n of node) {
			expect(n).not.toHaveAttribute("data-highlighted");
		}
	} else {
		expect(node).not.toHaveAttribute("data-highlighted");
	}
}
