import { Context, Previous, watch } from "runed";
import {
	afterTick,
	onDestroyEffect,
	srOnlyStyles,
	styleToString,
	useRefById,
} from "svelte-toolbelt";
import { on } from "svelte/events";
import { backward, forward, next, prev } from "$lib/internal/arrays.js";
import {
	getAriaExpanded,
	getAriaHidden,
	getDataDisabled,
	getDataOpenClosed,
	getDisabled,
	getRequired,
} from "$lib/internal/attrs.js";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import type {
	BitsEvent,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { noop } from "$lib/internal/noop.js";
import { type DOMTypeahead, useDOMTypeahead } from "$lib/internal/use-dom-typeahead.svelte.js";
import { type DataTypeahead, useDataTypeahead } from "$lib/internal/use-data-typeahead.svelte.js";

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

export const CONTENT_MARGIN = 10;

type SelectBaseRootStateProps = ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
	items: { value: string; label: string; disabled?: boolean }[];
	allowDeselect: boolean;
}> &
	WritableBoxedValues<{
		open: boolean;
	}> & {
		isCombobox: boolean;
	};

class SelectBaseRootState {
	disabled: SelectBaseRootStateProps["disabled"];
	required: SelectBaseRootStateProps["required"];
	name: SelectBaseRootStateProps["name"];
	loop: SelectBaseRootStateProps["loop"];
	open: SelectBaseRootStateProps["open"];
	scrollAlignment: SelectBaseRootStateProps["scrollAlignment"];
	items: SelectBaseRootStateProps["items"];
	allowDeselect: SelectBaseRootStateProps["allowDeselect"];
	touchedInput = $state(false);
	inputValue = $state<string>("");
	inputNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	valueId = $state("");
	highlightedNode = $state<HTMLElement | null>(null);
	highlightedValue = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-value");
	});
	highlightedId = $derived.by(() => {
		if (!this.highlightedNode) return undefined;
		return this.highlightedNode.id;
	});
	highlightedLabel = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-label");
	});
	isUsingKeyboard = $state(false);
	isCombobox = $state(false);
	bitsAttrs: SelectBitsAttrs;
	triggerPointerDownPos = $state.raw<{ x: number; y: number } | null>({ x: 0, y: 0 });

	constructor(props: SelectBaseRootStateProps) {
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.loop = props.loop;
		this.open = props.open;
		this.scrollAlignment = props.scrollAlignment;
		this.isCombobox = props.isCombobox;
		this.items = props.items;
		this.allowDeselect = props.allowDeselect;

		this.bitsAttrs = getSelectBitsAttrs(this);

		$effect.pre(() => {
			if (!this.open.current) {
				this.setHighlightedNode(null);
			}
		});
	}

	setHighlightedNode(node: HTMLElement | null) {
		this.highlightedNode = node;
		if (node) {
			if (this.isUsingKeyboard) {
				node.scrollIntoView({ block: "nearest" });
			}
		}
	}

	getCandidateNodes(): HTMLElement[] {
		const node = this.contentNode;
		if (!node) return [];
		const nodes = Array.from(
			node.querySelectorAll<HTMLElement>(`[${this.bitsAttrs.item}]:not([data-disabled])`)
		);
		return nodes;
	}

	setHighlightedToFirstCandidate() {
		this.setHighlightedNode(null);
		const candidateNodes = this.getCandidateNodes();
		if (!candidateNodes.length) return;
		this.setHighlightedNode(candidateNodes[0]!);
	}

	getNodeByValue(value: string): HTMLElement | null {
		const candidateNodes = this.getCandidateNodes();
		return candidateNodes.find((node) => node.dataset.value === value) ?? null;
	}

	setOpen(open: boolean) {
		this.open.current = open;
	}

	toggleOpen() {
		this.open.current = !this.open.current;
	}

	handleOpen() {
		this.setOpen(true);
	}

	handleClose() {
		this.setHighlightedNode(null);
		this.setOpen(false);
	}

	toggleMenu() {
		this.toggleOpen();
	}
}

type SelectSingleRootStateProps = SelectBaseRootStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class SelectSingleRootState extends SelectBaseRootState {
	value: SelectSingleRootStateProps["value"];
	isMulti = false as const;
	hasValue = $derived.by(() => this.value.current !== "");
	currentLabel = $derived.by(() => {
		if (!this.items.current.length) return "";
		const match = this.items.current.find((item) => item.value === this.value.current)?.label;
		return match ?? "";
	});
	candidateLabels: string[] = $derived.by(() => {
		if (!this.items.current.length) return [];
		const filteredItems = this.items.current.filter((item) => !item.disabled);
		return filteredItems.map((item) => item.label);
	});
	dataTypeaheadEnabled = $derived.by(() => {
		if (this.isMulti) return false;
		if (this.items.current.length === 0) return false;
		return true;
	});

	constructor(props: SelectSingleRootStateProps) {
		super(props);
		this.value = props.value;

		$effect(() => {
			if (!this.open.current && this.highlightedNode) {
				this.setHighlightedNode(null);
			}
		});

		watch(
			() => this.open.current,
			(isOpen) => {
				if (!isOpen) return;
				afterTick(() => {
					this.setInitialHighlightedNode();
				});
			}
		);
	}

	includesItem(itemValue: string) {
		return this.value.current === itemValue;
	}

	toggleItem(itemValue: string, itemLabel: string = itemValue) {
		this.value.current = this.includesItem(itemValue) ? "" : itemValue;
		this.inputValue = itemLabel;
	}

	setInitialHighlightedNode() {
		if (this.highlightedNode && document.contains(this.highlightedNode)) return;
		if (this.value.current !== "") {
			const node = this.getNodeByValue(this.value.current);
			if (node) {
				this.setHighlightedNode(node);
				return;
			}
		}
		// if no value is set, we want to highlight the first item
		const firstCandidate = this.getCandidateNodes()[0];
		if (!firstCandidate) return;
		this.setHighlightedNode(firstCandidate);
	}
}

type SelectMultipleRootStateProps = SelectBaseRootStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

class SelectMultipleRootState extends SelectBaseRootState {
	value: SelectMultipleRootStateProps["value"];
	isMulti = true as const;
	hasValue = $derived.by(() => this.value.current.length > 0);

	constructor(props: SelectMultipleRootStateProps) {
		super(props);
		this.value = props.value;

		watch(
			() => this.open.current,
			(isOpen) => {
				if (!isOpen) return;
				afterTick(() => {
					if (!this.highlightedNode) {
						this.setInitialHighlightedNode();
					}
				});
			}
		);
	}

	includesItem(itemValue: string) {
		return this.value.current.includes(itemValue);
	}

	toggleItem(itemValue: string, itemLabel: string = itemValue) {
		if (this.includesItem(itemValue)) {
			this.value.current = this.value.current.filter((v) => v !== itemValue);
		} else {
			this.value.current = [...this.value.current, itemValue];
		}
		this.inputValue = itemLabel;
	}

	setInitialHighlightedNode() {
		if (this.highlightedNode) return;
		if (this.value.current.length && this.value.current[0] !== "") {
			const node = this.getNodeByValue(this.value.current[0]!);
			if (node) {
				this.setHighlightedNode(node);
				return;
			}
		}
		// if no value is set, we want to highlight the first item
		const firstCandidate = this.getCandidateNodes()[0];
		if (!firstCandidate) return;
		this.setHighlightedNode(firstCandidate);
	}
}

type SelectRootState = SelectSingleRootState | SelectMultipleRootState;

type SelectInputStateProps = WithRefProps;

class SelectInputState {
	#id: SelectInputStateProps["id"];
	#ref: SelectInputStateProps["ref"];
	root: SelectRootState;

	constructor(props: SelectInputStateProps, root: SelectRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.inputNode = node;
			},
		});

		this.onkeydown = this.onkeydown.bind(this);
		this.oninput = this.oninput.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ESCAPE) return;
		const open = this.root.open.current;
		const inputValue = this.root.inputValue;

		// prevent arrow up/down from moving the position of the cursor in the input
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();
		if (!open) {
			if (INTERACTION_KEYS.includes(e.key)) return;
			if (e.key === kbd.TAB) return;
			if (e.key === kbd.BACKSPACE && inputValue === "") return;
			this.root.handleOpen();
			// we need to wait for a tick after the menu opens to ensure the highlighted nodes are
			// set correctly.
			afterTick(() => {
				if (this.root.hasValue) return;
				const candidateNodes = this.root.getCandidateNodes();
				if (!candidateNodes.length) return;

				if (e.key === kbd.ARROW_DOWN) {
					const firstCandidate = candidateNodes[0]!;
					this.root.setHighlightedNode(firstCandidate);
				} else if (e.key === kbd.ARROW_UP) {
					const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
					this.root.setHighlightedNode(lastCandidate);
				}
			});
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.handleClose();
			return;
		}

		if (e.key === kbd.ENTER && !e.isComposing) {
			e.preventDefault();
			const highlightedValue = this.root.highlightedValue;

			const isCurrentSelectedValue = highlightedValue === this.root.value.current;

			if (!this.root.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
				this.root.handleClose();
				return;
			}

			if (highlightedValue) {
				this.root.toggleItem(highlightedValue, this.root.highlightedLabel ?? undefined);
			}
			if (!this.root.isMulti && !isCurrentSelectedValue) {
				this.root.handleClose();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.handleClose();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode
				? candidateNodes.indexOf(currHighlightedNode)
				: -1;

			const loop = this.root.loop.current;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.ARROW_UP) {
				nextItem = prev(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.PAGE_DOWN) {
				nextItem = forward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.PAGE_UP) {
				nextItem = backward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.HOME) {
				nextItem = candidateNodes[0];
			} else if (e.key === kbd.END) {
				nextItem = candidateNodes[candidateNodes.length - 1];
			}
			if (!nextItem) return;
			this.root.setHighlightedNode(nextItem);
			return;
		}

		if (INTERACTION_KEYS.includes(e.key)) return;
		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
		// this.root.setHighlightedToFirstCandidate();
	}

	oninput(e: BitsEvent<Event, HTMLInputElement>) {
		this.root.inputValue = e.currentTarget.value;
		afterTick(() => {
			this.root.setHighlightedToFirstCandidate();
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "combobox",
				disabled: this.root.disabled.current ? true : undefined,
				"aria-activedescendant": this.root.highlightedId,
				"aria-autocomplete": "list",
				"aria-expanded": getAriaExpanded(this.root.open.current),
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				onkeydown: this.onkeydown,
				oninput: this.oninput,
				[this.root.bitsAttrs.input]: "",
			}) as const
	);
}

type SelectComboTriggerStateProps = WithRefProps;

class SelectComboTriggerState {
	#id: SelectComboTriggerStateProps["id"];
	#ref: SelectComboTriggerStateProps["ref"];
	root: SelectBaseRootState;

	constructor(props: SelectComboTriggerStateProps, root: SelectBaseRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			if (document.activeElement !== this.root.inputNode) {
				this.root.inputNode?.focus();
			}
			this.root.toggleMenu();
		}
	}

	/**
	 * `pointerdown` fires before the `focus` event, so we can prevent the default
	 * behavior of focusing the button and keep focus on the input.
	 */
	onpointerdown(e: BitsPointerEvent) {
		if (this.root.disabled.current) return;
		e.preventDefault();
		if (document.activeElement !== this.root.inputNode) {
			this.root.inputNode?.focus();
		}
		this.root.toggleMenu();
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.root.disabled.current ? true : undefined,
				"aria-haspopup": "listbox",
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[this.root.bitsAttrs.trigger]: "",
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
			}) as const
	);
}

type SelectTriggerStateProps = WithRefProps;

class SelectTriggerState {
	#id: SelectTriggerStateProps["id"];
	#ref: SelectTriggerStateProps["ref"];
	root: SelectRootState;
	#domTypeahead: DOMTypeahead;
	#dataTypeahead: DataTypeahead;

	constructor(props: SelectTriggerStateProps, root: SelectRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.triggerNode = node;
			},
		});

		this.#domTypeahead = useDOMTypeahead({
			getCurrentItem: () => this.root.highlightedNode,
			onMatch: (node) => {
				this.root.setHighlightedNode(node);
			},
		});

		this.#dataTypeahead = useDataTypeahead({
			getCurrentItem: () => {
				if (this.root.isMulti) return "";
				return this.root.currentLabel;
			},
			onMatch: (label: string) => {
				if (this.root.isMulti) return;
				if (!this.root.items.current) return;
				const matchedItem = this.root.items.current.find((item) => item.label === label);
				if (!matchedItem) return;
				this.root.value.current = matchedItem.value;
			},
			enabled: !this.root.isMulti && this.root.dataTypeaheadEnabled,
		});

		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onclick = this.onclick.bind(this);
	}

	#handleOpen() {
		this.root.open.current = true;
		this.#dataTypeahead.resetTypeahead();
		this.#domTypeahead.resetTypeahead();
	}

	#handlePointerOpen(e: PointerEvent) {
		this.#handleOpen();
		this.root.triggerPointerDownPos = {
			x: Math.round(e.pageX),
			y: Math.round(e.pageY),
		};
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();

		if (!this.root.open.current) {
			if (
				e.key === kbd.ENTER ||
				e.key === kbd.SPACE ||
				e.key === kbd.ARROW_DOWN ||
				e.key === kbd.ARROW_UP
			) {
				e.preventDefault();
				this.root.handleOpen();
			} else if (!this.root.isMulti && this.root.dataTypeaheadEnabled) {
				this.#dataTypeahead.handleTypeaheadSearch(e.key, this.root.candidateLabels);
				return;
			}

			// we need to wait for a tick after the menu opens to ensure
			// the highlighted nodes are set correctly
			afterTick(() => {
				if (this.root.hasValue) return;
				const candidateNodes = this.root.getCandidateNodes();
				if (!candidateNodes.length) return;

				if (e.key === kbd.ARROW_DOWN) {
					const firstCandidate = candidateNodes[0]!;
					this.root.setHighlightedNode(firstCandidate);
				} else if (e.key === kbd.ARROW_UP) {
					const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
					this.root.setHighlightedNode(lastCandidate);
				}
			});
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.handleClose();
			return;
		}

		if ((e.key === kbd.ENTER || e.key === kbd.SPACE) && !e.isComposing) {
			e.preventDefault();
			const highlightedValue = this.root.highlightedValue;

			const isCurrentSelectedValue = highlightedValue === this.root.value.current;

			if (!this.root.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
				this.root.handleClose();
				return;
			}

			//"" is a valid value for a select item so we need to check for that
			if (highlightedValue !== null) {
				this.root.toggleItem(highlightedValue, this.root.highlightedLabel ?? undefined);
			}

			if (!this.root.isMulti && !isCurrentSelectedValue) {
				this.root.handleClose();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.handleClose();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode
				? candidateNodes.indexOf(currHighlightedNode)
				: -1;

			const loop = this.root.loop.current;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.ARROW_UP) {
				nextItem = prev(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.PAGE_DOWN) {
				nextItem = forward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.PAGE_UP) {
				nextItem = backward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.HOME) {
				nextItem = candidateNodes[0];
			} else if (e.key === kbd.END) {
				nextItem = candidateNodes[candidateNodes.length - 1];
			}
			if (!nextItem) return;
			this.root.setHighlightedNode(nextItem);
			return;
		}
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		const candidateNodes = this.root.getCandidateNodes();

		if (e.key === kbd.TAB) return;

		if (!isModifierKey && isCharacterKey) {
			this.#domTypeahead.handleTypeaheadSearch(e.key, candidateNodes);
			return;
		}

		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
	}

	onclick(e: BitsMouseEvent) {
		// While browsers generally have no issue focusing the trigger when clicking
		// on a label, Safari seems to struggle with the fact that there's no `onClick`.
		// We force `focus` in this case. Note: this doesn't create any other side-effect
		// because we are preventing default in `onpointerdown` so effectively
		// this only runs for a label 'click'
		const currTarget = e.currentTarget as HTMLElement;
		currTarget.focus();
	}

	/**
	 * `pointerdown` fires before the `focus` event, so we can prevent the default
	 * behavior of focusing the button and keep focus on the input.
	 */
	onpointerdown = (e: BitsPointerEvent) => {
		if (this.root.disabled.current) return;
		// prevent opening on touch down which can be triggered when scrolling on touch devices
		if (e.pointerType === "touch") return e.preventDefault();

		// prevent implicit pointer capture
		const target = e.target as HTMLElement;
		if (target?.hasPointerCapture(e.pointerId)) {
			target?.releasePointerCapture(e.pointerId);
		}

		// only call the handle if it's a left click, since pointerdown is triggered
		// by right clicks as well, but not when ctrl is pressed
		if (e.button === 0 && e.ctrlKey === false) {
			if (this.root.open.current === false) {
				this.#handlePointerOpen(e);
				e.preventDefault();
			} else {
				this.root.handleClose();
			}
		}
	};

	onpointerup = (e: BitsPointerEvent) => {
		e.preventDefault();
		if (e.pointerType === "touch") {
			this.#handlePointerOpen(e);
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.root.disabled.current ? true : undefined,
				"aria-haspopup": "listbox",
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				"data-placeholder": this.root.hasValue ? undefined : "",
				[this.root.bitsAttrs.trigger]: "",
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				onpointerup: this.onpointerup,
			}) as const
	);
}

type SelectContentStateProps = WithRefProps;

class SelectContentState {
	id: SelectContentStateProps["id"];
	ref: SelectContentStateProps["ref"];
	viewportNode = $state<HTMLElement | null>(null);
	root: SelectRootState;
	isPositioned = $state(false);

	constructor(props: SelectContentStateProps, root: SelectRootState) {
		this.root = root;
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
			deps: () => this.root.open.current,
		});

		onDestroyEffect(() => (this.root.contentNode = null));

		watch(
			() => this.root.open.current,
			(isOpen) => {
				if (isOpen) return;
				this.isPositioned = false;
			}
		);

		this.onpointermove = this.onpointermove.bind(this);
		this.handleInteractOutside = this.handleInteractOutside.bind(this);
	}

	onpointermove(_: BitsPointerEvent) {
		this.root.isUsingKeyboard = false;
	}

	#styles = $derived.by(() => {
		if (this.root.isCombobox) {
			return {
				"--bits-combobox-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-combobox-content-available-width": "var(--bits-floating-available-width)",
				"--bits-combobox-content-available-height": "var(--bits-floating-available-height)",
				"--bits-combobox-anchor-width": "var(--bits-floating-anchor-width)",
				"--bits-combobox-anchor-height": "var(--bits-floating-anchor-height)",
			};
		} else {
			return {
				"--bits-select-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-select-content-available-width": "var(--bits-floating-available-width)",
				"--bits-select-content-available-height": "var(--bits-floating-available-height)",
				"--bits-select-anchor-width": "var(--bits-floating-anchor-width)",
				"--bits-select-anchor-height": "var(--bits-floating-anchor-height)",
			};
		}
	});

	handleInteractOutside(e: PointerEvent) {
		if (e.target === this.root.triggerNode || e.target === this.root.inputNode) {
			e.preventDefault();
		}
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "listbox",
				"data-state": getDataOpenClosed(this.root.open.current),
				[this.root.bitsAttrs.content]: "",
				style: {
					display: "flex",
					flexDirection: "column",
					outline: "none",
					boxSizing: "border-box",
					pointerEvents: "auto",
					...this.#styles,
				},
				onpointermove: this.onpointermove,
			}) as const
	);
}

type SelectItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
		label: string;
		onHighlight: () => void;
		onUnhighlight: () => void;
	}>
>;

class SelectItemState {
	#id: SelectItemStateProps["id"];
	#ref: SelectItemStateProps["ref"];
	root: SelectRootState;
	value: SelectItemStateProps["value"];
	label: SelectItemStateProps["label"];
	onHighlight: SelectItemStateProps["onHighlight"];
	onUnhighlight: SelectItemStateProps["onUnhighlight"];
	disabled: SelectItemStateProps["disabled"];
	isSelected = $derived.by(() => this.root.includesItem(this.value.current));
	isHighlighted = $derived.by(() => this.root.highlightedValue === this.value.current);
	prevHighlighted = new Previous(() => this.isHighlighted);
	textId = $state("");
	mounted = $state(false);

	constructor(props: SelectItemStateProps, root: SelectRootState) {
		this.root = root;
		this.value = props.value;
		this.disabled = props.disabled;
		this.label = props.label;
		this.onHighlight = props.onHighlight;
		this.onUnhighlight = props.onUnhighlight;
		this.#id = props.id;
		this.#ref = props.ref;

		$effect(() => {
			if (this.isHighlighted) {
				this.onHighlight.current();
			} else if (this.prevHighlighted.current) {
				this.onUnhighlight.current();
			}
		});

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		watch(
			() => this.mounted,
			(isMounted) => {
				if (!isMounted) return;
				this.root.setInitialHighlightedNode();
			}
		);

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}

	snippetProps = $derived.by(() => ({
		selected: this.isSelected,
		highlighted: this.isHighlighted,
	}));

	onpointerdown(e: BitsPointerEvent) {
		// prevent focus from leaving the combobox
		e.preventDefault();
	}

	/**
	 * Using `pointerup` instead of `click` allows power users to pointerdown
	 * the trigger, then release pointerup on an item to select it vs having to do
	 * multiple clicks.
	 */
	onpointerup(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		// prevent any default behavior
		e.preventDefault();
		if (this.disabled.current) return;
		const isCurrentSelectedValue = this.value.current === this.root.value.current;

		// if allowDeselect is false and the item is already selected and we're not in a
		// multi select, do nothing and close the menu
		if (!this.root.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
			this.root.handleClose();
			return;
		}

		// otherwise, toggle the item and if we're not in a multi select, close the menu
		this.root.toggleItem(this.value.current, this.label.current);
		if (!this.root.isMulti && !isCurrentSelectedValue) {
			this.root.handleClose();
		}
	}

	onpointermove(_: BitsPointerEvent) {
		if (this.root.highlightedNode !== this.#ref.current) {
			this.root.setHighlightedNode(this.#ref.current);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "option",
				"aria-selected": this.root.includesItem(this.value.current) ? "true" : undefined,
				"data-value": this.value.current,
				"data-disabled": getDataDisabled(this.disabled.current),
				"data-highlighted":
					this.root.highlightedValue === this.value.current ? "" : undefined,
				"data-selected": this.root.includesItem(this.value.current) ? "" : undefined,
				"data-label": this.label.current,
				[this.root.bitsAttrs.item]: "",

				onpointermove: this.onpointermove,
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
			}) as const
	);
}

type SelectGroupStateProps = WithRefProps;

class SelectGroupState {
	#id: SelectGroupStateProps["id"];
	#ref: SelectGroupStateProps["ref"];
	root: SelectBaseRootState;
	labelNode = $state<HTMLElement | null>(null);

	constructor(props: SelectGroupStateProps, root: SelectBaseRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "group",
				[this.root.bitsAttrs.group]: "",
				"aria-labelledby": this.labelNode?.id ?? undefined,
			}) as const
	);
}

type SelectGroupHeadingStateProps = WithRefProps;

class SelectGroupHeadingState {
	#id: SelectGroupHeadingStateProps["id"];
	#ref: SelectGroupHeadingStateProps["ref"];
	group: SelectGroupState;

	constructor(props: SelectGroupHeadingStateProps, group: SelectGroupState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.group = group;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				group.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.group.root.bitsAttrs["group-label"]]: "",
			}) as const
	);
}

type SelectHiddenInputStateProps = ReadableBoxedValues<{
	value: string;
}>;

class SelectHiddenInputState {
	#value: SelectHiddenInputStateProps["value"];
	root: SelectBaseRootState;
	shouldRender = $derived.by(() => this.root.name.current !== "");

	constructor(props: SelectHiddenInputStateProps, root: SelectBaseRootState) {
		this.root = root;
		this.#value = props.value;
		this.onfocus = this.onfocus.bind(this);
	}

	onfocus(e: BitsFocusEvent) {
		e.preventDefault();

		if (!this.root.isCombobox) {
			this.root.triggerNode?.focus();
		} else {
			this.root.inputNode?.focus();
		}
	}

	props = $derived.by(
		() =>
			({
				disabled: getDisabled(this.root.disabled.current),
				required: getRequired(this.root.required.current),
				name: this.root.name.current,
				value: this.#value.current,
				style: styleToString(srOnlyStyles),
				tabindex: -1,
				onfocus: this.onfocus,
			}) as const
	);
}

type SelectViewportStateProps = WithRefProps;

class SelectViewportState {
	#id: SelectViewportStateProps["id"];
	#ref: SelectViewportStateProps["ref"];
	root: SelectBaseRootState;
	content: SelectContentState;
	prevScrollTop = $state(0);

	constructor(props: SelectViewportStateProps, content: SelectContentState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.content = content;
		this.root = content.root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.content.viewportNode = node;
			},
			deps: () => this.root.open.current,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "presentation",
				[this.root.bitsAttrs.viewport]: "",
				style: {
					// we use position: 'relative' here on the `viewport` so that when we call
					// `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
					// (independent of the scrollUpButton).
					position: "relative",
					flex: 1,
					overflow: "auto",
				},
			}) as const
	);
}

type SelectScrollButtonImplStateProps = WithRefProps<ReadableBoxedValues<{ mounted: boolean }>>;

class SelectScrollButtonImplState {
	id: SelectScrollButtonImplStateProps["id"];
	ref: SelectScrollButtonImplStateProps["ref"];
	content: SelectContentState;
	root: SelectBaseRootState;
	autoScrollTimer = $state<number | null>(null);
	onAutoScroll: () => void = noop;
	mounted: SelectScrollButtonImplStateProps["mounted"];

	constructor(props: SelectScrollButtonImplStateProps, content: SelectContentState) {
		this.ref = props.ref;
		this.id = props.id;
		this.mounted = props.mounted;
		this.content = content;
		this.root = content.root;

		useRefById({
			id: this.id,
			ref: this.ref,
			deps: () => this.mounted.current,
		});

		watch(
			() => this.mounted.current,
			(isMounted) => {
				if (!isMounted) return;
				const activeItem = this.root.highlightedNode;
				activeItem?.scrollIntoView({ block: "nearest" });
			}
		);

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
	}

	clearAutoScrollTimer() {
		if (this.autoScrollTimer === null) return;
		window.clearInterval(this.autoScrollTimer);
		this.autoScrollTimer = null;
	}

	onpointerdown(_: BitsPointerEvent) {
		if (this.autoScrollTimer !== null) return;
		this.autoScrollTimer = window.setInterval(() => {
			this.onAutoScroll();
		}, 50);
	}

	onpointermove(_: BitsPointerEvent) {
		if (this.autoScrollTimer !== null) return;
		this.autoScrollTimer = window.setInterval(() => {
			this.onAutoScroll();
		}, 50);
	}

	onpointerleave(_: BitsPointerEvent) {
		this.clearAutoScrollTimer();
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"aria-hidden": getAriaHidden(true),
				style: {
					flexShrink: 0,
				},
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
			}) as const
	);
}

class SelectScrollDownButtonState {
	state: SelectScrollButtonImplState;
	content: SelectContentState;
	root: SelectBaseRootState;
	canScrollDown = $state(false);

	constructor(state: SelectScrollButtonImplState) {
		this.state = state;
		this.content = state.content;
		this.root = state.root;
		this.state.onAutoScroll = this.handleAutoScroll;

		watch(
			[() => this.content.viewportNode, () => this.content.isPositioned],
			([viewportNode, isPositioned]) => {
				if (!viewportNode || !isPositioned) return;

				const handleScroll = () => {
					afterTick(() => {
						const maxScroll = viewportNode.scrollHeight - viewportNode.clientHeight;
						const paddingTop = Number.parseInt(
							getComputedStyle(viewportNode).paddingTop,
							10
						);

						this.canScrollDown =
							Math.ceil(viewportNode.scrollTop) < maxScroll - paddingTop;
					});
				};
				handleScroll();
				return on(viewportNode, "scroll", handleScroll);
			}
		);

		$effect(() => {
			if (this.state.mounted.current) return;
			this.state.clearAutoScrollTimer();
		});
	}

	handleAutoScroll = () => {
		afterTick(() => {
			const viewport = this.content.viewportNode;
			const selectedItem = this.root.highlightedNode;
			if (!viewport || !selectedItem) return;
			viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
		});
	};

	props = $derived.by(
		() => ({ ...this.state.props, [this.root.bitsAttrs["scroll-down-button"]]: "" }) as const
	);
}

class SelectScrollUpButtonState {
	state: SelectScrollButtonImplState;
	content: SelectContentState;
	root: SelectBaseRootState;
	canScrollUp = $state(false);

	constructor(state: SelectScrollButtonImplState) {
		this.state = state;
		this.content = state.content;
		this.root = state.root;
		this.state.onAutoScroll = this.handleAutoScroll;

		watch(
			[() => this.content.viewportNode, () => this.content.isPositioned],
			([viewportNode, isPositioned]) => {
				if (!viewportNode || !isPositioned) return;

				const handleScroll = () => {
					const paddingTop = Number.parseInt(
						getComputedStyle(viewportNode).paddingTop,
						10
					);
					this.canScrollUp = viewportNode.scrollTop - paddingTop > 0;
				};
				handleScroll();
				return on(viewportNode, "scroll", handleScroll);
			}
		);

		$effect(() => {
			if (this.state.mounted.current) return;
			this.state.clearAutoScrollTimer();
		});
	}

	handleAutoScroll = () => {
		afterTick(() => {
			const viewport = this.content.viewportNode;
			const selectedItem = this.root.highlightedNode;
			if (!viewport || !selectedItem) return;
			viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		});
	};

	props = $derived.by(
		() => ({ ...this.state.props, [this.root.bitsAttrs["scroll-up-button"]]: "" }) as const
	);
}

type InitSelectProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
} & ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
	name: string;
	items: { value: string; label: string; disabled?: boolean }[];
	allowDeselect: boolean;
}> &
	WritableBoxedValues<{
		open: boolean;
	}> & {
		isCombobox: boolean;
	};

const SelectRootContext = new Context<SelectRootState>("Select.Root | Combobox.Root");
const SelectGroupContext = new Context<SelectGroupState>("Select.Group | Combobox.Group");
const SelectContentContext = new Context<SelectContentState>("Select.Content | Combobox.Content");

export function useSelectRoot(props: InitSelectProps) {
	const { type, ...rest } = props;

	const rootState =
		type === "single"
			? new SelectSingleRootState(rest as SelectSingleRootStateProps)
			: new SelectMultipleRootState(rest as SelectMultipleRootStateProps);

	return SelectRootContext.set(rootState);
}

export function useSelectInput(props: SelectInputStateProps) {
	return new SelectInputState(props, SelectRootContext.get());
}

export function useSelectContent(props: SelectContentStateProps) {
	return SelectContentContext.set(new SelectContentState(props, SelectRootContext.get()));
}

export function useSelectTrigger(props: SelectTriggerStateProps) {
	return new SelectTriggerState(props, SelectRootContext.get());
}

export function useSelectComboTrigger(props: SelectComboTriggerStateProps) {
	return new SelectComboTriggerState(props, SelectRootContext.get());
}

export function useSelectItem(props: SelectItemStateProps) {
	return new SelectItemState(props, SelectRootContext.get());
}

export function useSelectViewport(props: SelectViewportStateProps) {
	return new SelectViewportState(props, SelectContentContext.get());
}

export function useSelectScrollUpButton(props: SelectScrollButtonImplStateProps) {
	return new SelectScrollUpButtonState(
		new SelectScrollButtonImplState(props, SelectContentContext.get())
	);
}

export function useSelectScrollDownButton(props: SelectScrollButtonImplStateProps) {
	return new SelectScrollDownButtonState(
		new SelectScrollButtonImplState(props, SelectContentContext.get())
	);
}

export function useSelectGroup(props: SelectGroupStateProps) {
	return SelectGroupContext.set(new SelectGroupState(props, SelectRootContext.get()));
}

export function useSelectGroupHeading(props: SelectGroupHeadingStateProps) {
	return new SelectGroupHeadingState(props, SelectGroupContext.get());
}

export function useSelectHiddenInput(props: SelectHiddenInputStateProps) {
	return new SelectHiddenInputState(props, SelectRootContext.get());
}

////////////////////////////////////
// Helpers
////////////////////////////////////

const selectParts = [
	"trigger",
	"content",
	"item",
	"viewport",
	"scroll-up-button",
	"scroll-down-button",
	"group",
	"group-label",
	"separator",
	"arrow",
	"input",
	"content-wrapper",
	"item-text",
	"value",
] as const;

type SelectBitsAttrs = Record<(typeof selectParts)[number], string>;

export function getSelectBitsAttrs(root: SelectBaseRootState): SelectBitsAttrs {
	const isCombobox = root.isCombobox;
	const attrObj = {} as SelectBitsAttrs;
	for (const part of selectParts) {
		attrObj[part] = isCombobox ? `data-combobox-${part}` : `data-select-${part}`;
	}
	return attrObj;
}
