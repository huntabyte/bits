import {
	type Matcher,
	type MatcherOptions,
	render,
	screen,
	waitFor,
} from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { tick } from "svelte";
import { getTestKbd, setupUserEvents, sleep } from "../utils.js";
import DialogTest, { type DialogTestProps } from "./dialog-test.svelte";

const kbd = getTestKbd();

function expectIsClosed(
	queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null
) {
	const content = queryByTestId("content");
	expect(content).toBeNull();
}

async function expectIsOpen(
	queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null
) {
	const content = queryByTestId("content");
	await waitFor(() => expect(content).not.toBeNull());
}

function setup(props: DialogTestProps = {}) {
	const user = setupUserEvents();
	const returned = render(DialogTest, { ...props });
	const trigger = returned.getByTestId("trigger");

	return {
		...returned,
		trigger,
		user,
	};
}

async function open(props: DialogTestProps = {}) {
	const { getByTestId, queryByTestId, user, trigger } = setup(props);
	const content = queryByTestId("content");
	expect(content).toBeNull();
	await user.pointerDownUp(trigger);
	await tick();
	const contentAfter = getByTestId("content");
	expect(contentAfter).not.toBeNull();
	return { getByTestId, queryByTestId, user };
}

describe("dialog", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(DialogTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "overlay", "close", "title", "description", "content"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-dialog-${part}`);
		}
	});

	it("should have expected data attributes", async () => {
		const { getByTestId } = await open();

		const overlay = getByTestId("overlay");
		expect(overlay).toHaveAttribute("data-state", "open");
		const content = getByTestId("content");
		expect(content).toHaveAttribute("data-state", "open");
	});

	it("should open when the trigger is clicked", async () => {
		await open();
	});

	it("should close when the close button is clicked", async () => {
		const { getByTestId, queryByTestId, user } = await open();
		const close = getByTestId("close");
		await user.click(close);
		expectIsClosed(queryByTestId);
	});

	it("should close when the `Escape` key is pressed", async () => {
		const { queryByTestId, user, getByTestId } = await open();

		await user.keyboard(kbd.ESCAPE);
		expectIsClosed(queryByTestId);
		expect(getByTestId("trigger")).toHaveFocus();
	});

	it("should close when the overlay is clicked", async () => {
		const { getByTestId, queryByTestId, user } = await open();
		await sleep(100);

		const overlay = getByTestId("overlay");
		await user.click(overlay);
		await sleep(25);

		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).toBeNull();
	});

	it("should portal to body when using portal element", async () => {
		await open();

		const content = screen.getByTestId("content");
		expect(content.parentElement).toEqual(document.body);
	});

	it("should not portal to body when portal is disabled", async () => {
		await open({
			portalProps: {
				disabled: true,
			},
		});
		const content = screen.getByTestId("content");
		expect(content.parentElement).not.toEqual(document.body);
	});

	it("should portal to the target if passed as a prop", async () => {
		await open({
			portalProps: {
				to: "#portalTarget",
			},
		});
		const portalTarget = screen.getByTestId("portalTarget");
		const content = screen.getByTestId("content");
		expect(content.parentElement).toEqual(portalTarget);
	});

	it("should focus first focusable item upon opening", async () => {
		const { getByTestId } = await open();
		const closeButton = getByTestId("close");
		expect(document.activeElement).toBe(closeButton);
	});

	it("should not close when content is clicked", async () => {
		const { user, getByTestId, queryByTestId } = await open();
		const content = getByTestId("content");
		await user.click(content);
		await expectIsOpen(queryByTestId);
	});

	it("should respect binding to the `open` prop", async () => {
		const { getByTestId, queryByTestId, user } = setup();

		const trigger = getByTestId("trigger");
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.pointerDownUp(trigger);
		expect(binding).toHaveTextContent("true");
		await user.keyboard(kbd.ESCAPE);
		expect(binding).toHaveTextContent("false");

		const toggle = getByTestId("toggle");
		expectIsClosed(queryByTestId);
		await user.pointerDownUp(toggle);
		await expectIsOpen(queryByTestId);
	});

	it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
		const { getByTestId, queryByTestId, user } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		await sleep(100);

		const overlay = getByTestId("overlay");
		await user.click(overlay);

		await expectIsOpen(queryByTestId);
	});

	it("should respect the the `escapeKeydownBehavior: 'ignore'` prop", async () => {
		const { user, getByTestId, queryByTestId } = await open({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});

		await user.keyboard(kbd.ESCAPE);
		await expectIsOpen(queryByTestId);
		expect(getByTestId("trigger")).not.toHaveFocus();
	});

	it("should apply the correct `aria-describedby` attribute to the `Dialog.Content` element", async () => {
		const { getByTestId } = await open();

		const content = getByTestId("content");
		const description = getByTestId("description");
		expect(content).toHaveAttribute("aria-describedby", description.id);
	});

	it("should apply a default `aria-level` attribute to the `Dialog.Title` element", async () => {
		const { getByTestId } = await open();

		const title = getByTestId("title");
		expect(title).toHaveAttribute("aria-level", "2");
	});

	it("should allow setting a custom level for the `Dialog.Title` element", async () => {
		const { getByTestId } = await open({
			titleProps: {
				level: 3,
			},
		});

		const title = getByTestId("title");
		expect(title).toHaveAttribute("aria-level", "3");
	});

	it("should keep the `aria-describedby` attribute in sync with the `Dialog.Description` id", async () => {
		const { getByTestId, user } = await open({
			descriptionProps: {
				id: "description-id",
			},
		});

		const content = getByTestId("content");
		const description = getByTestId("description");
		expect(description).toHaveAttribute("id", "description-id");
		expect(content).toHaveAttribute("aria-describedby", description.id);

		const updateIdButton = getByTestId("update-id");
		await user.click(updateIdButton);
		await user.click(updateIdButton);
		await tick();

		expect(description.id).not.toBe("description-id");
		expect(description.id).toBe("new-id");
		expect(content).toHaveAttribute("aria-describedby", description.id);
	});
});
