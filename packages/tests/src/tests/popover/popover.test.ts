import { render, waitFor } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it, vi } from "vitest";
import type { Component } from "svelte";
import { getTestKbd, setupUserEvents } from "../utils.js";
import PopoverTest, { type PopoverTestProps } from "./popover-test.svelte";
import PopoverForceMountTest, {
	type PopoverForceMountTestProps,
} from "./popover-force-mount-test.svelte";

const kbd = getTestKbd();

function setup(
	props: PopoverTestProps | PopoverForceMountTestProps = {},
	component: Component = PopoverTest
) {
	const user = setupUserEvents();

	const returned = render(component, { ...props });
	const { getByTestId, queryByTestId } = returned;
	const trigger = getByTestId("trigger");
	function getContent() {
		return queryByTestId("content");
	}
	return { trigger, user, getContent, ...returned };
}

async function open(props: PopoverTestProps = {}, openWith: "click" | (string & {}) = "click") {
	const { trigger, getByTestId, queryByTestId, user, getContent, ...returned } = setup(props);
	expect(getContent()).toBeNull();
	if (openWith === "click") {
		await user.pointerDownUp(trigger);
	} else {
		trigger.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(getContent()).not.toBeNull());
	const content = getByTestId("content");
	return { trigger, getByTestId, queryByTestId, user, content, getContent, ...returned };
}

describe("popover", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(PopoverTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "content", "close", "arrow"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-popover-${part}`);
		}
	});

	it("should open on click", async () => {
		await open();
	});

	it("should open on enter", async () => {
		await open({}, kbd.ENTER);
	});

	it("should open on space", async () => {
		await open({}, kbd.SPACE);
	});

	it("should close on escape keydown by default", async () => {
		const { user, getContent } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).toBeNull();
	});

	it("should close on outside click by default", async () => {
		const mockFn = vi.fn();
		const { user, getByTestId } = await open({
			contentProps: {
				onInteractOutside: mockFn,
			},
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	it("should close when the close button is clicked", async () => {
		const { user, getContent, getByTestId } = await open();
		const close = getByTestId("close");
		await user.pointerDownUp(close);
		expect(getContent()).toBeNull();
	});

	it("should portal to the body by default", async () => {
		const { content } = await open();
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const { content, getByTestId } = await open({ portalProps: { to: "#portal-target" } });
		const portalTarget = getByTestId("portal-target");
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed to the portal ", async () => {
		const { content, getByTestId } = await open({
			portalProps: {
				disabled: true,
			},
		});
		const main = getByTestId("main");
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(main);
	});

	it("should allow ignoring the escapeKeydownBehavior ", async () => {
		const { user, getContent } = await open({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});
		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).not.toBeNull();
	});

	it("should allow cancelling the `onEscapeKeydown` event", async () => {
		let preventedCount = 0;
		const { user, getContent } = await open({
			contentProps: {
				escapeKeydownBehavior: "close",
				onEscapeKeydown: (e) => {
					if (preventedCount > 0) return;
					e.preventDefault();
					preventedCount++;
				},
			},
		});
		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).not.toBeNull();
		await user.keyboard(kbd.ESCAPE);
		expect(getContent()).toBeNull();
	});

	it("should allow ignoring the interactOutsideBehavior", async () => {
		const { user, getContent, getByTestId } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const outside = getByTestId("outside");
		await user.pointerDownUp(outside);
		expect(getContent()).not.toBeNull();
	});

	it("should allow binding the `open` prop", async () => {
		const { getContent, getByTestId, user } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("true");
		await user.click(binding);
		expect(binding).toHaveTextContent("false");
		expect(getContent()).toBeNull();
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		expect(getContent()).not.toBeNull();
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const { getByTestId } = setup({}, PopoverForceMountTest);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const { queryByTestId, getByTestId, user, trigger } = setup(
			{ withOpenCheck: true },
			PopoverForceMountTest
		);
		expect(queryByTestId("content")).toBeNull();
		await user.pointerDownUp(trigger);
		const content = getByTestId("content");
		expect(content).toBeVisible();
	});
});
