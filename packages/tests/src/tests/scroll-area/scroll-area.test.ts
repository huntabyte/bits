import { render } from "@testing-library/svelte/svelte5";
import { describe, it } from "vitest";
import { setupUserEvents } from "../utils.js";
import ScrollAreaTest from "./scroll-area-test.svelte";
import type { ScrollAreaTestProps } from "./scroll-area-test.svelte";

function setup(props?: ScrollAreaTestProps) {
	const user = setupUserEvents();
	const returned = render(ScrollAreaTest, props);
	const root = returned.getByTestId("root");
	const viewport = returned.getByTestId("viewport");

	function getScrollbarX() {
		return returned.queryByTestId("scrollbar-x");
	}

	function getScrollbarY() {
		return returned.queryByTestId("scrollbar-y");
	}

	function getThumbX() {
		return returned.queryByTestId("thumb-x");
	}

	function getThumbY() {
		return returned.queryByTestId("thumb-y");
	}

	function getCorner() {
		return returned.queryByTestId("corner");
	}

	return {
		...returned,
		root,
		viewport,
		user,
		getScrollbarX,
		getScrollbarY,
		getThumbX,
		getThumbY,
		getCorner,
	};
}

// need to determine how to test the scrollbars in vitest/testing-lib
describe.todo("scroll area", () => {
	it("renders the root and viewport elements", async () => {
		const { root, viewport } = setup();
		expect(root).toBeInTheDocument();
		expect(viewport).toBeInTheDocument();
	});
});
