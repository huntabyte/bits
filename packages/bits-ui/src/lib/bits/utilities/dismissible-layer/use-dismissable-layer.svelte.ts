import { untrack } from "svelte";
import {
	type ReadableBox,
	type WritableBox,
	afterSleep,
	afterTick,
	box,
	executeCallbacks,
	onDestroyEffect,
	useRefById,
} from "svelte-toolbelt";
import { watch } from "runed";
import { on } from "svelte/events";
import type { DismissibleLayerImplProps, InteractOutsideBehaviorType } from "./types.js";
import { type EventCallback, addEventListener } from "$lib/internal/events.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import { debounce } from "$lib/internal/debounce.js";
import { noop } from "$lib/internal/noop.js";
import { getOwnerDocument, isOrContainsTarget } from "$lib/internal/elements.js";
import { isElement } from "$lib/internal/is.js";

globalThis.bitsDismissableLayers ??= new Map<
	DismissibleLayerState,
	ReadableBox<InteractOutsideBehaviorType>
>();

type DismissibleLayerStateProps = ReadableBoxedValues<
	Required<Omit<DismissibleLayerImplProps, "children">>
>;

export class DismissibleLayerState {
	#interactOutsideProp: ReadableBox<EventCallback<PointerEvent>>;
	#behaviorType: ReadableBox<InteractOutsideBehaviorType>;
	#interceptedEvents: Record<string, boolean> = {
		pointerdown: false,
	};
	#isResponsibleLayer = false;
	node: WritableBox<HTMLElement | null> = box(null);
	#documentObj = undefined as unknown as Document;
	#enabled: ReadableBox<boolean>;
	#isFocusInsideDOMTree = $state(false);
	#onFocusOutside: DismissibleLayerStateProps["onFocusOutside"];
	currNode = $state<HTMLElement | null>(null);
	#isValidEventProp: DismissibleLayerStateProps["isValidEvent"];
	#unsubClickListener = noop;

	constructor(props: DismissibleLayerStateProps) {
		this.#enabled = props.enabled;
		this.#isValidEventProp = props.isValidEvent;

		useRefById({
			id: props.id,
			ref: this.node,
			deps: () => this.#enabled.current,
			onRefChange: (node) => {
				this.currNode = node;
			},
		});

		this.#behaviorType = props.interactOutsideBehavior;
		this.#interactOutsideProp = props.onInteractOutside;
		this.#onFocusOutside = props.onFocusOutside;

		$effect(() => {
			this.#documentObj = getOwnerDocument(this.currNode);
		});

		let unsubEvents = noop;

		const cleanup = () => {
			this.#resetState();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			unsubEvents();
		};

		watch([() => this.#enabled.current, () => this.currNode], ([enabled, currNode]) => {
			if (!enabled || !currNode) return;
			afterSleep(1, () => {
				if (!this.currNode) return;
				globalThis.bitsDismissableLayers.set(
					this,
					untrack(() => this.#behaviorType)
				);

				unsubEvents();
				unsubEvents = this.#addEventListeners();
			});
			return cleanup;
		});

		onDestroyEffect(() => {
			this.#resetState.destroy();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			this.#unsubClickListener();
			unsubEvents();
		});
	}

	#handleFocus = (event: FocusEvent) => {
		if (event.defaultPrevented) return;
		if (!this.currNode) return;
		afterTick(() => {
			if (!this.currNode || this.#isTargetWithinLayer(event.target as HTMLElement)) return;

			if (event.target && !this.#isFocusInsideDOMTree) {
				this.#onFocusOutside.current?.(event);
			}
		});
	};

	#addEventListeners() {
		return executeCallbacks(
			/**
			 * CAPTURE INTERACTION START
			 * mark interaction-start event as intercepted.
			 * mark responsible layer during interaction start
			 * to avoid checking if is responsible layer during interaction end
			 * when a new floating element may have been opened.
			 */
			on(
				this.#documentObj,
				"pointerdown",
				executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer),
				{ capture: true }
			),

			/**
			 * BUBBLE INTERACTION START
			 * Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
			 * to avoid prematurely checking if other events were intercepted.
			 */
			on(
				this.#documentObj,
				"pointerdown",
				executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)
			),

			/**
			 * HANDLE FOCUS OUTSIDE
			 */
			on(this.#documentObj, "focusin", this.#handleFocus)
		);
	}

	#handleDismiss = (e: PointerEvent) => {
		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(e);
		}
		this.#interactOutsideProp.current(e as PointerEvent);
	};

	#handleInteractOutside = debounce((e: PointerEvent) => {
		if (!this.currNode) {
			this.#unsubClickListener();
			return;
		}
		const isEventValid =
			this.#isValidEventProp.current(e, this.currNode) || isValidEvent(e, this.currNode);

		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
			this.#unsubClickListener();
			return;
		}

		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(event);
		}

		if (
			this.#behaviorType.current !== "close" &&
			this.#behaviorType.current !== "defer-otherwise-close"
		) {
			this.#unsubClickListener();
			return;
		}

		if (e.pointerType === "touch") {
			this.#unsubClickListener();

			// @ts-expect-error - later
			this.#unsubClickListener = addEventListener(
				this.#documentObj,
				"click",
				this.#handleDismiss,
				{ once: true }
			);
		} else {
			this.#interactOutsideProp.current(event);
		}
	}, 10);

	#markInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = true;
	};

	#markNonInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = false;
	};

	#markResponsibleLayer = () => {
		if (!this.node.current) return;
		this.#isResponsibleLayer = isResponsibleLayer(this.node.current);
	};

	#isTargetWithinLayer = (target: HTMLElement) => {
		if (!this.node.current) return false;
		return isOrContainsTarget(this.node.current, target);
	};

	#resetState = debounce(() => {
		for (const eventType in this.#interceptedEvents) {
			this.#interceptedEvents[eventType] = false;
		}
		this.#isResponsibleLayer = false;
	}, 20);

	#isAnyEventIntercepted() {
		const i = Object.values(this.#interceptedEvents).some(Boolean);
		return i;
	}

	#onfocuscapture = () => {
		this.#isFocusInsideDOMTree = true;
	};

	#onblurcapture = () => {
		this.#isFocusInsideDOMTree = false;
	};

	props = {
		onfocuscapture: this.#onfocuscapture,
		onblurcapture: this.#onblurcapture,
	};
}

export function useDismissibleLayer(props: DismissibleLayerStateProps) {
	return new DismissibleLayerState(props);
}

function getTopMostLayer(
	layersArr: [DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>][]
) {
	return layersArr.findLast(
		([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore"
	);
}

function isResponsibleLayer(node: HTMLElement): boolean {
	const layersArr = [...globalThis.bitsDismissableLayers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the outside interaction. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = getTopMostLayer(layersArr);
	if (topMostLayer) return topMostLayer[0].node.current === node;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode.node.current === node;
}

function isValidEvent(e: PointerEvent, node: HTMLElement): boolean {
	if ("button" in e && e.button > 0) return false;
	const target = e.target;
	if (!isElement(target)) return false;
	const ownerDocument = getOwnerDocument(target);
	const isValid =
		ownerDocument.documentElement.contains(target) && !isOrContainsTarget(node, target);
	return isValid;
}

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

function createWrappedEvent(e: PointerEvent | MouseEvent): PointerEvent {
	const capturedCurrentTarget = e.currentTarget;
	const capturedTarget = e.target;

	let newEvent: PointerEvent;

	if (e instanceof PointerEvent) {
		newEvent = new PointerEvent(e.type, e);
	} else {
		newEvent = new PointerEvent("pointerdown", e);
	}

	// track the prevented state separately
	let isPrevented = false;

	// Create a proxy to intercept property access and method calls
	const wrappedEvent = new Proxy(newEvent, {
		get: (target, prop) => {
			if (prop === "currentTarget") {
				return capturedCurrentTarget;
			}
			if (prop === "target") {
				return capturedTarget;
			}
			if (prop === "preventDefault") {
				return () => {
					isPrevented = true;
					if (typeof target.preventDefault === "function") {
						target.preventDefault();
					}
				};
			}
			if (prop === "defaultPrevented") {
				return isPrevented;
			}
			if (prop in target) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return (target as any)[prop];
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (e as any)[prop];
		},
	});

	return wrappedEvent as PointerEvent;
}
