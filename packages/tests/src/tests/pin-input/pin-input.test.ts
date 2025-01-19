import { render, waitFor } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it, vi } from "vitest";
import { type PinInput, REGEXP_ONLY_DIGITS } from "bits-ui";
import { getTestKbd, setupUserEvents } from "../utils.js";
import PinInputTest from "./pin-input-test.svelte";

const kbd = getTestKbd();

function setup(props: Partial<PinInput.RootProps> = {}) {
	const user = setupUserEvents();
	// @ts-expect-error - testing lib needs to update their generic types
	const returned = render(PinInputTest, { ...props });
	const cell0 = returned.getByTestId("cell-0");
	const cell1 = returned.getByTestId("cell-1");
	const cell2 = returned.getByTestId("cell-2");
	const cell3 = returned.getByTestId("cell-3");
	const cell4 = returned.getByTestId("cell-4");
	const cell5 = returned.getByTestId("cell-5");
	const cells = [cell0, cell1, cell2, cell3, cell4, cell5];
	const binding = returned.getByTestId("binding");
	const hiddenInput = returned.getByTestId("input");
	return {
		user,
		cells,
		binding,
		hiddenInput,
		...returned,
	};
}

describe("pin Input", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(PinInputTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should sync the `name` prop to the hidden input", async () => {
		const { hiddenInput } = setup({ name: "test" });
		expect(hiddenInput).toHaveAttribute("name", "test");
	});

	it("should sync the `value` prop to the hidden input", async () => {
		const value = "123456";
		const { hiddenInput } = setup({ value });
		expect(hiddenInput).toHaveValue(value);
	});

	it("should sync the `disabled` prop to the hidden input", async () => {
		const { hiddenInput } = setup({ disabled: true });
		await waitFor(() => expect(hiddenInput).toHaveAttribute("disabled", ""));
	});

	it("should respect binding to the `value` prop", async () => {
		const initialValue = "123456";
		const { hiddenInput, binding, user } = setup({
			value: initialValue,
		});
		expect(hiddenInput).toHaveValue(initialValue);
		expect(binding).toHaveTextContent(initialValue);
		await user.click(binding);
		expect(hiddenInput).toHaveValue("999999");
		expect(binding).toHaveTextContent("999999");
	});

	it("should set the appropriate `isActive` prop on each cell", async () => {
		const { user, hiddenInput, cells } = setup();

		await user.click(hiddenInput);
		expect(cells[0]).toHaveAttribute("data-active");
		await user.keyboard("1");
		expect(cells[0]).not.toHaveAttribute("data-active");
		expect(cells[1]).toHaveAttribute("data-active");
		await user.keyboard("2");
		expect(cells[1]).not.toHaveAttribute("data-active");
		expect(cells[2]).toHaveAttribute("data-active");
		await user.keyboard("3");
		expect(cells[2]).not.toHaveAttribute("data-active");
		expect(cells[3]).toHaveAttribute("data-active");
		await user.keyboard("4");
		expect(cells[3]).not.toHaveAttribute("data-active");
		expect(cells[4]).toHaveAttribute("data-active");
		await user.keyboard("5");
		expect(cells[4]).not.toHaveAttribute("data-active");
		expect(cells[5]).toHaveAttribute("data-active");
		await user.keyboard("6");
		expect(cells[5]).not.toHaveAttribute("data-active");
		expect(cells[5]).toHaveTextContent("6");
	});

	it("should handle backspace appropriately", async () => {
		const { user, hiddenInput, cells } = setup();

		await user.click(hiddenInput);
		await user.keyboard("1");
		await user.keyboard("2");
		await user.keyboard("3");
		await user.keyboard(kbd.BACKSPACE);
		expect(cells[2]).toHaveTextContent("");
		expect(cells[2]).toHaveAttribute("data-active");
		await user.keyboard(kbd.BACKSPACE);
		expect(cells[1]).toHaveTextContent("");
		expect(cells[1]).toHaveAttribute("data-active");
		expect(cells[2]).not.toHaveAttribute("data-active");
	});

	it("should fire the `onComplete` callback when the input is complete", async () => {
		const mockComplete = vi.fn();
		const { user, hiddenInput } = setup({
			onComplete: mockComplete,
		});

		await user.click(hiddenInput);
		const keys = ["1", "2", "3", "4", "5", "6"];
		for (const key of keys) {
			await user.keyboard(key);
		}
		expect(mockComplete).toHaveBeenCalledTimes(1);
		for (const _key of keys) {
			await user.keyboard(kbd.BACKSPACE);
		}

		for (const key of keys) {
			await user.keyboard(key);
		}
		expect(mockComplete).toHaveBeenCalledTimes(2);
	});

	it("should handle paste events correctly", async () => {
		const mockComplete = vi.fn();
		const { user, hiddenInput } = setup({
			onComplete: mockComplete,
		});

		await user.click(hiddenInput);
		await user.paste("123456");

		expect(mockComplete).toHaveBeenCalledTimes(1);
		expect(mockComplete).toHaveBeenCalledWith("123456");
	});

	it("should allow the user to sanitize pasted text (remove hyphens, etc.)", async () => {
		const mockComplete = vi.fn();
		const { user, hiddenInput } = setup({
			onComplete: mockComplete,
			onPaste: (text) => text.replace(/-/g, ""),
		});

		await user.click(hiddenInput);
		await user.paste("123-456");

		expect(mockComplete).toHaveBeenCalledTimes(1);
		expect(mockComplete).toHaveBeenCalledWith("123456");
	});

	it("should ignore keys that do not match the pattern", async () => {
		const { user, hiddenInput } = setup({
			pattern: REGEXP_ONLY_DIGITS,
		});

		await user.click(hiddenInput);
		await user.keyboard("123");
		expect(hiddenInput).toHaveValue("123");

		await user.keyboard(kbd.BACKSPACE);
		await user.keyboard(kbd.BACKSPACE);
		await user.keyboard(kbd.BACKSPACE);
		expect(hiddenInput).toHaveValue("");
		await user.keyboard("$");
		expect(hiddenInput).toHaveValue("");
		await user.keyboard("1$");
		expect(hiddenInput).toHaveValue("1");
	});
});
