import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import AvatarTest from "./AvatarTest.svelte";

const src = "https://github.com/huntabyte.png";

describe("avatar", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(AvatarTest, { src });
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = render(AvatarTest);
		const root = getByTestId("root");
		const image = getByTestId("image");
		const fallback = getByTestId("fallback");
		expect(root).toHaveAttribute("data-avatar-root");
		expect(image).toHaveAttribute("data-avatar-image");
		expect(fallback).toHaveAttribute("data-avatar-fallback");
	});

	it("should render the image with the correct src", async () => {
		const { getByAltText } = render(AvatarTest, { src });
		const avatar = getByAltText("huntabyte");
		expect(avatar).toHaveAttribute("src", "https://github.com/huntabyte.png");
	});

	it("should render the fallback when an invalid image src is provided", async () => {
		const { getByAltText, getByText } = render(AvatarTest, { src: "invalid" });
		const avatar = getByAltText("huntabyte");
		expect(avatar).not.toBeVisible();
		const fallback = getByText("HJ");
		expect(fallback).toBeVisible();
	});

	it("should remove the avatar when the src is removed", async () => {
		const user = userEvent.setup();
		const { getByAltText, getByTestId, getByText } = render(AvatarTest, { src });
		const avatar = getByAltText("huntabyte");
		expect(avatar).toHaveAttribute("src", "https://github.com/huntabyte.png");
		const clearButton = getByTestId("clear-button");
		await user.click(clearButton);
		expect(avatar).not.toBeVisible();
		expect(getByText("HJ")).toBeVisible();
	});
});
