import { render, waitFor } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import type { Component } from "svelte";
import { getTestKbd, setupUserEvents, sleep } from "../utils.js";
import TooltipTest, { type TooltipTestProps } from "./tooltip-test.svelte";
import type { TooltipForceMountTestProps } from "./tooltip-force-mount-test.svelte";
import TooltipForceMountTest from "./tooltip-force-mount-test.svelte";

const kbd = getTestKbd();

function setup(
	props: Partial<TooltipTestProps | TooltipForceMountTestProps> = {},
	component: Component = TooltipTest
) {
	const user = setupUserEvents();
	const returned = render(component, { ...props });
	const trigger = returned.getByTestId("trigger");
	return { ...returned, trigger, user };
}

async function open(props: Partial<TooltipTestProps> = {}) {
	const returned = setup(props);
	expect(returned.queryByTestId("content")).toBeNull();
	await returned.user.hover(returned.trigger);
	await waitFor(() => expect(returned.queryByTestId("content")).not.toBeNull());
	const content = returned.getByTestId("content");
	return { ...returned, content };
}

describe("tooltip", () => {
	it("should have no accessibility violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "content"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-tooltip-${part}`);
		}
	});

	it("should use provider delay duration if provided and the tooltip.root did not provide one", async () => {
		const { trigger } = setup();
		expect(trigger).toHaveAttribute("data-delay-duration", "0");
	});

	it("should on hover", async () => {
		const { user, content } = await open();
		await user.click(content);
		expect(content).toBeVisible();
	});

	it("should close on escape keydown", async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it.skip("should close when pointer moves outside the trigger and content", async () => {
		const { user, getByTestId, queryByTestId, content } = await open();

		const outside = getByTestId("outside") as HTMLElement;

		await user.pointer([
			// touch the screen at element1
			{ keys: "[TouchA>]", target: content },
			// move the touch pointer to element2
			{ pointerName: "TouchA", target: outside },
			// release the touch pointer at the last position (element2)
			{ keys: "[/TouchA]" },
		]);
		await sleep(200);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
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

	it("should not portal if `disabled` is passed to the portal", async () => {
		const { content, getByTestId } = await open({ portalProps: { disabled: true } });
		const main = getByTestId("main");
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(main);
	});

	it("should allow ignoring escapeKeydownBehavior ", async () => {
		const { content, user, queryByTestId } = await open({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});
		await user.click(content);
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("should allow ignoring interactOutsideBehavior", async () => {
		const { content, user, queryByTestId, getByTestId } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		await user.click(content);
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("should respect binding the open prop", async () => {
		const { queryByTestId, getByTestId, user } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const binding = getByTestId("binding");
		await waitFor(() => expect(binding).toHaveTextContent("true"));
		await user.click(binding);
		await waitFor(() => expect(binding).toHaveTextContent("false"));
		expect(queryByTestId("content")).toBeNull();
		await user.click(binding);
		await waitFor(() => expect(binding).toHaveTextContent("true"));
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const { getByTestId } = setup({}, TooltipForceMountTest);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const { queryByTestId, getByTestId, user, trigger } = setup(
			{ withOpenCheck: true },
			TooltipForceMountTest
		);
		expect(queryByTestId("content")).toBeNull();
		await user.hover(trigger);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
		const content = getByTestId("content");
		expect(content).toBeVisible();
	});
});
