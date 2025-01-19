import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd } from "../utils.js";
import TabsTest from "./tabs-test.svelte";
import type { Item, TabsTestProps } from "./tabs-test.svelte";

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
];

function setup(props: Partial<TabsTestProps> = {}) {
	const user = userEvent.setup();
	const withDefaults = { ...{ items }, ...props };
	const returned = render(TabsTest, withDefaults);
	return {
		user,
		...returned,
	};
}

describe("tabs", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(TabsTest, {
			items: [
				{
					value: "1",
					disabled: false,
				},
			],
			value: "1",
		});
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = render(TabsTest, {
			items: [items[0] as Item],
		});

		const root = getByTestId("root");
		const list = getByTestId("list");
		const trigger = getByTestId("trigger-1");
		const content = getByTestId("content-1");

		expect(root).toHaveAttribute("data-tabs-root");
		expect(list).toHaveAttribute("data-tabs-list");
		expect(trigger).toHaveAttribute("data-tabs-trigger");
		expect(content).toHaveAttribute("data-tabs-content");
	});

	it("should switch tabs on click", async () => {
		const { getByTestId, user } = setup();

		const trigger1 = getByTestId("trigger-1");
		const trigger2 = getByTestId("trigger-2");
		const trigger3 = getByTestId("trigger-3");

		const content1 = getByTestId("content-1");
		const content2 = getByTestId("content-2");
		const content3 = getByTestId("content-3");

		expect(content1).toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).not.toBeVisible();

		await user.click(trigger2);
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		expect(content3).not.toBeVisible();

		await user.click(trigger3);
		expect(content1).not.toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();

		await user.click(trigger1);
		expect(content1).toBeVisible();
		expect(content2).not.toBeVisible();
		expect(content3).not.toBeVisible();
	});

	it("should navigate the tabs with the keyboard", async () => {
		const { getByTestId, user } = setup();

		const trigger1 = getByTestId("trigger-1");
		const trigger2 = getByTestId("trigger-2");
		const trigger3 = getByTestId("trigger-3");
		const content1 = getByTestId("content-1");
		const content2 = getByTestId("content-2");
		const content3 = getByTestId("content-3");

		trigger1.focus();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger2).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger3).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger1).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger2).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content2).toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger1).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
	});

	it("should respect the loop prop", async () => {
		const { getByTestId, user } = setup({ loop: false });

		const trigger1 = getByTestId("trigger-1");
		const trigger3 = getByTestId("trigger-3");

		trigger1.focus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(trigger3).not.toHaveFocus();
		expect(trigger1).toHaveFocus();

		trigger3.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger1).not.toHaveFocus();
		expect(trigger3).toHaveFocus();
	});

	it("should respect the `activationMode: 'manual'` prop", async () => {
		const { getByTestId, user } = setup({
			activationMode: "manual",
		});

		const trigger1 = getByTestId("trigger-1");
		const trigger2 = getByTestId("trigger-2");
		const trigger3 = getByTestId("trigger-3");
		const content1 = getByTestId("content-1");
		const content2 = getByTestId("content-2");
		const content3 = getByTestId("content-3");

		trigger1.focus();
		await user.keyboard(kbd.ENTER);
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger2).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(trigger3).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
	});

	it("should navigate using up & down when orientation is vertical", async () => {
		const { getByTestId, user } = setup({
			orientation: "vertical",
		});

		const trigger1 = getByTestId("trigger-1");
		const trigger2 = getByTestId("trigger-2");
		const trigger3 = getByTestId("trigger-3");
		const content1 = getByTestId("content-1");
		const content2 = getByTestId("content-2");
		const content3 = getByTestId("content-3");

		trigger1.focus();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(trigger2).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content2).toBeVisible();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(trigger3).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content3).toBeVisible();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(trigger1).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_UP);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
		await user.keyboard(kbd.ARROW_UP);
		expect(trigger2).toHaveFocus();
		expect(content3).not.toBeVisible();
		expect(content2).toBeVisible();
		await user.keyboard(kbd.ARROW_UP);
		expect(trigger1).toHaveFocus();
		expect(content2).not.toBeVisible();
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_UP);
		expect(trigger3).toHaveFocus();
		expect(content1).not.toBeVisible();
		expect(content3).toBeVisible();
	});

	it("should apply appropriate `aria-controls` and `aria-labelledby` attributes to the `Tabs.Trigger` and `Tabs.Content` components", async () => {
		const { getByTestId } = setup();
		const triggers = [
			getByTestId("trigger-1"),
			getByTestId("trigger-2"),
			getByTestId("trigger-3"),
		];

		const contents = [
			getByTestId("content-1"),
			getByTestId("content-2"),
			getByTestId("content-3"),
		];

		for (let i = 0; i < triggers.length; i++) {
			const trigger = triggers[i]!;
			const content = contents[i]!;

			expect(content).toHaveAttribute("role", "tabpanel");
			expect(trigger).toHaveAttribute("role", "tab");
			expect(trigger.getAttribute("aria-controls")).toBe(content.id);
			expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);
		}
	});

	it("should apply tabindex 0 to the active tab trigger on mount", async () => {
		const { getByTestId } = setup({
			value: "2",
		});
		const [trigger1, trigger2, trigger3] = [
			getByTestId("trigger-1"),
			getByTestId("trigger-2"),
			getByTestId("trigger-3"),
		];

		expect(trigger1).toHaveAttribute("tabindex", "-1");
		expect(trigger2).toHaveAttribute("tabindex", "0");
		expect(trigger3).toHaveAttribute("tabindex", "-1");
	});
});
