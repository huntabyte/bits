import {
	type ReadableBox,
	box,
	composeHandlers,
	executeCallbacks,
	useRefById,
} from "svelte-toolbelt";
import { watch } from "runed";
import { on } from "svelte/events";
import type { TextSelectionLayerImplProps } from "./types.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { EventCallback } from "$lib/internal/events.js";
import { noop } from "$lib/internal/noop.js";
import { isHTMLElement } from "$lib/internal/is.js";
import { isOrContainsTarget } from "$lib/internal/elements.js";

type StateProps = ReadableBoxedValues<Required<Omit<TextSelectionLayerImplProps, "children">>>;

globalThis.bitsTextSelectionLayers ??= new Map<TextSelectionLayerState, ReadableBox<boolean>>();

export class TextSelectionLayerState {
	#id: StateProps["id"];
	#onPointerDownProp: ReadableBox<EventCallback<PointerEvent>>;
	#onPointerUpProp: ReadableBox<EventCallback<PointerEvent>>;
	#enabled: ReadableBox<boolean>;
	#unsubSelectionLock = noop;
	#ref = box<HTMLElement | null>(null);

	constructor(props: StateProps) {
		this.#id = props.id;
		this.#enabled = props.preventOverflowTextSelection;
		this.#onPointerDownProp = props.onPointerDown;
		this.#onPointerUpProp = props.onPointerUp;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.#enabled.current,
		});

		let unsubEvents = noop;

		watch(
			() => this.#enabled.current,
			(isEnabled) => {
				if (isEnabled) {
					globalThis.bitsTextSelectionLayers.set(this, this.#enabled);
					unsubEvents();
					unsubEvents = this.#addEventListeners();
				}
				return () => {
					unsubEvents();
					this.#resetSelectionLock();
					globalThis.bitsTextSelectionLayers.delete(this);
				};
			}
		);
	}

	#addEventListeners() {
		return executeCallbacks(
			on(document, "pointerdown", this.#pointerdown),
			on(
				document,
				"pointerup",
				composeHandlers(this.#resetSelectionLock, this.#onPointerUpProp)
			)
		);
	}

	#pointerdown = (e: PointerEvent) => {
		const node = this.#ref.current;
		const target = e.target;
		if (!isHTMLElement(node) || !isHTMLElement(target) || !this.#enabled.current) return;
		/**
		 * We only lock user-selection overflow if layer is the top most layer and
		 * pointerdown occurred inside the node. You are still allowed to select text
		 * outside the node provided pointerdown occurs outside the node.
		 */
		if (!isHighestLayer(this) || !isOrContainsTarget(node, target)) return;
		this.#onPointerDownProp.current(e);
		if (e.defaultPrevented) return;
		this.#unsubSelectionLock = preventTextSelectionOverflow(node);
	};

	#resetSelectionLock = () => {
		this.#unsubSelectionLock();
		this.#unsubSelectionLock = noop;
	};
}

export function useTextSelectionLayer(props: StateProps) {
	return new TextSelectionLayerState(props);
}

const getUserSelect = (node: HTMLElement) => node.style.userSelect || node.style.webkitUserSelect;

function preventTextSelectionOverflow(node: HTMLElement) {
	const body = document.body;
	const originalBodyUserSelect = getUserSelect(body);
	const originalNodeUserSelect = getUserSelect(node);
	setUserSelect(body, "none");
	setUserSelect(node, "text");
	return () => {
		setUserSelect(body, originalBodyUserSelect);
		setUserSelect(node, originalNodeUserSelect);
	};
}

function setUserSelect(node: HTMLElement, value: string) {
	node.style.userSelect = value;
	node.style.webkitUserSelect = value;
}

function isHighestLayer(instance: TextSelectionLayerState) {
	const layersArr = [...globalThis.bitsTextSelectionLayers];
	if (!layersArr.length) return false;
	const highestLayer = layersArr.at(-1);
	if (!highestLayer) return false;
	return highestLayer[0] === instance;
}
