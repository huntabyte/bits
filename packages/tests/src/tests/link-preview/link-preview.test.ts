import { render, waitFor } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { describe, it, vi } from "vitest";
import type { Component } from "svelte";
import { getTestKbd, setupUserEvents } from "../utils.js";
import LinkPreviewTest, { type LinkPreviewTestProps } from "./link-preview-test.svelte";
import type { LinkPreviewForceMountTestProps } from "./link-preview-force-mount-test.svelte";
import LinkPreviewForceMountTest from "./link-preview-force-mount-test.svelte";

const kbd = getTestKbd();

function setup(
	props: LinkPreviewTestProps | LinkPreviewForceMountTestProps = {},
	component: Component = LinkPreviewTest
) {
	const user = setupUserEvents();
	const { getByTestId, queryByTestId } = render(component, { ...props });
	const trigger = getByTestId("trigger");
	return { trigger, getByTestId, queryByTestId, user };
}

async function open(props: LinkPreviewTestProps = {}) {
	const { trigger, getByTestId, queryByTestId, user } = setup(props);
	expect(queryByTestId("content")).toBeNull();
	user.hover(trigger);
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	return { trigger, getByTestId, queryByTestId, user, content };
}

describe("link preview", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(LinkPreviewTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "content"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-link-preview-${part}`);
		}
	});

	it("should open on hover", async () => {
		const { user, content } = await open();
		await user.click(content);
		expect(content).toBeVisible();
	});

	it("should close on escape keydown", async () => {
		const mockEsc = vi.fn();
		const { user, content, queryByTestId } = await open({
			contentProps: {
				onEscapeKeydown: mockEsc,
			},
		});
		await user.click(content);
		await user.keyboard(kbd.ESCAPE);
		expect(mockEsc).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
	});

	it.skip("closes when pointer moves outside the trigger and content", async () => {
		const { user, getByTestId, queryByTestId } = await open();
		const outside = getByTestId("outside");
		await user.hover(outside);
		await user.hover(outside);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
	});

	it("should portal to the body by default", async () => {
		const { content } = await open();
		expect(content.parentElement?.parentElement).toBe(document.body);
	});

	it("should portal to a custom element if specified", async () => {
		const { content, getByTestId } = await open({
			portalProps: {
				to: "#portal-target",
			},
		});
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement?.parentElement).toBe(portalTarget);
	});

	it("should not portal if `disabled` is passed as portal prop", async () => {
		const { content, getByTestId } = await open({ portalProps: { disabled: true } });
		const main = getByTestId("main");
		expect(content.parentElement?.parentElement).toBe(main);
	});

	it("should respect the `escapeKeydownBehavior` prop", async () => {
		const { content, user, queryByTestId } = await open({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});
		await user.click(content);
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("should respect the `interactOutsideBehavior` prop", async () => {
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
		expect(binding).toHaveTextContent("true");
		await user.click(binding);
		expect(binding).toHaveTextContent("false");
		expect(queryByTestId("content")).toBeNull();
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("should forceMount the content when `forceMount` is true", async () => {
		const { getByTestId } = setup({}, LinkPreviewForceMountTest);

		const content = getByTestId("content");
		expect(content).toBeVisible();
	});

	it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
		const { queryByTestId, getByTestId, user, trigger } = setup(
			{ withOpenCheck: true },
			LinkPreviewForceMountTest
		);
		expect(queryByTestId("content")).toBeNull();
		await user.hover(trigger);
		await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
		const content = getByTestId("content");
		expect(content).toBeVisible();
	});
});
