import { render, screen, waitFor } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { type Component, tick } from "svelte";
import { getTestKbd, setupUserEvents, sleep } from "../utils.js";
import DropdownMenuTest from "./dropdown-menu-test.svelte";
import type { DropdownMenuTestProps } from "./dropdown-menu-test.svelte";
import type { DropdownMenuForceMountTestProps } from "./dropdown-menu-force-mount-test.svelte";
import DropdownMenuForceMountTest from "./dropdown-menu-force-mount-test.svelte";

const kbd = getTestKbd();
const OPEN_KEYS = [kbd.ENTER, kbd.ARROW_DOWN, kbd.SPACE];

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(
	props: DropdownMenuTestProps | DropdownMenuForceMountTestProps = {},
	component: Component = DropdownMenuTest
) {
	const user = setupUserEvents();
	const { getByTestId, queryByTestId } = render(component, { ...props });
	const trigger = getByTestId("trigger");
	return {
		getByTestId,
		queryByTestId,
		user,
		trigger,
	};
}

async function openWithPointer(props: DropdownMenuTestProps = {}) {
	const { getByTestId, queryByTestId, user, trigger } = setup(props);
	const content = queryByTestId("content");
	expect(content).toBeNull();
	await user.click(trigger);
	await tick();
	expect(queryByTestId("content")).not.toBeNull();
	return { getByTestId, queryByTestId, user, trigger };
}

async function openWithKbd(props: DropdownMenuTestProps = {}, key: string = kbd.ENTER) {
	const { getByTestId, queryByTestId, user, trigger } = setup(props);
	const content = queryByTestId("content");
	expect(content).toBeNull();
	trigger.focus();
	await user.keyboard(key);
	await tick();
	expect(queryByTestId("content")).not.toBeNull();
	return { getByTestId, queryByTestId, user, trigger };
}

async function openSubmenu(props: Awaited<ReturnType<typeof openWithKbd>>) {
	const { user, queryByTestId, getByTestId, trigger } = props;
	await user.keyboard(kbd.ARROW_DOWN);
	const subtrigger = getByTestId("sub-trigger");

	await waitFor(() => expect(subtrigger).toHaveFocus());
	expect(queryByTestId("sub-content")).toBeNull();
	await user.keyboard(kbd.ARROW_RIGHT);
	expect(queryByTestId("sub-content")).not.toBeNull();
	await waitFor(() => expect(getByTestId("sub-item")).toHaveFocus());

	return {
		user,
		getByTestId,
		queryByTestId,
		trigger,
	};
}

describe("dropdown menu", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(DropdownMenuTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { user, trigger, getByTestId } = setup();
		await user.click(trigger);

		const parts = [
			"content",
			"trigger",
			"group",
			"group-heading",
			"separator",
			"sub-trigger",
			"item",
			"checkbox-item",
			"radio-group",
			"radio-item",
		];

		for (const part of parts) {
			const el = screen.getByTestId(part);
			expect(el).toHaveAttribute(`data-dropdown-menu-${part}`);
		}

		await user.click(getByTestId("sub-trigger"));

		const subContent = getByTestId("sub-content");
		expect(subContent).toHaveAttribute(`data-dropdown-menu-sub-content`);
	});

	it.each(OPEN_KEYS)("should open when %s is pressed & respects binding", async (key) => {
		await openWithKbd({}, key);
	});

	it("should open when clicked & respects binding", async () => {
		const { getByTestId, queryByTestId, user, trigger } = setup();
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(trigger);
		expect(queryByTestId("content")).not.toBeNull();
		expect(binding).toHaveTextContent("true");
	});

	it("should manage focus correctly when opened with pointer", async () => {
		const { getByTestId, user } = await openWithPointer();

		const item = getByTestId("item");
		expect(item).not.toHaveFocus();

		await user.keyboard(kbd.ARROW_DOWN);
		expect(item).toHaveFocus();
	});

	it("should manage focus correctly when opened with keyboard", async () => {
		const { user, getByTestId, queryByTestId, trigger } = setup();

		expect(queryByTestId("content")).toBeNull();

		trigger.focus();
		await user.keyboard(kbd.ENTER);

		expect(queryByTestId("content")).not.toBeNull();
		const item = getByTestId("item");
		await waitFor(() => expect(item).toHaveFocus());
	});

	it("should open submenu with keyboard on subtrigger", async () => {
		const { getByTestId, queryByTestId, user } = await openWithKbd();

		await user.keyboard(kbd.ARROW_DOWN);
		const subtrigger = getByTestId("sub-trigger");
		await waitFor(() => expect(subtrigger).toHaveFocus());
		expect(queryByTestId("sub-content")).toBeNull();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(queryByTestId("sub-content")).not.toBeNull();
		await waitFor(() => expect(getByTestId("sub-item")).toHaveFocus());
	});

	it("should toggle the checkbox item when clicked & respects binding", async () => {
		const { getByTestId, user, trigger } = await openWithPointer();
		const checkedBinding = getByTestId("checked-binding");
		const indicator = getByTestId("checkbox-indicator");
		expect(indicator).not.toHaveTextContent("checked");
		expect(checkedBinding).toHaveTextContent("false");
		const checkbox = getByTestId("checkbox-item");
		await user.click(checkbox);
		expect(checkedBinding).toHaveTextContent("true");
		await user.click(trigger);
		expect(indicator).toHaveTextContent("true");
		await user.click(getByTestId("checkbox-item"));
		expect(checkedBinding).toHaveTextContent("false");

		await user.click(checkedBinding);
		expect(checkedBinding).toHaveTextContent("true");
		await user.click(trigger);
		expect(getByTestId("checkbox-indicator")).toHaveTextContent("true");
	});

	it("should toggle checkbox items within submenus when clicked & respects binding", async () => {
		const props = await openWithKbd();
		const { getByTestId, user, trigger } = props;
		await openSubmenu(props);
		const subCheckedBinding = getByTestId("sub-checked-binding");
		expect(subCheckedBinding).toHaveTextContent("false");
		const indicator = getByTestId("sub-checkbox-indicator");
		expect(indicator).not.toHaveTextContent("true");
		const subCheckbox = getByTestId("sub-checkbox-item");
		await user.click(subCheckbox);
		expect(subCheckedBinding).toHaveTextContent("true");
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		await openSubmenu(props);
		expect(getByTestId("sub-checkbox-indicator")).toHaveTextContent("true");
		await user.click(getByTestId("sub-checkbox-item"));
		expect(subCheckedBinding).toHaveTextContent("false");

		await user.click(subCheckedBinding);
		expect(subCheckedBinding).toHaveTextContent("true");
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		await openSubmenu(props);
		expect(getByTestId("sub-checkbox-indicator")).toHaveTextContent("true");
	});

	it("should check the radio item when clicked & respects binding", async () => {
		const { getByTestId, queryByTestId, user, trigger } = await openWithPointer();
		const radioBinding = getByTestId("radio-binding");
		expect(radioBinding).toHaveTextContent("");
		const radioItem1 = getByTestId("radio-item");
		await user.click(radioItem1);
		expect(radioBinding).toHaveTextContent("1");
		await user.click(trigger);
		const radioIndicator1 = getByTestId("radio-indicator-1");
		expect(radioIndicator1).not.toBeNull();
		expect(radioIndicator1).toHaveTextContent("true");
		const radioItem2 = getByTestId("radio-item-2");
		await user.click(radioItem2);
		expect(radioBinding).toHaveTextContent("2");
		await user.click(trigger);
		expect(queryByTestId("radio-indicator-1")).toHaveTextContent("false");
		expect(queryByTestId("radio-indicator-2")).toHaveTextContent("true");

		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
		await user.click(radioBinding);
		expect(radioBinding).toHaveTextContent("");
		await user.click(trigger);
	});

	it("should skip over disabled items when navigating with the keyboard", async () => {
		const { user, getByTestId } = await openWithKbd();
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("sub-trigger")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("checkbox-item")).toHaveFocus());
		expect(getByTestId("disabled-item")).not.toHaveFocus();
		expect(getByTestId("disabled-item-2")).not.toHaveFocus();
	});

	it("should not loop through the menu items when the `loop` prop is set to false/undefined", async () => {
		const { user, getByTestId } = await openWithKbd({
			contentProps: {
				loop: false,
			},
		});
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("sub-trigger")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("checkbox-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("radio-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("radio-item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item")).not.toHaveFocus());
	});

	it("should loop through the menu items when the `loop` prop is set to true", async () => {
		const { user, getByTestId } = await openWithKbd({
			contentProps: {
				loop: true,
			},
		});
		await sleep(25);
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("sub-trigger")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("checkbox-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("radio-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("radio-item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item")).toHaveFocus());
	});

	it("should close the menu on escape", async () => {
		const { queryByTestId, user } = await openWithKbd();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it("should respect the `escapeKeydownBehavior` prop", async () => {
		const { queryByTestId, user } = await openWithKbd({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("should respect the `interactOutsideBehavior` prop", async () => {
		const { queryByTestId, user, getByTestId } = await openWithPointer({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("should portal to the body if a `portal` prop is not passed", async () => {
		const { getByTestId } = await openWithPointer();
		const content = getByTestId("content");
		expect(content.parentElement?.parentElement).toEqual(document.body);
	});

	it("should portal to the portal target if a valid `portal` prop is passed", async () => {
		const { getByTestId } = await openWithPointer({
			portalProps: {
				to: "#portal-target",
			},
		});
		const content = getByTestId("content");
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement?.parentElement).toEqual(portalTarget);
	});

	it("should not portal if `disabled` is passed to the portal", async () => {
		const { getByTestId } = await openWithPointer({
			portalProps: {
				disabled: true,
			},
		});
		const content = getByTestId("content");
		const ogContainer = getByTestId("non-portal-container");
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).not.toEqual(document.body);
		expect(contentWrapper?.parentElement).toEqual(ogContainer);
	});

	it("should allow preventing autofocusing first item with `onOpenAutoFocus`  prop", async () => {
		const { getByTestId } = await openWithKbd({
			contentProps: {
				onOpenAutoFocus: (e) => {
					e.preventDefault();
				},
			},
		});
		await waitFor(() => expect(getByTestId("item")).not.toHaveFocus());
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const { getByTestId } = setup({}, DropdownMenuForceMountTest);

		expect(getByTestId("content")).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const { queryByTestId, getByTestId, user, trigger } = setup(
			{
				withOpenCheck: true,
			},
			DropdownMenuForceMountTest
		);
		expect(queryByTestId("content")).toBeNull();

		await user.click(trigger);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});
});
