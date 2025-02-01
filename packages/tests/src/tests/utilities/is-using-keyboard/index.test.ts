import { render } from "@testing-library/svelte/svelte5";
import { getTestKbd, setupUserEvents } from "../../utils";
import { vi } from "vitest";
import IsUsingKeyboardTest from "./is-using-keyboard-test.svelte";

const kbd = getTestKbd();

describe("IsUsingKeyboard", () => {
	function setup() {
		const mounted = render(IsUsingKeyboardTest);
		const user = setupUserEvents();
		const isUsingKeyboard = mounted.component.isUsingKeyboard;

		return {
			...mounted,
			user,
			isUsingKeyboard,
		};
	}

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should detect keyboard usage", async () => {
		const { user, isUsingKeyboard } = setup();

		expect(isUsingKeyboard.current).toBe(false);

		user.keyboard(kbd.SPACE);
		expect(isUsingKeyboard.current).toBe(false);
	});

	it("should detect pointer usage (down)", async () => {
		const { user, isUsingKeyboard } = setup();

		await user.keyboard(kbd.SPACE);
		expect(isUsingKeyboard.current).toBe(true);

		await user.pointerDownUp(document.body);
		expect(isUsingKeyboard.current).toBe(false);
	});

	it("should detect pointer usage (move)", async () => {
		const { user, isUsingKeyboard } = setup();

		await user.keyboard(kbd.SPACE);
		expect(isUsingKeyboard.current).toBe(true);

		await user.pointer([
			{
				coords: { x: 0, y: 0 },
			},
			{
				coords: { x: 100, y: 100 },
			},
		]);

		expect(isUsingKeyboard.current).toBe(false);
	});

	it("should detect keyboard usage after pointer usage", async () => {
		const { user, isUsingKeyboard } = setup();

		await user.pointerDownUp(document.body);
		expect(isUsingKeyboard.current).toBe(false);

		await user.keyboard(kbd.SPACE);
		expect(isUsingKeyboard.current).toBe(true);
	});

	it("should set up only once", async () => {
		const addEventListener = vi.spyOn(document, "addEventListener");
		const removeEventListener = vi.spyOn(document, "removeEventListener");

		expect(addEventListener).toHaveBeenCalledTimes(0);
		expect(removeEventListener).toHaveBeenCalledTimes(0);

		// Mount component multiple times.
		const handles = [setup(), setup(), setup()];

		handles.forEach(({ isUsingKeyboard }) => {
			expect(isUsingKeyboard.current).toBe(false);
		});

		await handles[0].user.keyboard(kbd.SPACE);

		handles.forEach(({ isUsingKeyboard }) => {
			expect(isUsingKeyboard.current).toBe(true);
		});

		// All three listeners should have been set up only once.
		expect(addEventListener).toHaveBeenCalledTimes(3);
		expect(removeEventListener).toHaveBeenCalledTimes(0);

		// Unmount all components.
		handles.forEach(({ unmount }) => {
			unmount();
		});

		// All listeners should have been removed.
		expect(addEventListener).toHaveBeenCalledTimes(3);
		expect(removeEventListener).toHaveBeenCalledTimes(3);
	});
});
