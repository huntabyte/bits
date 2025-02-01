import { afterTick, useRefById } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import {
	getAriaDisabled,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";
import type { Orientation } from "$lib/shared/index.js";

const ACCORDION_ROOT_ATTR = "data-accordion-root";
const ACCORDION_TRIGGER_ATTR = "data-accordion-trigger";
const ACCORDION_CONTENT_ATTR = "data-accordion-content";
const ACCORDION_ITEM_ATTR = "data-accordion-item";
const ACCORDION_HEADER_ATTR = "data-accordion-header";

//
// BASE
//

type AccordionBaseStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		orientation: Orientation;
		loop: boolean;
	}>
>;

class AccordionBaseState {
	#id: AccordionBaseStateProps["id"];
	#ref: AccordionBaseStateProps["ref"];
	disabled: AccordionBaseStateProps["disabled"];
	#loop: AccordionBaseStateProps["loop"];
	orientation: AccordionBaseStateProps["orientation"];
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(props: AccordionBaseStateProps) {
		this.#id = props.id;
		this.disabled = props.disabled;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		this.orientation = props.orientation;
		this.#loop = props.loop;
		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.#id,
			candidateAttr: ACCORDION_TRIGGER_ATTR,
			loop: this.#loop,
			orientation: this.orientation,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"data-orientation": getDataOrientation(this.orientation.current),
				"data-disabled": getDataDisabled(this.disabled.current),
				[ACCORDION_ROOT_ATTR]: "",
			}) as const
	);
}

//
// SINGLE
//

type AccordionSingleStateProps = AccordionBaseStateProps & WritableBoxedValues<{ value: string }>;

export class AccordionSingleState extends AccordionBaseState {
	#value: AccordionSingleStateProps["value"];
	isMulti = false as const;

	constructor(props: AccordionSingleStateProps) {
		super(props);
		this.#value = props.value;
		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}

	includesItem(item: string) {
		return this.#value.current === item;
	}

	toggleItem(item: string) {
		this.#value.current = this.includesItem(item) ? "" : item;
	}
}

//
// MULTIPLE
//

type AccordionMultiStateProps = AccordionBaseStateProps & WritableBoxedValues<{ value: string[] }>;

export class AccordionMultiState extends AccordionBaseState {
	#value: AccordionMultiStateProps["value"];
	isMulti = true as const;

	constructor(props: AccordionMultiStateProps) {
		super(props);
		this.#value = props.value;

		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}

	includesItem(item: string) {
		return this.#value.current.includes(item);
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.#value.current = this.#value.current.filter((v) => v !== item);
		} else {
			this.#value.current = [...this.#value.current, item];
		}
	}
}

//
// ITEM
//

type AccordionItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}> & {
		rootState: AccordionState;
	}
>;

export class AccordionItemState {
	#id: AccordionItemStateProps["id"];
	#ref: AccordionItemStateProps["ref"];
	value: AccordionItemStateProps["value"];
	disabled: AccordionItemStateProps["disabled"];
	root: AccordionState;
	isActive = $derived.by(() => this.root.includesItem(this.value.current));
	isDisabled = $derived.by(() => this.disabled.current || this.root.disabled.current);

	constructor(props: AccordionItemStateProps) {
		this.value = props.value;
		this.disabled = props.disabled;
		this.root = props.rootState;
		this.#id = props.id;
		this.#ref = props.ref;

		this.updateValue = this.updateValue.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.isActive,
		});
	}

	updateValue() {
		this.root.toggleItem(this.value.current);
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"data-state": getDataOpenClosed(this.isActive),
				"data-disabled": getDataDisabled(this.isDisabled),
				"data-orientation": getDataOrientation(this.root.orientation.current),
				[ACCORDION_ITEM_ATTR]: "",
			}) as const
	);
}

//
// TRIGGER
//

type AccordionTriggerStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>
>;

class AccordionTriggerState {
	#ref: AccordionTriggerStateProps["ref"];
	#disabled: AccordionTriggerStateProps["disabled"];
	#id: AccordionTriggerStateProps["id"];
	#root: AccordionState;
	#itemState: AccordionItemState;
	#isDisabled = $derived.by(
		() =>
			this.#disabled.current ||
			this.#itemState.disabled.current ||
			this.#root.disabled.current
	);

	constructor(props: AccordionTriggerStateProps, itemState: AccordionItemState) {
		this.#disabled = props.disabled;
		this.#itemState = itemState;
		this.#root = itemState.root;
		this.#id = props.id;
		this.#ref = props.ref;
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: props.id,
			ref: this.#ref,
		});
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled) return;
		if (e.button !== 0) return e.preventDefault();
		this.#itemState.updateValue();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#itemState.updateValue();
			return;
		}

		this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.#isDisabled,
				"aria-expanded": getAriaExpanded(this.#itemState.isActive),
				"aria-disabled": getAriaDisabled(this.#isDisabled),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": getDataOpenClosed(this.#itemState.isActive),
				"data-orientation": getDataOrientation(this.#root.orientation.current),
				[ACCORDION_TRIGGER_ATTR]: "",
				tabindex: 0,
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);
}

//
// CONTENT
//

type AccordionContentStateProps = WithRefProps<
	ReadableBoxedValues<{
		forceMount: boolean;
	}>
>;
class AccordionContentState {
	item: AccordionItemState;
	#ref: AccordionContentStateProps["ref"];
	#id: AccordionContentStateProps["id"];
	#originalStyles: { transitionDuration: string; animationName: string } | undefined = undefined;
	#isMountAnimationPrevented = false;
	#width = $state(0);
	#height = $state(0);
	#forceMount: AccordionContentStateProps["forceMount"];

	present = $derived.by(() => this.#forceMount.current || this.item.isActive);

	constructor(props: AccordionContentStateProps, item: AccordionItemState) {
		this.item = item;
		this.#forceMount = props.forceMount;
		this.#isMountAnimationPrevented = this.item.isActive;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect.pre(() => {
			const rAF = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});

			return () => {
				cancelAnimationFrame(rAF);
			};
		});

		watch([() => this.present, () => this.#ref.current], ([_, node]) => {
			if (!node) return;
			afterTick(() => {
				if (!this.#ref.current) return;
				// get the dimensions of the element
				this.#originalStyles = this.#originalStyles || {
					transitionDuration: node.style.transitionDuration,
					animationName: node.style.animationName,
				};

				// block any animations/transitions so the element renders at full dimensions
				node.style.transitionDuration = "0s";
				node.style.animationName = "none";

				const rect = node.getBoundingClientRect();
				this.#height = rect.height;
				this.#width = rect.width;

				// unblock any animations/transitions that were originally set if not the initial render
				if (!this.#isMountAnimationPrevented) {
					const { animationName, transitionDuration } = this.#originalStyles;
					node.style.transitionDuration = transitionDuration;
					node.style.animationName = animationName;
				}
			});
		});
	}

	snippetProps = $derived.by(() => ({
		open: this.item.isActive,
	}));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"data-state": getDataOpenClosed(this.item.isActive),
				"data-disabled": getDataDisabled(this.item.isDisabled),
				"data-orientation": getDataOrientation(this.item.root.orientation.current),
				[ACCORDION_CONTENT_ATTR]: "",
				style: {
					"--bits-accordion-content-height": `${this.#height}px`,
					"--bits-accordion-content-width": `${this.#width}px`,
				},
			}) as const
	);
}

type AccordionHeaderStateProps = WithRefProps<
	ReadableBoxedValues<{
		level: 1 | 2 | 3 | 4 | 5 | 6;
	}>
>;

class AccordionHeaderState {
	#id: AccordionHeaderStateProps["id"];
	#ref: AccordionHeaderStateProps["ref"];
	#level: AccordionHeaderStateProps["level"];
	#item: AccordionItemState;
	constructor(props: AccordionHeaderStateProps, item: AccordionItemState) {
		this.#level = props.level;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		this.#item = item;
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "heading",
				"aria-level": this.#level.current,
				"data-heading-level": this.#level.current,
				"data-state": getDataOpenClosed(this.#item.isActive),
				"data-orientation": getDataOrientation(this.#item.root.orientation.current),
				[ACCORDION_HEADER_ATTR]: "",
			}) as const
	);
}

//
// CONTEXT METHODS
//

type AccordionState = AccordionSingleState | AccordionMultiState;

type InitAccordionProps = WithRefProps<
	{
		type: "single" | "multiple";
		value: Box<string> | Box<string[]>;
	} & ReadableBoxedValues<{
		disabled: boolean;
		orientation: Orientation;
		loop: boolean;
	}>
>;

const AccordionRootContext = new Context<AccordionState>("Accordion.Root");
const AccordionItemContext = new Context<AccordionItemState>("Accordion.Item");

export function useAccordionRoot(props: InitAccordionProps) {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new AccordionSingleState(rest as AccordionSingleStateProps)
			: new AccordionMultiState(rest as AccordionMultiStateProps);
	return AccordionRootContext.set(rootState);
}

export function useAccordionItem(props: Omit<AccordionItemStateProps, "rootState">) {
	const rootState = AccordionRootContext.get();
	return AccordionItemContext.set(new AccordionItemState({ ...props, rootState }));
}

export function useAccordionTrigger(props: AccordionTriggerStateProps): AccordionTriggerState {
	return new AccordionTriggerState(props, AccordionItemContext.get());
}

export function useAccordionContent(props: AccordionContentStateProps): AccordionContentState {
	return new AccordionContentState(props, AccordionItemContext.get());
}

export function useAccordionHeader(props: AccordionHeaderStateProps): AccordionHeaderState {
	return new AccordionHeaderState(props, AccordionItemContext.get());
}
