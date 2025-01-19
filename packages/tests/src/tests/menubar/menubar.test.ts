import { render, screen, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { tick } from "svelte";
import type { Menubar } from "bits-ui";
import { getTestKbd } from "../utils.js";
import MenubarTest from "./menubar-test.svelte";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: Menubar.RootProps = {}) {
	const user = userEvent.setup();
	const returned = render(MenubarTest, { ...props });
	const { getByTestId } = returned;

	const getTrigger = (id: string) => getByTestId(`${id}-trigger`);
	const getContent = (id: string) => getByTestId(`${id}-content`);
	const getSubTrigger = (id: string) => getByTestId(`${id}-sub-trigger`);
	const getSubContent = (id: string) => getByTestId(`${id}-sub-content`);

	return { user, ...returned, getTrigger, getContent, getSubTrigger, getSubContent };
}

describe("menubar", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(MenubarTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it.skip("should have bits data attrs", async () => {
		const menuId = "1";
		const { user, getTrigger, getByTestId, queryByTestId } = setup();
		const trigger = getTrigger(menuId);
		await user.click(trigger);
		await user.click(trigger);
		const content = queryByTestId("1-content");
		await tick();
		await waitFor(() => expect(content).not.toBeNull());

		const root = getByTestId("root");
		expect(root).toHaveAttribute("data-menubar-root");

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
			"checkbox-indicator",
		];
		const mappedParts = parts.map((part) => `${menuId}-${part}`);

		for (const part in parts) {
			const el = screen.getByTestId(mappedParts[part] as string);
			expect(el).toHaveAttribute(`data-menu-${parts[part]}`);
		}

		await user.click(getByTestId("1-sub-trigger"));

		const subContent = getByTestId("1-sub-content");
		expect(subContent).toHaveAttribute(`data-menu-sub-content`);
	});

	it("should navigate triggers within the menubar using arrow keys", async () => {
		const { user, getTrigger } = setup();
		const trigger = getTrigger("1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("2")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("3")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("4")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("1")).toHaveFocus();
	});

	it("should respect the loop prop", async () => {
		const { user, getTrigger } = setup({ loop: false });
		const trigger = getTrigger("1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("2")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("3")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("4")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("4")).toHaveFocus();
	});

	it("should navigate between menus when using the arrow keys and focus is within a menu", async () => {
		const { user, getTrigger, getContent } = setup();
		const trigger = getTrigger("1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		const content1 = getContent("1");
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		const content2 = getContent("2");
		expect(content2).toBeVisible();
		expect(content1).not.toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(getContent("1")).toBeVisible();
		expect(content2).not.toBeVisible();
	});
});
