import { type Matcher, type MatcherOptions, fireEvent } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A wrapper around the internal kbd object to make it easier to use in tests
 * which require the key names to be wrapped in curly braces.
 */
export type KbdKeys = keyof typeof kbd;

export const kbd = {
	ALT: "Alt",
	ARROW_DOWN: "ArrowDown",
	ARROW_LEFT: "ArrowLeft",
	ARROW_RIGHT: "ArrowRight",
	ARROW_UP: "ArrowUp",
	BACKSPACE: "Backspace",
	CAPS_LOCK: "CapsLock",
	CONTROL: "Control",
	DELETE: "Delete",
	END: "End",
	ENTER: "Enter",
	ESCAPE: "Escape",
	F1: "F1",
	F10: "F10",
	F11: "F11",
	F12: "F12",
	F2: "F2",
	F3: "F3",
	F4: "F4",
	F5: "F5",
	F6: "F6",
	F7: "F7",
	F8: "F8",
	F9: "F9",
	HOME: "Home",
	META: "Meta",
	PAGE_DOWN: "PageDown",
	PAGE_UP: "PageUp",
	SHIFT: "Shift",
	SPACE: " ",
	TAB: "Tab",
	CTRL: "Control",
	ASTERISK: "*",
	a: "a",
	P: "P",
	A: "A",
	p: "p",
	n: "n",
	j: "j",
	k: "k",
};

export function getTestKbd() {
	const initTestKbd: Record<KbdKeys, string> = Object.entries(kbd).reduce(
		(acc, [key, value]) => {
			acc[key as KbdKeys] = `{${value}}`;
			return acc;
		},
		{} as Record<KbdKeys, string>
	);

	return {
		...initTestKbd,
		SHIFT_TAB: `{Shift>}{${kbd.TAB}}`,
	};
}

export type queryByTestId = (
	id: Matcher,
	options?: MatcherOptions | undefined
) => HTMLElement | null;

type CustomUserEvents = typeof userEvent & {
	pointerDownUp: (target: HTMLElement | null) => Promise<void>;
};

export function setupUserEvents(): CustomUserEvents {
	const user = userEvent.setup({ pointerEventsCheck: 0, delay: null });
	const originalClick = user.click;
	const originalKeyboard = user.keyboard;
	const originalPointer = user.pointer;

	const click = async (element: HTMLElement) => {
		await originalClick(element);
		await sleep(20);
	};

	const keyboard = async (keys: string) => {
		await originalKeyboard(keys);
		await sleep(20);
	};

	const pointer: typeof originalPointer = async (input) => {
		await originalPointer(input);
		await sleep(20);
	};

	const pointerDownUp = async (target: HTMLElement | null) => {
		if (!target) return;
		await fireEvent.pointerDown(target);
		await fireEvent.pointerUp(target);
		await fireEvent.click(target);
		await sleep(20);
	};

	Object.assign(user, { click, keyboard, pointer, pointerDownUp });

	return user as unknown as CustomUserEvents;
}

export async function fireFocus(node: HTMLElement) {
	node.focus();
	await sleep(20);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFn = (...args: any[]) => any;
