import { afterTick, useRefById } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { getAriaExpanded, getDataDisabled, getDataOpenClosed } from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import type { BitsKeyboardEvent, BitsMouseEvent } from "$lib/internal/types.js";

const COLLAPSIBLE_ROOT_ATTR = "data-collapsible-root";
const COLLAPSIBLE_CONTENT_ATTR = "data-collapsible-content";
const COLLAPSIBLE_TRIGGER_ATTR = "data-collapsible-trigger";

type CollapsibleRootStateProps = WritableBoxedValues<{
	open: boolean;
	ref: HTMLElement | null;
}> &
	ReadableBoxedValues<{
		disabled: boolean;
		id: string;
	}>;

class CollapsibleRootState {
	#id: CollapsibleRootStateProps["id"];
	#ref: CollapsibleRootStateProps["ref"];
	open: CollapsibleRootStateProps["open"];
	disabled: CollapsibleRootStateProps["disabled"];
	contentNode = $state<HTMLElement | null>(null);

	constructor(props: CollapsibleRootStateProps) {
		this.open = props.open;
		this.disabled = props.disabled;
		this.#id = props.id;
		this.#ref = props.ref;
		this.toggleOpen = this.toggleOpen.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	toggleOpen() {
		this.open.current = !this.open.current;
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"data-state": getDataOpenClosed(this.open.current),
				"data-disabled": getDataDisabled(this.disabled.current),
				[COLLAPSIBLE_ROOT_ATTR]: "",
			}) as const
	);
}

type CollapsibleContentStateProps = ReadableBoxedValues<{
	id: string;
	forceMount: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class CollapsibleContentState {
	#id: CollapsibleContentStateProps["id"];
	#ref: CollapsibleContentStateProps["ref"];
	root: CollapsibleRootState;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	#isMountAnimationPrevented = $state(false);
	#width = $state(0);
	#height = $state(0);
	#forceMount: CollapsibleContentStateProps["forceMount"];

	present = $derived.by(() => this.#forceMount.current || this.root.open.current);

	constructor(props: CollapsibleContentStateProps, root: CollapsibleRootState) {
		this.root = root;
		this.#isMountAnimationPrevented = root.open.current;
		this.#forceMount = props.forceMount;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.present,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
		});

		$effect.pre(() => {
			const rAF = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});

			return () => {
				cancelAnimationFrame(rAF);
			};
		});

		watch([() => this.#ref.current, () => this.present], ([node]) => {
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
		open: this.root.open.current,
	}));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				style: {
					"--bits-collapsible-content-height": this.#height
						? `${this.#height}px`
						: undefined,
					"--bits-collapsible-content-width": this.#width
						? `${this.#width}px`
						: undefined,
				},
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[COLLAPSIBLE_CONTENT_ATTR]: "",
			}) as const
	);
}

type CollapsibleTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean | null | undefined;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class CollapsibleTriggerState {
	#root: CollapsibleRootState;
	#ref: CollapsibleTriggerStateProps["ref"];
	#id: CollapsibleTriggerStateProps["id"];
	#disabled: CollapsibleTriggerStateProps["disabled"];
	#isDisabled = $derived.by(() => this.#disabled.current || this.#root.disabled.current);

	constructor(props: CollapsibleTriggerStateProps, root: CollapsibleRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;
		this.#disabled = props.disabled;

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled) return;
		if (e.button !== 0) return e.preventDefault();
		this.#root.toggleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#root.toggleOpen();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				type: "button",
				disabled: this.#isDisabled,
				"aria-controls": this.#root.contentNode?.id,
				"aria-expanded": getAriaExpanded(this.#root.open.current),
				"data-state": getDataOpenClosed(this.#root.open.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				[COLLAPSIBLE_TRIGGER_ATTR]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);
}

const CollapsibleRootContext = new Context<CollapsibleRootState>("Collapsible.Root");

export function useCollapsibleRoot(props: CollapsibleRootStateProps) {
	return CollapsibleRootContext.set(new CollapsibleRootState(props));
}

export function useCollapsibleTrigger(
	props: CollapsibleTriggerStateProps
): CollapsibleTriggerState {
	return new CollapsibleTriggerState(props, CollapsibleRootContext.get());
}

export function useCollapsibleContent(
	props: CollapsibleContentStateProps
): CollapsibleContentState {
	return new CollapsibleContentState(props, CollapsibleRootContext.get());
}
