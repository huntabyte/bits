import { cleanup, render, screen, waitFor } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import type { Component } from "svelte";
import { getTestKbd, setupUserEvents } from "../utils.js";
import ContextMenuTest from "./context-menu-test.svelte";
import type { ContextMenuTestProps } from "./context-menu-test.svelte";
import type { ContextMenuForceMountTestProps } from "./context-menu-force-mount-test.svelte";
import ContextMenuForceMountTest from "./context-menu-force-mount-test.svelte";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(
	props: ContextMenuTestProps | ContextMenuForceMountTestProps = {},
	component: Component = ContextMenuTest
) {
	const user = setupUserEvents();
	const returned = render(component, { ...props });
	const trigger = returned.getByTestId("trigger");
	function getContent() {
		return returned.queryByTestId("content");
	}

	function getSubContent() {
		return returned.queryByTestId("sub-content");
	}
	return {
		...returned,
		getContent,
		getSubContent,
		user,
		trigger,
	};
}

async function open(props: ContextMenuTestProps = {}) {
	const { getByTestId, queryByTestId, user, trigger, getContent, ...returned } = setup(props);

	expect(getContent()).toBeNull();
	await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
	expect(getContent()).not.toBeNull();
	return { getByTestId, queryByTestId, user, trigger, getContent, ...returned };
}

async function openSubmenu(props: Awaited<ReturnType<typeof open>>) {
	const { user, queryByTestId, getByTestId, trigger } = props;
	await user.keyboard(kbd.ARROW_DOWN);
	await user.keyboard(kbd.ARROW_DOWN);

	await waitFor(() => expect(queryByTestId("sub-trigger")).toHaveFocus());

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

describe("context menu", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(ContextMenuTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { user, trigger, getByTestId } = setup();
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);

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
			expect(el).toHaveAttribute(`data-context-menu-${part}`);
		}

		await user.click(getByTestId("sub-trigger"));

		const subContent = getByTestId("sub-content");
		expect(subContent).toHaveAttribute(`data-context-menu-sub-content`);
	});

	it("should open when right-clicked & respects binding", async () => {
		const { getByTestId, getContent, user, trigger } = setup();
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(getContent()).not.toBeNull();
		expect(binding).toHaveTextContent("true");
	});

	it("should manage focus correctly when opened with pointer", async () => {
		cleanup();
		const { queryByTestId, user } = await open();
		const item = queryByTestId("item");
		expect(item).not.toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(item).toHaveFocus();
	});

	it("should open submenu with keyboard on subtrigger", async () => {
		const { getByTestId, queryByTestId, user } = await open();

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		const subtrigger = getByTestId("sub-trigger");
		await waitFor(() => expect(subtrigger).toHaveFocus());
		expect(queryByTestId("sub-content")).toBeNull();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(queryByTestId("sub-content")).not.toBeNull();
		await waitFor(() => expect(getByTestId("sub-item")).toHaveFocus());
	});

	it("should toggle the checkbox item when clicked & respects binding", async () => {
		const { getByTestId, user, trigger } = await open();
		const checkedBinding = getByTestId("checked-binding");
		const indicator = getByTestId("checkbox-indicator");
		expect(indicator).not.toHaveTextContent("true");
		expect(checkedBinding).toHaveTextContent("false");
		const checkbox = getByTestId("checkbox-item");
		await user.click(checkbox);
		expect(checkedBinding).toHaveTextContent("true");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(indicator).toHaveTextContent("true");
		await user.click(getByTestId("checkbox-item"));
		expect(checkedBinding).toHaveTextContent("false");

		await user.click(checkedBinding);
		expect(checkedBinding).toHaveTextContent("true");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(getByTestId("checkbox-indicator")).toHaveTextContent("true");
	});

	it("should toggle checkbox items within submenus when clicked & respects binding", async () => {
		const props = await open();
		const { getByTestId, user, trigger } = props;
		await openSubmenu(props);
		const subCheckedBinding = getByTestId("sub-checked-binding");
		expect(subCheckedBinding).toHaveTextContent("false");
		const indicator = getByTestId("sub-checkbox-indicator");
		expect(indicator).not.toHaveTextContent("true");
		const subCheckbox = getByTestId("sub-checkbox-item");
		await user.click(subCheckbox);
		expect(subCheckedBinding).toHaveTextContent("true");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		await openSubmenu(props);
		expect(getByTestId("sub-checkbox-indicator")).toHaveTextContent("true");
		await user.click(getByTestId("sub-checkbox-item"));
		expect(subCheckedBinding).toHaveTextContent("false");

		await user.click(subCheckedBinding);
		expect(subCheckedBinding).toHaveTextContent("true");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		await openSubmenu(props);
		expect(getByTestId("sub-checkbox-indicator")).toHaveTextContent("true");
	});

	it("should check the radio item when clicked & respects binding", async () => {
		const { getByTestId, queryByTestId, getContent, user, trigger } = await open();
		const radioBinding = getByTestId("radio-binding");
		expect(radioBinding).toHaveTextContent("");
		const radioItem1 = getByTestId("radio-item");
		await user.click(radioItem1);
		expect(radioBinding).toHaveTextContent("1");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		const radioIndicator = getByTestId("radio-indicator-1");
		expect(radioIndicator).toHaveTextContent("true");
		const radioItem2 = getByTestId("radio-item-2");
		await user.click(radioItem2);
		expect(radioBinding).toHaveTextContent("2");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(queryByTestId("radio-indicator-2")).toHaveTextContent("true");

		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).toBeNull();
		await user.click(radioBinding);
		expect(radioBinding).toHaveTextContent("");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
	});

	it("should skip disabled items when navigating with the keyboard", async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("sub-trigger")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("checkbox-item")).toHaveFocus());
		expect(queryByTestId("disabled-item")).not.toHaveFocus();
		expect(queryByTestId("disabled-item-2")).not.toHaveFocus();
	});

	it("should not loop through the menu items when the `loop` prop is set to false", async () => {
		const { user, queryByTestId } = await open({
			contentProps: {
				loop: false,
			},
		});
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("sub-trigger")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("checkbox-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("radio-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("radio-item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(queryByTestId("item")).not.toHaveFocus());
	});

	it("should loop through the menu items when the `loop` prop is set to true", async () => {
		const { user, getByTestId } = await open({
			contentProps: {
				loop: true,
			},
		});
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item")).toHaveFocus());
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
		const { user, getContent } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).toBeNull();
	});

	it("should respect the `escapeKeydownBehavior: 'ignore'` prop", async () => {
		const { getContent, user } = await open({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});
		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).not.toBeNull();
	});

	it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
		const { getContent, user, getByTestId } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(getContent()).not.toBeNull();
	});

	it("should portal to the body if a `to` prop is not passed to the Portal", async () => {
		const { getByTestId } = await open();
		const content = getByTestId("content");
		const wrapper = content.parentElement;
		expect(wrapper?.parentElement).toEqual(document.body);
	});

	it("should portal to the portal target if a valid `to` prop is passed to the portal", async () => {
		const { getByTestId } = await open({
			portalProps: {
				to: "#portal-target",
			},
		});
		const content = getByTestId("content");
		const wrapper = content.parentElement;
		const portalTarget = getByTestId("portal-target");
		expect(wrapper?.parentElement).toEqual(portalTarget);
	});

	it("should not portal if `disabled: true` is passed to the Portal", async () => {
		const { getByTestId } = await open({
			portalProps: {
				disabled: true,
			},
		});
		const content = getByTestId("content");
		const ogContainer = getByTestId("non-portal-container");
		const wrapper = content.parentElement;
		expect(wrapper?.parentElement).not.toEqual(document.body);
		expect(wrapper?.parentElement).toEqual(ogContainer);
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const { getByTestId } = setup({}, ContextMenuForceMountTest);

		expect(getByTestId("content")).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const { queryByTestId, getByTestId, user, trigger } = setup(
			{
				withOpenCheck: true,
			},
			ContextMenuForceMountTest
		);
		expect(queryByTestId("content")).toBeNull();

		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});
});
