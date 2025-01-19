import { box, executeCallbacks, onMountEffect, useRefById } from "svelte-toolbelt";
import { untrack } from "svelte";
import { on } from "svelte/events";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useTimeoutFn } from "$lib/internal/use-timeout-fn.svelte.js";
import { isFocusVisible } from "$lib/internal/is.js";
import { useGraceArea } from "$lib/internal/use-grace-area.svelte.js";
import { getDataDisabled } from "$lib/internal/attrs.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { CustomEventDispatcher } from "$lib/internal/events.js";

const CONTENT_ATTR = "data-tooltip-content";
const TRIGGER_ATTR = "data-tooltip-trigger";

export const TooltipOpenEvent = new CustomEventDispatcher("bits.tooltip.open", {
	bubbles: false,
	cancelable: false,
});

type TooltipProviderStateProps = ReadableBoxedValues<{
	delayDuration: number;
	disableHoverableContent: boolean;
	disableCloseOnTriggerClick: boolean;
	disabled: boolean;
	ignoreNonKeyboardFocus: boolean;
	skipDelayDuration: number;
}>;

class TooltipProviderState {
	delayDuration: TooltipProviderStateProps["delayDuration"];
	disableHoverableContent: TooltipProviderStateProps["disableHoverableContent"];
	disableCloseOnTriggerClick: TooltipProviderStateProps["disableCloseOnTriggerClick"];
	disabled: TooltipProviderStateProps["disabled"];
	ignoreNonKeyboardFocus: TooltipProviderStateProps["ignoreNonKeyboardFocus"];
	skipDelayDuration: TooltipProviderStateProps["skipDelayDuration"];
	isOpenDelayed = $state<boolean>(true);
	isPointerInTransit = box(false);
	#timerFn: ReturnType<typeof useTimeoutFn>;

	constructor(props: TooltipProviderStateProps) {
		this.delayDuration = props.delayDuration;
		this.disableHoverableContent = props.disableHoverableContent;
		this.disableCloseOnTriggerClick = props.disableCloseOnTriggerClick;
		this.disabled = props.disabled;
		this.ignoreNonKeyboardFocus = props.ignoreNonKeyboardFocus;
		this.skipDelayDuration = props.skipDelayDuration;
		this.#timerFn = useTimeoutFn(
			() => {
				this.isOpenDelayed = true;
			},
			this.skipDelayDuration.current,
			{ immediate: false }
		);
	}

	#startTimer = () => {
		this.#timerFn.start();
	};

	#clearTimer = () => {
		this.#timerFn.stop();
	};

	onOpen = () => {
		this.#clearTimer();
		this.isOpenDelayed = false;
	};

	onClose = () => {
		this.#startTimer();
	};
}

type TooltipRootStateProps = ReadableBoxedValues<{
	delayDuration: number | undefined;
	disableHoverableContent: boolean | undefined;
	disableCloseOnTriggerClick: boolean | undefined;
	disabled: boolean | undefined;
	ignoreNonKeyboardFocus: boolean | undefined;
}> &
	WritableBoxedValues<{
		open: boolean;
	}>;

class TooltipRootState {
	open: TooltipRootStateProps["open"];
	_delayDuration: TooltipRootStateProps["delayDuration"];
	_disableHoverableContent: TooltipRootStateProps["disableHoverableContent"];
	_disableCloseOnTriggerClick: TooltipRootStateProps["disableCloseOnTriggerClick"];
	_disabled: TooltipRootStateProps["disabled"];
	_ignoreNonKeyboardFocus: TooltipRootStateProps["ignoreNonKeyboardFocus"];
	provider: TooltipProviderState;
	delayDuration = $derived.by(
		() => this._delayDuration.current ?? this.provider.delayDuration.current
	);
	disableHoverableContent = $derived.by(
		() => this._disableHoverableContent.current ?? this.provider.disableHoverableContent.current
	);
	disableCloseOnTriggerClick = $derived.by(
		() =>
			this._disableCloseOnTriggerClick.current ??
			this.provider.disableCloseOnTriggerClick.current
	);
	disabled = $derived.by(() => this._disabled.current ?? this.provider.disabled.current);
	ignoreNonKeyboardFocus = $derived.by(
		() => this._ignoreNonKeyboardFocus.current ?? this.provider.ignoreNonKeyboardFocus.current
	);
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	#wasOpenDelayed = $state(false);
	#timerFn: ReturnType<typeof useTimeoutFn>;
	stateAttr = $derived.by(() => {
		if (!this.open.current) return "closed";
		return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
	});

	constructor(props: TooltipRootStateProps, provider: TooltipProviderState) {
		this.provider = provider;
		this.open = props.open;
		this._delayDuration = props.delayDuration;
		this._disableHoverableContent = props.disableHoverableContent;
		this._disableCloseOnTriggerClick = props.disableCloseOnTriggerClick;
		this._disabled = props.disabled;
		this._ignoreNonKeyboardFocus = props.ignoreNonKeyboardFocus;

		this.#timerFn = useTimeoutFn(
			() => {
				this.#wasOpenDelayed = true;
				this.open.current = true;
			},
			this.delayDuration ?? 0,
			{ immediate: false }
		);

		$effect(() => {
			if (this.delayDuration !== undefined) {
				untrack(() => {
					this.#timerFn = useTimeoutFn(
						() => {
							this.#wasOpenDelayed = true;
							this.open.current = true;
						},
						this.delayDuration,
						{ immediate: false }
					);
				});
			}
		});

		watch(
			() => this.open.current,
			(isOpen) => {
				if (!this.provider.onClose) return;
				if (isOpen) {
					this.provider.onOpen();
					TooltipOpenEvent.dispatch(document);
				} else {
					this.provider.onClose();
				}
			}
		);
	}

	handleOpen = () => {
		this.#timerFn.stop();
		this.#wasOpenDelayed = false;
		this.open.current = true;
	};

	handleClose = () => {
		this.#timerFn.stop();
		this.open.current = false;
	};

	#handleDelayedOpen = () => {
		this.#timerFn.start();
	};

	onTriggerEnter = () => {
		this.#handleDelayedOpen();
	};

	onTriggerLeave = () => {
		if (this.disableHoverableContent) {
			this.handleClose();
		} else {
			this.#timerFn.stop();
		}
	};
}

type TooltipTriggerStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

class TooltipTriggerState {
	#id: TooltipTriggerStateProps["id"];
	#ref: TooltipTriggerStateProps["ref"];
	#root: TooltipRootState;
	#isPointerDown = box(false);
	#hasPointerMoveOpened = $state(false);
	#disabled: TooltipTriggerStateProps["disabled"];
	#isDisabled = $derived.by(() => this.#disabled.current || this.#root.disabled);

	constructor(props: TooltipTriggerStateProps, root: TooltipRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#disabled = props.disabled;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.triggerNode = node;
			},
		});
	}

	handlePointerUp = () => {
		this.#isPointerDown.current = false;
	};

	#onpointerup = () => {
		if (this.#isDisabled) return;
		this.#isPointerDown.current = false;
	};

	#onpointerdown = () => {
		if (this.#isDisabled) return;
		this.#isPointerDown.current = true;
		document.addEventListener(
			"pointerup",
			() => {
				this.handlePointerUp();
			},
			{ once: true }
		);
	};

	#onpointermove = (e: PointerEvent) => {
		if (this.#isDisabled) return;
		if (e.pointerType === "touch") return;
		if (this.#hasPointerMoveOpened || this.#root.provider.isPointerInTransit.current) return;
		this.#root.onTriggerEnter();
		this.#hasPointerMoveOpened = true;
	};

	#onpointerleave = () => {
		if (this.#isDisabled) return;
		this.#root.onTriggerLeave();
		this.#hasPointerMoveOpened = false;
	};

	#onfocus = (e: FocusEvent & { currentTarget: HTMLElement }) => {
		if (this.#isPointerDown.current || this.#isDisabled) return;

		if (this.#root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
		this.#root.handleOpen();
	};

	#onblur = () => {
		if (this.#isDisabled) return;
		this.#root.handleClose();
	};

	#onclick = () => {
		if (this.#root.disableCloseOnTriggerClick || this.#isDisabled) return;
		this.#root.handleClose();
	};

	props = $derived.by(() => ({
		id: this.#id.current,
		"aria-describedby": this.#root.open.current ? this.#root.contentNode?.id : undefined,
		"data-state": this.#root.stateAttr,
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-delay-duration": `${this.#root.delayDuration}`,
		[TRIGGER_ATTR]: "",
		tabindex: this.#isDisabled ? undefined : 0,
		disabled: this.#disabled.current,
		onpointerup: this.#onpointerup,
		onpointerdown: this.#onpointerdown,
		onpointermove: this.#onpointermove,
		onpointerleave: this.#onpointerleave,
		onfocus: this.#onfocus,
		onblur: this.#onblur,
		onclick: this.#onclick,
	}));
}

type TooltipContentStateProps = WithRefProps;

class TooltipContentState {
	root: TooltipRootState;
	#id: TooltipContentStateProps["id"];
	#ref: TooltipContentStateProps["ref"];

	constructor(props: TooltipContentStateProps, root: TooltipRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
			deps: () => this.root.open.current,
		});

		$effect(() => {
			if (!this.root.open.current || this.root.disableHoverableContent) return;
			const { isPointerInTransit, onPointerExit } = useGraceArea(
				() => this.root.triggerNode,
				() => this.root.contentNode
			);

			this.root.provider.isPointerInTransit = isPointerInTransit;
			onPointerExit(() => {
				this.root.handleClose();
			});
		});

		onMountEffect(() =>
			executeCallbacks(
				on(window, "scroll", (e) => {
					const target = e.target as HTMLElement | null;
					if (!target) return;
					if (target.contains(this.root.triggerNode)) {
						this.root.handleClose();
					}
				}),
				TooltipOpenEvent.listen(window, this.root.handleClose)
			)
		);
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"data-state": this.root.stateAttr,
				"data-disabled": getDataDisabled(this.root.disabled),
				style: {
					pointerEvents: "auto",
					outline: "none",
				},
				[CONTENT_ATTR]: "",
			}) as const
	);
}

//
// CONTEXT METHODS
//

const TooltipProviderContext = new Context<TooltipProviderState>("Tooltip.Provider");
const TooltipRootContext = new Context<TooltipRootState>("Tooltip.Root");

export function useTooltipProvider(props: TooltipProviderStateProps) {
	return TooltipProviderContext.set(new TooltipProviderState(props));
}

export function useTooltipRoot(props: TooltipRootStateProps) {
	return TooltipRootContext.set(new TooltipRootState(props, TooltipProviderContext.get()));
}

export function useTooltipTrigger(props: TooltipTriggerStateProps) {
	return new TooltipTriggerState(props, TooltipRootContext.get());
}

export function useTooltipContent(props: TooltipContentStateProps) {
	return new TooltipContentState(props, TooltipRootContext.get());
}
