import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd } from "../utils.js";
import ToolbarTest from "./toolbar-test.svelte";
import type { ToolbarTestProps } from "./toolbar-test.svelte";

const kbd = getTestKbd();

function setup(props: Partial<ToolbarTestProps> = {}) {
	const user = userEvent.setup();
	const returned = render(ToolbarTest, { ...props });
	const root = returned.getByTestId("root");
	const groupMultiple = returned.getByTestId("group-multiple");
	const groupMultipleItemBold = returned.getByTestId("group-multiple-bold");
	const groupMultipleItemItalic = returned.getByTestId("group-multiple-italic");
	const groupMultipleItemStrikethrough = returned.getByTestId("group-multiple-strikethrough");
	const groupSingle = returned.getByTestId("group-single");
	const groupSingleItemLeft = returned.getByTestId("group-single-left");
	const groupSingleItemCenter = returned.getByTestId("group-single-center");
	const groupSingleItemRight = returned.getByTestId("group-single-right");
	const link = returned.getByTestId("link");
	const button = returned.getByTestId("button");
	const styleBinding = returned.getByTestId("style-binding");
	const alignBinding = returned.getByTestId("align-binding");
	const clickedBinding = returned.getByTestId("clicked-binding");
	return {
		user,
		root,
		groupMultiple,
		groupMultipleItemBold,
		groupMultipleItemItalic,
		groupMultipleItemStrikethrough,
		groupSingle,
		groupSingleItemLeft,
		groupSingleItemCenter,
		groupSingleItemRight,
		link,
		button,
		styleBinding,
		alignBinding,
		clickedBinding,
		...returned,
	};
}

describe("toolbar", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(ToolbarTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const {
			root,
			groupMultiple,
			groupMultipleItemBold,
			groupSingle,
			groupSingleItemLeft,
			link,
			button,
		} = setup();
		expect(root).toHaveAttribute("data-toolbar-root");
		expect(groupMultiple).toHaveAttribute("data-toolbar-group");
		expect(groupMultipleItemBold).toHaveAttribute("data-toolbar-group-item");
		expect(groupSingle).toHaveAttribute("data-toolbar-group");
		expect(groupSingleItemLeft).toHaveAttribute("data-toolbar-group-item");
		expect(link).toHaveAttribute("data-toolbar-link");
		expect(button).toHaveAttribute("data-toolbar-button");
	});

	it("should navigate between the items using the arrow keys", async () => {
		const {
			user,
			groupMultipleItemBold,
			groupMultipleItemItalic,
			groupMultipleItemStrikethrough,
			groupSingleItemLeft,
			groupSingleItemCenter,
			groupSingleItemRight,
			link,
			button,
		} = setup();
		groupMultipleItemBold.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupMultipleItemItalic).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupMultipleItemStrikethrough).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupSingleItemLeft).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupSingleItemCenter).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupSingleItemRight).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(link).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(button).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
	});

	it("should loop around when navigating with the arrow keys", async () => {
		const { user, groupMultipleItemBold, button } = setup();
		groupMultipleItemBold.focus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(button).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupMultipleItemBold).toHaveFocus();
	});

	it("should respect the loop: false prop", async () => {
		const { user, groupMultipleItemBold, button } = setup({
			loop: false,
		});
		groupMultipleItemBold.focus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(button).not.toHaveFocus();
		expect(groupMultipleItemBold).toHaveFocus();
		button.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupMultipleItemBold).not.toHaveFocus();
		expect(button).toHaveFocus();
	});

	it("should toggles when clicked when toolbar toogle group, type `'single'`", async () => {
		const { user, groupSingleItemLeft, groupSingleItemCenter, alignBinding } = setup();
		expect(alignBinding).toHaveTextContent("");
		await user.click(groupSingleItemLeft);
		expect(alignBinding).toHaveTextContent("left");
		await user.click(groupSingleItemCenter);
		expect(alignBinding).toHaveTextContent("center");
	});

	it.each([kbd.ENTER, kbd.SPACE])(
		"should toggles when the %s key is pressed when toolbar toogle group, type `'single'`",
		async (key) => {
			const { user, groupSingleItemLeft, groupSingleItemCenter, alignBinding } = setup();
			expect(alignBinding).toHaveTextContent("");
			groupSingleItemLeft.focus();
			await user.keyboard(key);
			expect(alignBinding).toHaveTextContent("left");
			groupSingleItemCenter.focus();
			await user.keyboard(key);
			expect(alignBinding).toHaveTextContent("center");
		}
	);

	it("should allow multiple items to be selected with toolbar toggle group type `'multiple'`", async () => {
		const {
			user,
			groupMultipleItemBold,
			groupMultipleItemItalic,
			groupMultipleItemStrikethrough,
			styleBinding,
		} = setup();
		expect(styleBinding).toHaveTextContent("bold");
		await user.click(groupMultipleItemItalic);
		expect(styleBinding).toHaveTextContent("bold,italic");
		await user.click(groupMultipleItemStrikethrough);
		expect(styleBinding).toHaveTextContent("bold,italic,strikethrough");
		await user.click(groupMultipleItemBold);
		expect(styleBinding).toHaveTextContent("italic,strikethrough");
		await user.click(groupMultipleItemItalic);
		expect(styleBinding).toHaveTextContent("strikethrough");
		await user.click(groupMultipleItemStrikethrough);
		expect(styleBinding).toHaveTextContent("");
	});

	it("should disable group items when the `disabled` prop is set to true", async () => {
		const {
			groupMultipleItemBold,
			groupMultipleItemItalic,
			groupMultipleItemStrikethrough,
			groupSingleItemLeft,
			groupSingleItemCenter,
			groupSingleItemRight,
		} = setup({
			multipleProps: { disabled: true },
			singleProps: { disabled: true },
		});
		expect(groupMultipleItemBold).toBeDisabled();
		expect(groupMultipleItemItalic).toBeDisabled();
		expect(groupMultipleItemStrikethrough).toBeDisabled();
		expect(groupSingleItemLeft).toBeDisabled();
		expect(groupSingleItemCenter).toBeDisabled();
		expect(groupSingleItemRight).toBeDisabled();
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newMultipleValue;
		function multipleOnValueChange(next: string[] | undefined) {
			newMultipleValue = next;
		}

		let newSingleValue;
		function singleOnValueChange(next: string | undefined) {
			newSingleValue = next;
		}

		const { user, groupMultipleItemStrikethrough, groupSingleItemRight } = setup({
			multipleProps: { onValueChange: multipleOnValueChange },
			singleProps: { onValueChange: singleOnValueChange },
		});

		await user.click(groupMultipleItemStrikethrough);
		expect(newMultipleValue).toStrictEqual(["bold", "strikethrough"]);

		await user.click(groupSingleItemRight);
		expect(newSingleValue).toBe("right");
	});

	it("should respect binding to the `value` prop", async () => {
		const { user, groupMultipleItemItalic, groupSingleItemCenter, styleBinding, alignBinding } =
			setup();
		expect(styleBinding).toHaveTextContent("bold");
		expect(alignBinding).toHaveTextContent("");
		expect(groupMultipleItemItalic).toHaveAttribute("data-state", "off");
		expect(groupMultipleItemItalic).toHaveAttribute("aria-pressed", "false");
		expect(groupSingleItemCenter).toHaveAttribute("data-state", "off");
		expect(groupSingleItemCenter).toHaveAttribute("aria-checked", "false");

		await user.click(styleBinding);
		expect(styleBinding).toHaveTextContent("italic");
		expect(groupMultipleItemItalic).toHaveAttribute("data-state", "on");
		expect(groupMultipleItemItalic).toHaveAttribute("aria-pressed", "true");

		await user.click(alignBinding);
		expect(alignBinding).toHaveTextContent("center");
		expect(groupSingleItemCenter).toHaveAttribute("data-state", "on");
		expect(groupSingleItemCenter).toHaveAttribute("aria-checked", "true");
	});

	it.each(["link", "button"])(
		"should forward click event when the %s is clicked",
		async (kind) => {
			const { user, clickedBinding, [kind as keyof ReturnType<typeof setup>]: el } = setup();

			expect(clickedBinding).toHaveTextContent("");
			await user.click(el as Element);
			expect(clickedBinding).toHaveTextContent(kind);
		}
	);

	it.each([kbd.ENTER, kbd.SPACE])(
		"should forward click event when the %s key is pressed",
		async (key) => {
			const { user, button, clickedBinding } = setup();

			button.focus();
			expect(clickedBinding).toHaveTextContent("");
			await user.keyboard(key);
			expect(clickedBinding).toHaveTextContent("button");
		}
	);
});
