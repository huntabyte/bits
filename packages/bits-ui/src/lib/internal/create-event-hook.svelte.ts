import { executeCallbacks } from "svelte-toolbelt";

// https://stackoverflow.com/questions/55541275/typescript-check-for-the-any-type
export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
/**
 * will return `true` if `T` is `any`, or `false` otherwise
 */
export type IsAny<T> = IfAny<T, true, false>;

// any extends void = true
// so we need to check if T is any first
type Callback<T> =
	IsAny<T> extends true
		? // eslint-disable-next-line @typescript-eslint/no-explicit-any
			(param: any) => void
		: [T] extends [void]
			? () => void
			: (param: T) => void;

export type EventHookOn<T = unknown> = (fn: Callback<T>) => { off: () => void };
export type EventHookOff<T = unknown> = (fn: Callback<T>) => void;
export type EventHookTrigger<T = unknown> = (param?: T) => Promise<unknown[]>;

export interface EventHook<T = unknown> {
	on: EventHookOn<T>;
	off: EventHookOff<T>;
	trigger: EventHookTrigger<T>;
}

export function createEventHook<T = unknown>(): EventHook<T> {
	const callbacks: Set<Callback<T>> = new Set();
	const callbacksToDispose: Callback<T>[] = [];

	function off(cb: Callback<T>) {
		callbacks.delete(cb);
	}

	function on(cb: Callback<T>) {
		callbacks.add(cb);
		const offFn = () => off(cb);
		callbacksToDispose.push(offFn);
		return { off: offFn };
	}

	const trigger: EventHookTrigger<T> = (...args) => {
		return Promise.all(
			Array.from(callbacks).map((cb) => {
				return Promise.resolve(cb(...(args as [T])));
			})
		);
	};

	$effect(() => {
		return () => {
			executeCallbacks(callbacksToDispose);
		};
	});

	return {
		on,
		off,
		trigger,
	};
}
