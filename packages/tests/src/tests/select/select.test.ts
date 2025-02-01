import { render, waitFor } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { type Component } from "svelte";
import { describe, it, vi } from "vitest";
import { getTestId } from "../helpers/select.js";
import { type AnyFn, getTestKbd, setupUserEvents, sleep } from "../utils.js";
import type { SelectForceMountTestProps } from "./select-force-mount-test.svelte";
import SelectForceMountTest from "./select-force-mount-test.svelte";
import type { SelectMultipleTestProps } from "./select-multi-test.svelte";
import SelectMultiTest from "./select-multi-test.svelte";
import type { Item, SelectSingleTestProps } from "./select-test.svelte";
import SelectTest from "./select-test.svelte";

const kbd = getTestKbd();

const testItems: Item[] = [
	{
		value: "",
		label: "None",
	},
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
	props: Partial<SelectSingleTestProps | SelectForceMountTestProps> = {},
	items: Item[] = testItems,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: Component<any, any, any> = SelectTest
) {
	const user = setupUserEvents();
	const returned = render(component, { name: "test", ...props, items });
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
		trigger,
		valueBinding,
		openBinding,
		outside,
		getHiddenInput,
		getContent,
		...returned,
	};
}

function setupMultiple(props: Partial<SelectMultipleTestProps> = {}, items: Item[] = testItems) {
	const user = setupUserEvents();
	// @ts-expect-error - testing lib needs to update their generic types
	const returned = render(SelectMultiTest, { name: "test", ...props, items });
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
	props: Partial<SelectSingleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	_searchValue?: string
) {
	const returned = setupSingle(props);

	const { queryByTestId, getByTestId, user, trigger } = returned;
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else {
		trigger.focus();
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
	props: Partial<SelectMultipleTestProps> = {},
	openWith: "click" | "type" | (string & {}) = "click",
	_searchValue?: string
) {
	const returned = setupMultiple(props);
	const { queryByTestId, getByTestId, user, trigger } = returned;
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else {
		trigger.focus();
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

describe("select - single", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(SelectTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should open on click", async () => {
		await openSingle();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openSingle({}, key);
	});

	it("should apply the appropriate `aria-labelledby` attribute to the group", async () => {
		const { group, groupHeading } = await openSingle();

		expect(group).toHaveAttribute("aria-labelledby", groupHeading.id);
	});

	it("should select item with the enter key", async () => {
		const { user, trigger } = await openSingle();
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(trigger).toHaveTextContent("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const { user, trigger } = await openSingle();
		trigger.focus();
		expect(trigger).toHaveAttribute("data-placeholder");
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(trigger).toHaveTextContent("A");
		expect(trigger).not.toHaveAttribute("data-placeholder");
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
		const { getByTestId, user, queryByTestId, trigger, getHiddenInput } = await openSingle();
		const [_, item1] = getItems(getByTestId);
		expect(queryByTestId("1-indicator")).toBeNull();
		await user.click(item1!);
		expect(trigger).toHaveTextContent("A");
		expect(getHiddenInput()).toHaveValue("1");
		await user.click(trigger);
		expectSelected(item1!);
		expect(queryByTestId("1-indicator")).not.toBeNull();
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const { getByTestId, user } = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
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

		const [item0, item1, item2, item3, item4] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item4!);
		expectHighlighted(item0!);

		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item4!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item4!);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const { getByTestId, user, trigger, getHiddenInput } = await openSingle({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(getByTestId);

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		await sleep(100);
		expect(getByTestId("trigger")).toHaveTextContent("D");
		expect(getHiddenInput()).toHaveValue("4");
		await user.click(trigger);
		expectNotSelected([item0!, item1!, item2!, item3!]);
		expectSelected(item4!);
	});

	it("should select first item with empty string value when pressing Enter", async () => {
		const { user, trigger, valueBinding } = await openSingle();
		trigger.focus();
		await user.keyboard(kbd.ENTER); // first item ("")
		expect(valueBinding).toHaveTextContent("empty");
		expect(trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value after navigating through items", async () => {
		const { user, trigger, valueBinding } = await openSingle();
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN); // to "1"
		await user.keyboard(kbd.ARROW_UP); // back to ""
		await user.keyboard(kbd.ENTER);
		expect(valueBinding).toHaveTextContent("empty");
		expect(trigger).toHaveTextContent("Open Listbox");
	});

	it("should select empty string value in loop navigation", async () => {
		const { user, trigger, valueBinding } = await openSingle({ loop: true });
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN); // to "1"
		await user.keyboard(kbd.ARROW_DOWN); // to "2"
		await user.keyboard(kbd.ARROW_DOWN); // to "3"
		await user.keyboard(kbd.ARROW_DOWN); // to "4"
		await user.keyboard(kbd.ARROW_DOWN); // back to ""
		await user.keyboard(kbd.ENTER);
		expect(valueBinding).toHaveTextContent("empty");
		expect(trigger).toHaveTextContent("Open Listbox");
	});

	it("should revert to empty state when deselecting a value", async () => {
		const { user, trigger, valueBinding } = await openSingle();
		trigger.focus();
		// First select a non-empty value
		await user.keyboard(kbd.ARROW_DOWN); // to "1"
		await user.keyboard(kbd.ENTER);
		expect(valueBinding).not.toHaveTextContent("empty");

		// Then deselect by selecting empty value
		await user.click(trigger);
		await user.keyboard(kbd.ARROW_UP); // back to ""
		await user.keyboard(kbd.ENTER);
		expect(valueBinding).toHaveTextContent("empty");
		expect(trigger).toHaveTextContent("Open Listbox");
	});

	it("should maintain empty value after reopening", async () => {
		const { user, trigger, valueBinding } = await openSingle();
		// Select empty value
		await user.keyboard(kbd.ENTER);
		expect(valueBinding).toHaveTextContent("empty");

		// Close and reopen
		await user.keyboard(kbd.ESCAPE);
		await user.click(trigger);
		expect(valueBinding).toHaveTextContent("empty");
		expect(trigger).toHaveTextContent("Open Listbox");
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

	it.skip("should start keyboard navigation at the highlighted item even if hovered with mouse", async () => {
		const { getByTestId, user, trigger } = await openSingle({}, kbd.ARROW_DOWN);
		const [item1, item2, item3] = getItems(getByTestId);
		await user.click(trigger);
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
		const { getByTestId, queryByTestId, trigger, getHiddenInput } = await openSingle({
			value: "2",
		});
		expect(queryByTestId("2-indicator")).not.toBeNull();
		expect(trigger).toHaveTextContent("B");
		expect(getHiddenInput()).toHaveValue("2");
		const [_, __, item2] = getItems(getByTestId);
		expectSelected(item2!);
	});

	it("should allow navigating after navigating to the bottom, closing, and reopening the menu", async () => {
		const { getByTestId, user, getContent, trigger } = await openSingle();
		trigger.focus();

		const [item0, item1, item2, item3, item4] = getItems(getByTestId);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
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
		const { getByTestId } = setupSingle({}, [], SelectForceMountTest);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const { queryByTestId, getByTestId, user, trigger } = setupSingle(
			{ withOpenCheck: true },
			[],
			SelectForceMountTest
		);

		expect(queryByTestId("content")).toBeNull();

		await user.click(trigger);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});

	it("should not deselect the selected item when the user clicks on the selected item", async () => {
		const { getByTestId, user, trigger } = await openSingle();

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

	it("should allow deselecting an item when `allowDeselect` is true", async () => {
		const { getByTestId, user, trigger } = await openSingle({
			allowDeselect: true,
		});
		const [_, item1] = getItems(getByTestId);
		await user.click(item1!);
		expectSelected(item1!);
		await user.click(trigger);

		const [__, item2] = getItems(getByTestId);

		await user.click(item2!);
		expectNotSelected(item2!);
	});
});

////////////////////////////////////
// MULTIPLE
////////////////////////////////////
describe("select - multiple", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(SelectMultiTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should open on click", async () => {
		await openMultiple();
	});

	it.each(OPEN_KEYS)("should open on %s keydown", async (key) => {
		await openMultiple({}, key);
	});

	it("should select item with the enter key", async () => {
		const mockFn = vi.fn();
		const { user, trigger } = await openMultiple({
			onSelectedLabelChange: mockFn,
		});
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
	});

	it("should have the placeholder attribute when empty and not when not empty", async () => {
		const mockFn = vi.fn();
		const { user, trigger } = await openMultiple({
			onSelectedLabelChange: mockFn,
		});
		trigger.focus();
		expect(trigger).toHaveAttribute("data-placeholder");
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(mockFn).toHaveBeenCalledWith("A");
		expect(trigger).not.toHaveAttribute("data-placeholder");
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
		const { getByTestId, user, queryByTestId, trigger, getHiddenInputs } = await openMultiple();
		const [_, item] = getItems(getByTestId);
		await waitFor(() => expect(queryByTestId("1-indicator")).toBeNull());
		await user.click(item!);
		expect(trigger).toHaveTextContent("A");
		expect(getHiddenInputs()).toHaveLength(1);
		expect(getHiddenInputs()[0]).toHaveValue("1");

		expectSelected(item!);
		await waitFor(() => expect(queryByTestId("1-indicator")).not.toBeNull());
	});

	it("should navigate through the items using the keyboard (loop = false)", async () => {
		const { getByTestId, user } = await openMultiple({}, kbd.ARROW_DOWN);

		const [item0, item1, item2, item3, item4] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
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

		const [item0, item1, item2, item3, item4] = getItems(getByTestId);

		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectHighlighted(item4!);
		await user.keyboard(kbd.ARROW_DOWN);
		expectNotHighlighted(item4!);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item4!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item2!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item1!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item0!);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item4!);
	});

	it("should allow items to be selected using the keyboard", async () => {
		const { getByTestId, user, trigger, getHiddenInputs } = await openMultiple(
			{},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3, item4] = getItems(getByTestId);

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(trigger).toHaveTextContent("D");
		const hiddenInputs = getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		expect(hiddenInputs[0]).toHaveValue("4");
		await user.click(trigger);
		expectNotSelected([item0!, item1!, item2!, item3!]);
		expectSelected(item4!);
	});

	it("should allow multiple items to be selected using the keyboard", async () => {
		const { getByTestId, user, trigger, getHiddenInputs } = await openMultiple(
			{},
			kbd.ARROW_DOWN
		);

		const [item0, item1, item2, item3, item4] = getItems(getByTestId);

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ENTER);
		expect(trigger).toHaveTextContent("D");
		const hiddenInputs = getHiddenInputs();
		expect(hiddenInputs).toHaveLength(1);
		expect(hiddenInputs[0]).toHaveValue("4");
		expectSelected(item4!);
		expectNotSelected([item0!, item1!, item2!, item3!]);
		await user.keyboard(kbd.ARROW_UP);
		expectHighlighted(item3!);
		await user.keyboard(kbd.ENTER);
		expectSelected([item4!, item3!]);
		expectNotSelected([item0!, item1!, item2!]);
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
		const { getByTestId, queryByTestId, trigger, getHiddenInputs } = await openMultiple({
			value: ["2"],
		});
		expect(queryByTestId("2-indicator")).not.toBeNull();
		expect(trigger).toHaveTextContent("B");

		expect(getHiddenInputs()[0]).toHaveValue("2");
		const [_, __, item2] = getItems(getByTestId);
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
		itemsArr.push(getter(getTestId(item)));
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
