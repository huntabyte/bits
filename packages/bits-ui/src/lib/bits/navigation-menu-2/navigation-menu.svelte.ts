/**
 * Based on Radix UI's Navigation Menu
 * https://www.radix-ui.com/docs/primitives/components/navigation-menu
 */

import {
	type AnyFn,
	type ReadableBox,
	type ReadableBoxedValues,
	type WithRefProps,
	type WritableBoxedValues,
	box,
	onDestroyEffect,
	useRefById,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import { type Snippet, untrack } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import { type Direction, type Orientation, useId } from "$lib/shared/index.js";
import {
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import { noop } from "$lib/internal/noop.js";
import { getTabbableCandidates } from "$lib/internal/focus.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
} from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";
import { useResizeObserver } from "$lib/internal/use-resize-observer.svelte.js";
import { PreviousWithInit } from "$lib/internal/previous-with-init.svelte.js";
import { CustomEventDispatcher } from "$lib/internal/events.js";

const ROOT_ATTR = "data-navigation-menu-root";
const SUB_ATTR = "data-navigation-menu-sub";
const LIST_ATTR = "data-navigation-menu-list";
const ITEM_ATTR = "data-navigation-menu-item";
const TRIGGER_ATTR = "data-navigation-menu-trigger";
const LINK_ATTR = "data-navigation-menu-link";

type NavigationMenuProviderStateProps = ReadableBoxedValues<{
	dir: Direction;
	orientation: Orientation;
}> &
	WritableBoxedValues<{
		rootNavigationMenuRef: HTMLElement | null;
		value: string;
	}> & {
		isRootMenu: boolean;
		onTriggerEnter: (itemValue: string) => void;
		onTriggerLeave?: () => void;
		onContentEnter?: () => void;
		onContentLeave?: () => void;
		onItemSelect: (itemValue: string) => void;
		onItemDismiss: () => void;
	};

class NavigationMenuProviderState {
	isRootMenu: NavigationMenuProviderStateProps["isRootMenu"];
	value: NavigationMenuProviderStateProps["value"];
	previousValue: PreviousWithInit<string>;
	dir: NavigationMenuProviderStateProps["dir"];
	orientation: NavigationMenuProviderStateProps["orientation"];
	rootNavigationMenuRef: NavigationMenuProviderStateProps["rootNavigationMenuRef"];
	indicatorTrackRef = box<HTMLElement | null>(null);
	viewportRef = box<HTMLElement | null>(null);
	viewportContent = new SvelteMap<string, NavigationMenuItemState>();
	onTriggerEnter: NavigationMenuProviderStateProps["onTriggerEnter"];
	onTriggerLeave: () => void = noop;
	onContentEnter: () => void = noop;
	onContentLeave: () => void = noop;
	onItemSelect: NavigationMenuProviderStateProps["onItemSelect"];
	onItemDismiss: NavigationMenuProviderStateProps["onItemDismiss"];

	constructor(props: NavigationMenuProviderStateProps) {
		this.isRootMenu = props.isRootMenu;
		this.value = props.value;
		this.previousValue = new PreviousWithInit(() => this.value.current);
		this.dir = props.dir;
		this.orientation = props.orientation;
		this.rootNavigationMenuRef = props.rootNavigationMenuRef;
		this.onTriggerEnter = props.onTriggerEnter;
		this.onTriggerLeave = props.onTriggerLeave ?? noop;
		this.onContentEnter = props.onContentEnter ?? noop;
		this.onContentLeave = props.onContentLeave ?? noop;
		this.onItemDismiss = props.onItemDismiss;
		this.onItemSelect = props.onItemSelect;
	}

	onViewportContentChange(contentValue: string, item: NavigationMenuItemState) {
		this.viewportContent.set(contentValue, item);
	}

	onViewportContentRemove(contentValue: string) {
		if (!this.viewportContent.has(contentValue)) return;
		this.viewportContent.delete(contentValue);
	}
}

type NavigationMenuRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: string;
	}> &
		ReadableBoxedValues<{
			dir: Direction;
			orientation: Orientation;
			delayDuration: number;
			skipDelayDuration: number;
		}>
>;

class NavigationMenuRootState {
	id: NavigationMenuRootStateProps["id"];
	ref: NavigationMenuRootStateProps["ref"];
	value: NavigationMenuRootStateProps["value"];
	dir: NavigationMenuRootStateProps["dir"];
	orientation: NavigationMenuRootStateProps["orientation"];
	delayDuration: NavigationMenuRootStateProps["delayDuration"];
	skipDelayDuration: NavigationMenuRootStateProps["skipDelayDuration"];
	openTimer = $state(0);
	closeTimer = $state(0);
	skipDelayTimer = $state(0);
	isOpenDelayed = $state(true);
	provider: NavigationMenuProviderState;

	constructor(props: NavigationMenuRootStateProps) {
		this.id = props.id;
		this.ref = props.ref;
		this.value = props.value;
		this.dir = props.dir;
		this.orientation = props.orientation;
		this.delayDuration = props.delayDuration;
		this.skipDelayDuration = props.skipDelayDuration;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		onDestroyEffect(() => {
			window.clearTimeout(this.openTimer);
			window.clearTimeout(this.closeTimer);
			window.clearTimeout(this.skipDelayTimer);
		});

		this.provider = useNavigationMenuProvider({
			value: this.value,
			dir: this.dir,
			orientation: this.orientation,
			rootNavigationMenuRef: this.ref,
			isRootMenu: true,
			onTriggerEnter: (itemValue) => {
				return this.#onTriggerEnter(itemValue);
			},
			onTriggerLeave: () => this.#onTriggerLeave(),
			onContentEnter: () => this.#onContentEnter(),
			onContentLeave: () => this.#onContentLeave(),
			onItemSelect: (itemValue) => this.#onItemSelect(itemValue),
			onItemDismiss: () => this.#onItemDismiss(),
		});
	}

	#onTriggerEnter(itemValue: string) {
		window.clearTimeout(this.openTimer);
		if (this.isOpenDelayed) this.handleDelayedOpen(itemValue);
		else this.handleOpen(itemValue);
	}

	#onTriggerLeave() {
		window.clearTimeout(this.openTimer);
		this.startCloseTimer();
	}

	#onContentEnter() {
		window.clearTimeout(this.closeTimer);
	}

	#onContentLeave() {
		this.startCloseTimer();
	}

	#onItemSelect(itemValue: string) {
		if (this.value.current === itemValue) {
			this.setValue("");
		} else {
			this.setValue(itemValue);
		}
	}

	#onItemDismiss() {
		this.setValue("");
	}

	setValue(newValue: string) {
		this.value.current = newValue;
	}

	handleValueChange(newValue: string) {
		const isOpen = newValue !== "";
		const hasSkipDelayDuration = this.skipDelayDuration.current > 0;

		if (isOpen) {
			window.clearTimeout(this.skipDelayTimer);
			if (hasSkipDelayDuration) this.isOpenDelayed = false;
		} else {
			window.clearTimeout(this.skipDelayTimer);
			this.skipDelayTimer = window.setTimeout(
				() => (this.isOpenDelayed = true),
				this.skipDelayDuration.current
			);
		}
	}

	startCloseTimer() {
		window.clearTimeout(this.closeTimer);
		this.closeTimer = window.setTimeout(() => this.setValue(""), 150);
	}

	handleOpen(itemValue: string) {
		window.clearTimeout(this.closeTimer);
		this.setValue(itemValue);
	}

	handleDelayedOpen(itemValue: string) {
		const isOpenItem = this.value.current === itemValue;
		if (isOpenItem) {
			// If the item is already open (e.g. we're transitioning from the content to the trigger) then we want to clear the close timer immediately.
			window.clearTimeout(this.closeTimer);
		} else {
			this.openTimer = window.setTimeout(() => {
				window.clearTimeout(this.closeTimer);
				this.setValue(itemValue);
			}, this.delayDuration.current);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.orientation.current),
				dir: this.dir.current,
				[ROOT_ATTR]: "",
			}) as const
	);
}

type NavigationMenuSubStateProps = WithRefProps<
	WritableBoxedValues<{
		value: string;
	}> &
		ReadableBoxedValues<{
			orientation: Orientation;
		}>
>;

class NavigationMenuSubState {
	id: NavigationMenuSubStateProps["id"];
	ref: NavigationMenuSubStateProps["ref"];
	value: NavigationMenuSubStateProps["value"];
	context: NavigationMenuProviderState;
	orientation: NavigationMenuSubStateProps["orientation"];

	constructor(props: NavigationMenuSubStateProps, context: NavigationMenuProviderState) {
		this.id = props.id;
		this.ref = props.ref;
		this.value = props.value;
		this.orientation = props.orientation;
		this.context = context;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		useNavigationMenuProvider({
			isRootMenu: false,
			value: this.value,
			dir: this.context.dir,
			orientation: this.orientation,
			rootNavigationMenuRef: this.context.rootNavigationMenuRef,
			onTriggerEnter: (itemValue) => this.setValue(itemValue),
			onItemSelect: (itemValue) => this.setValue(itemValue),
			onItemDismiss: () => this.setValue(""),
		});
	}

	setValue(newValue: string) {
		this.value.current = newValue;
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.orientation.current),
				[SUB_ATTR]: "",
			}) as const
	);
}

type NavigationMenuListStateProps = WithRefProps;

class NavigationMenuListState {
	id: NavigationMenuListStateProps["id"];
	ref: NavigationMenuListStateProps["ref"];
	context: NavigationMenuProviderState;
	wrapperId = box.with(() => useId());
	wrapperRef = box<HTMLElement | null>(null);
	listTriggers = $state.raw<HTMLElement[]>([]);

	constructor(props: NavigationMenuListStateProps, context: NavigationMenuProviderState) {
		this.id = props.id;
		this.ref = props.ref;
		this.context = context;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		useRefById({
			id: this.wrapperId,
			ref: this.wrapperRef,
			onRefChange: (node) => {
				this.context.indicatorTrackRef.current = node;
			},
		});
	}

	registerTrigger(trigger: HTMLElement | null) {
		if (trigger) this.listTriggers.push(trigger);
		return () => {
			this.listTriggers = this.listTriggers.filter((t) => t.id !== trigger!.id);
		};
	}

	wrapperProps = $derived.by(
		() =>
			({
				id: this.wrapperId.current,
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.context.orientation.current),
				[LIST_ATTR]: "",
			}) as const
	);
}

type NavigationMenuItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
	}>
>;

export class NavigationMenuItemState {
	ref: NavigationMenuItemStateProps["ref"];
	id: NavigationMenuItemStateProps["id"];
	value: NavigationMenuItemStateProps["value"];
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	focusProxyNode = $state<HTMLElement | null>(null);
	restoreContentTabOrder: AnyFn = noop;
	wasEscapeClose = $state(false);
	contentId = $derived.by(() => this.contentNode?.id);
	triggerId = $derived.by(() => this.triggerNode?.id);
	listContext: NavigationMenuListState;
	contentChildren: ReadableBox<Snippet | undefined> = box(undefined);
	contentChild: ReadableBox<Snippet | undefined> = box(undefined);
	contentProps: ReadableBox<Record<string, unknown>> = box({});

	constructor(props: NavigationMenuItemStateProps, listContext: NavigationMenuListState) {
		this.ref = props.ref;
		this.id = props.id;
		this.value = props.value;
		this.listContext = listContext;
	}

	#handleContentEntry = (side: "start" | "end" = "start") => {
		if (!this.contentNode) return;
		this.restoreContentTabOrder();
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length) focusFirst(side === "start" ? candidates : candidates.reverse());
	};

	#handleContextExit = () => {
		if (!this.contentNode) return;
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length) this.restoreContentTabOrder = removeFromTabOrder(candidates);
	};

	onEntryKeydown = this.#handleContentEntry;
	onFocusProxyEnter = this.#handleContentEntry;
	onRootContentClose = this.#handleContextExit;
	onContentFocusOutside = this.#handleContextExit;

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				[ITEM_ATTR]: "",
			}) as const
	);
}

type NavigationMenuTriggerStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>;

class NavigationMenuTriggerState {
	id: NavigationMenuTriggerStateProps["id"];
	ref: NavigationMenuTriggerStateProps["ref"];
	focusProxyId = box.with(() => useId());
	focusProxyRef = box<HTMLElement | null>(null);
	disabled: NavigationMenuTriggerStateProps["disabled"];
	context: NavigationMenuProviderState;
	itemContext: NavigationMenuItemState;
	listContext: NavigationMenuListState;
	hasPointerMoveOpened = $state(false);
	wasClickClose = $state(false);
	open = $derived.by(() => this.itemContext.value.current === this.context.value.current);
	focusProxyMounted = $state(false);

	constructor(
		props: NavigationMenuTriggerStateProps,
		context: {
			provider: NavigationMenuProviderState;
			item: NavigationMenuItemState;
			list: NavigationMenuListState;
		}
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.disabled = props.disabled;
		this.context = context.provider;
		this.itemContext = context.item;
		this.listContext = context.list;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		useRefById({
			id: this.focusProxyId,
			ref: this.focusProxyRef,
			onRefChange: (node) => {
				this.itemContext.focusProxyNode = node;
			},
			deps: () => this.focusProxyMounted,
		});

		$effect(() => {
			const node = this.ref.current;

			if (node) {
				const unregister = this.listContext.registerTrigger(node);

				return () => {
					unregister();
				};
			}
		});

		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.focusProxyOnFocus = this.focusProxyOnFocus.bind(this);
	}

	onpointerenter(_: BitsPointerEvent<HTMLButtonElement>) {
		this.wasClickClose = false;
		this.itemContext.wasEscapeClose = false;
	}

	onpointermove = whenMouse(() => {
		if (
			this.disabled.current ||
			this.wasClickClose ||
			this.itemContext.wasEscapeClose ||
			this.hasPointerMoveOpened
		) {
			return;
		}
		this.context.onTriggerEnter(this.itemContext.value.current);
		this.hasPointerMoveOpened = true;
	});

	onpointerleave = whenMouse(() => {
		if (this.disabled.current) return;
		this.context.onTriggerLeave();
		this.hasPointerMoveOpened = false;
	});

	onclick(_: BitsMouseEvent<HTMLButtonElement>) {
		this.context.onItemSelect(this.itemContext.value.current);
		this.wasClickClose = this.open;
	}

	onkeydown(e: BitsKeyboardEvent<HTMLButtonElement>) {
		const verticalEntryKey =
			this.context.dir.current === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT;
		const entryKey = { horizontal: kbd.ARROW_DOWN, vertical: verticalEntryKey }[
			this.context.orientation.current
		];
		if (this.open && e.key === entryKey) {
			this.itemContext.onEntryKeydown();
			// prevent focus group from handling the event
			e.preventDefault();
		}
	}

	focusProxyOnFocus(e: BitsFocusEvent) {
		const content = this.itemContext.contentNode;
		const prevFocusedElement = e.relatedTarget as HTMLElement | null;
		const wasTriggerFocused = this.ref.current && prevFocusedElement === this.ref.current;
		const wasFocusFromContent = content?.contains(prevFocusedElement);

		if (wasTriggerFocused || !wasFocusFromContent) {
			this.itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				disabled: this.disabled.current,
				"data-disabled": getDataDisabled(Boolean(this.disabled.current)),
				"data-state": getDataOpenClosed(this.open),
				"data-value": this.itemContext.value.current,
				"aria-expanded": getAriaExpanded(this.open),
				"aria-controls": this.itemContext.contentId,
				[TRIGGER_ATTR]: "",
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onpointerenter: this.onpointerenter,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);

	focusProxyProps = $derived.by(
		() =>
			({
				"aria-hidden": "true",
				tabindex: 0,
				onfocus: this.focusProxyOnFocus,
			}) as const
	);

	restructureSpanProps = $derived.by(
		() =>
			({
				"aria-owns": this.itemContext.contentId,
			}) as const
	);
}

type NavigationMenuLinkStateProps = WithRefProps &
	ReadableBoxedValues<{
		active: boolean;
		onSelect: (e: Event) => void;
	}>;

const LINK_SELECT_EVENT = new CustomEventDispatcher("bitsLinkSelect", {
	bubbles: true,
	cancelable: true,
});

const ROOT_CONTENT_DISMISS_EVENT = new CustomEventDispatcher("bitsRootContentDismiss", {
	cancelable: true,
	bubbles: true,
});

class NavigationMenuLinkState {
	id: NavigationMenuLinkStateProps["id"];
	ref: NavigationMenuLinkStateProps["ref"];
	active: NavigationMenuLinkStateProps["active"];
	onSelect: NavigationMenuLinkStateProps["onSelect"];

	constructor(props: NavigationMenuLinkStateProps, context: NavigationMenuProviderState) {
		this.id = props.id;
		this.ref = props.ref;
		this.active = props.active;
		this.onSelect = props.onSelect;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		this.onclick = this.onclick.bind(this);
	}

	onclick(e: BitsMouseEvent<HTMLAnchorElement>) {
		const currTarget = e.currentTarget;

		LINK_SELECT_EVENT.listen(currTarget, (e) => this.onSelect.current(e), { once: true });
		const linkSelectEvent = LINK_SELECT_EVENT.dispatch(currTarget);

		if (!linkSelectEvent.defaultPrevented && !e.metaKey) {
			ROOT_CONTENT_DISMISS_EVENT.dispatch(currTarget);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-active": this.active.current ? "" : undefined,
				"aria-current": this.active.current ? "page" : undefined,
				onclick: this.onclick,
				[LINK_ATTR]: "",
			}) as const
	);
}

type NavigationMenuIndicatorStateProps = WithRefProps;

class NavigationMenuIndicatorState {
	context: NavigationMenuProviderState;
	isVisible = $derived.by(() => Boolean(this.context.value.current));

	constructor(context: NavigationMenuProviderState) {
		this.context = context;
	}
}

class NavigationMenuIndicatorImplState {
	id: NavigationMenuIndicatorStateProps["id"];
	ref: NavigationMenuIndicatorStateProps["ref"];
	context: NavigationMenuProviderState;
	listContext: NavigationMenuListState;
	position = $state.raw<{ size: number; offset: number } | null>(null);
	isHorizontal = $derived.by(() => this.context.orientation.current === "horizontal");
	isVisible = $derived.by(() => Boolean(this.context.value.current));
	activeTrigger = $derived.by(() => {
		const items = this.listContext.listTriggers;
		const triggerNode = items.find(
			(item) => item.getAttribute("data-value") === this.context.value.current
		);
		return triggerNode ?? null;
	});
	shouldRender = $derived.by(() => this.position !== null);

	constructor(
		props: NavigationMenuIndicatorStateProps,
		context: {
			provider: NavigationMenuProviderState;
			list: NavigationMenuListState;
		}
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.context = context.provider;
		this.listContext = context.list;

		useRefById({
			id: this.id,
			ref: this.ref,
			deps: () => this.context.value.current,
		});

		useResizeObserver(() => this.activeTrigger, this.handlePositionChange);
		useResizeObserver(() => this.context.indicatorTrackRef.current, this.handlePositionChange);
	}

	handlePositionChange = () => {
		if (!this.activeTrigger) return;
		this.position = {
			size: this.isHorizontal
				? this.activeTrigger.offsetWidth
				: this.activeTrigger.offsetHeight,
			offset: this.isHorizontal
				? this.activeTrigger.offsetLeft
				: this.activeTrigger.offsetTop,
		};
	};

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-state": this.isVisible ? "visible" : "hidden",
				"data-orientation": getDataOrientation(this.context.orientation.current),
				style: this.position
					? {
							position: "absolute",
							...(this.isHorizontal
								? {
										left: 0,
										width: `${this.position.size}px`,
										transform: `translateX(${this.position.offset}px)`,
									}
								: {
										top: 0,
										height: `${this.position.size}px`,
										transform: `translateY(${this.position.offset}px)`,
									}),
						}
					: undefined,
			}) as const
	);
}

type NavigationMenuContentStateProps = WithRefProps;

class NavigationMenuContentState {
	id: NavigationMenuContentStateProps["id"];
	ref: NavigationMenuContentStateProps["ref"];
	context: NavigationMenuProviderState;
	itemContext: NavigationMenuItemState;
	listContext: NavigationMenuListState;
	open = $derived.by(() => this.itemContext.value.current === this.context.value.current);
	value = $derived.by(() => this.itemContext.value.current);

	constructor(
		props: NavigationMenuContentStateProps,
		context: {
			provider: NavigationMenuProviderState;
			item: NavigationMenuItemState;
			list: NavigationMenuListState;
		}
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.context = context.provider;
		this.itemContext = context.item;
		this.listContext = context.list;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		this.onpointerenter = this.onpointerenter.bind(this);
	}

	onpointerenter(_: BitsPointerEvent) {
		this.context.onContentEnter;
	}

	onpointerleave = whenMouse(() => {
		this.context.onContentLeave();
	});

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				onpointerenter: this.onpointerenter,
				onpointerleave: this.onpointerleave,
			}) as const
	);
}

type MotionAttribute = "to-start" | "to-end" | "from-start" | "from-end";
type NavigationMenuContentImplStateProps = WithRefProps;

class NavigationMenuContentImplState {
	ref: NavigationMenuContentImplStateProps["ref"];
	id: NavigationMenuContentImplStateProps["id"];
	context: NavigationMenuProviderState;
	itemContext: NavigationMenuItemState;
	listContext: NavigationMenuListState;
	prevMotionAttribute = $state<MotionAttribute | null>(null);

	motionAttribute: MotionAttribute | null = $derived.by(() => {
		const items = this.listContext.listTriggers;
		const values = items.map((item) => item.getAttribute("data-value")).filter(Boolean);
		if (this.context.dir.current === "rtl") values.reverse();
		const index = values.indexOf(this.context.value.current);
		const prevIndex = values.indexOf(this.context.previousValue.current);
		const isSelected = this.itemContext.value.current === this.context.value.current;
		const wasSelected = prevIndex === values.indexOf(this.itemContext.value.current);

		// We only want to update selected and the last selected content
		// this avoids animations being interrupted outside of that range
		if (!isSelected && !wasSelected) return untrack(() => this.prevMotionAttribute);

		const attribute = (() => {
			// Don't provide a direction on the initial open
			if (index !== prevIndex) {
				// If we're moving to this item from another
				if (isSelected && prevIndex !== -1)
					return index > prevIndex ? "from-end" : "from-start";
				// If we're leaving this item for another
				if (wasSelected && index !== -1) return index > prevIndex ? "to-start" : "to-end";
			}
			// Otherwise we're entering from close or leaving the list
			// entirely and should not animate in any direction
			return null;
		})();

		untrack(() => (this.prevMotionAttribute = attribute));
		return attribute;
	});

	constructor(props: NavigationMenuContentImplStateProps, itemContext: NavigationMenuItemState) {
		this.ref = props.ref;
		this.id = props.id;
		this.itemContext = itemContext;
		this.listContext = itemContext.listContext;
		this.context = itemContext.listContext.context;

		useRefById({
			id: this.id,
			ref: this.ref,
			deps: () => this.context.value.current,
		});

		watch(
			[
				() => this.itemContext.value.current,
				() => this.itemContext.triggerNode,
				() => this.ref.current,
			],
			() => {
				const content = this.ref.current;
				if (!(content && this.context.isRootMenu)) return;

				const handleClose = () => {
					this.context.onItemDismiss();
					this.itemContext.onRootContentClose();
					if (content.contains(document.activeElement)) {
						this.itemContext.triggerNode?.focus();
					}
				};
				const removeListener = ROOT_CONTENT_DISMISS_EVENT.listen(content, handleClose);

				return () => {
					removeListener();
				};
			}
		);

		this.onFocusOutside = this.onFocusOutside.bind(this);
		this.onInteractOutside = this.onInteractOutside.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onEscapeKeydown = this.onEscapeKeydown.bind(this);
	}

	onFocusOutside(e: Event) {
		this.itemContext.onContentFocusOutside();
		const target = e.target as HTMLElement;
		// only dismiss content when focus moves outside of the menu
		if (this.context.rootNavigationMenuRef.current?.contains(target)) {
			e.preventDefault();
		}
	}

	onInteractOutside(e: PointerEvent) {
		const target = e.target as HTMLElement;
		const isTrigger = this.listContext.listTriggers.some((trigger) => trigger.contains(target));
		const isRootViewport =
			this.context.isRootMenu && this.context.viewportRef.current?.contains(target);
		if (isTrigger || isRootViewport || !this.context.isRootMenu) e.preventDefault();
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isMetaKey = e.altKey || e.ctrlKey || e.metaKey;
		const isTabKey = e.key === kbd.TAB && !isMetaKey;
		if (!isTabKey) return;
		const candidates = getTabbableCandidates(e.currentTarget);
		const focusedElement = document.activeElement;
		const index = candidates.findIndex((candidate) => candidate === focusedElement);
		const isMovingBackwards = e.shiftKey;
		const nextCandidates = isMovingBackwards
			? candidates.slice(0, index).reverse()
			: candidates.slice(index + 1, candidates.length);

		if (focusFirst(nextCandidates)) {
			// prevent browser tab keydown because we've handled focus
			e.preventDefault();
		} else {
			// If we can't focus that means we're at the edges
			// so focus the proxy and let browser handle
			// tab/shift+tab keypress on the proxy instead
			this.itemContext.focusProxyNode?.focus();
		}
	}

	onEscapeKeydown(_: KeyboardEvent) {
		// prevent the dropdown from reopening after the
		// escape key has been pressed
		this.itemContext.wasEscapeClose = true;
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"aria-labelledby": this.itemContext.triggerId,
				"data-motion": this.motionAttribute ?? undefined,
				"data-orientation": getDataOrientation(this.context.orientation.current),
			}) as const
	);
}

type NavigationMenuViewportContentMounterStateProps = ReadableBoxedValues<{
	children: Snippet | undefined;
	child: Snippet | undefined;
	props: Record<string, unknown>;
}>;

class NavigationMenuViewportContentMounterState {
	context: NavigationMenuProviderState;
	contentContext: NavigationMenuContentState;

	constructor(
		props: NavigationMenuViewportContentMounterStateProps,
		context: NavigationMenuProviderState,
		contentContext: NavigationMenuContentState
	) {
		this.context = context;
		this.contentContext = contentContext;
		this.contentContext.itemContext.contentChildren = props.children;
		this.contentContext.itemContext.contentChild = props.child;
		this.contentContext.itemContext.contentProps = props.props;

		$effect(() => {
			this.context.onViewportContentChange(
				this.contentContext.value,
				this.contentContext.itemContext
			);
		});

		onDestroyEffect(() => {
			this.context.onViewportContentRemove(this.contentContext.value);
		});
	}
}

class NavigationMenuViewportState {
	context: NavigationMenuProviderState;
	open = $derived.by(() => Boolean(this.context.value.current));

	constructor(context: NavigationMenuProviderState) {
		this.context = context;
	}
}

type NavigationMenuViewportImplStateProps = WithRefProps;

class NavigationMenuViewportImplState {
	id: NavigationMenuViewportImplStateProps["id"];
	ref: NavigationMenuViewportImplStateProps["ref"];
	context: NavigationMenuProviderState;
	size = $state<{ width: number; height: number } | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	viewportWidth = $derived.by(() => (this.size ? `${this.size.width}px` : undefined));
	viewportHeight = $derived.by(() => (this.size ? `${this.size.height}px` : undefined));
	open = $derived.by(() => Boolean(this.context.value.current));
	// We persist the last active content value as the viewport may be animating out
	// and we want the content to remain mounted for the lifecycle of the viewport.
	activeContentValue = $derived.by(() =>
		this.open ? this.context.value.current : this.context.previousValue.current
	);

	constructor(props: NavigationMenuViewportImplStateProps, context: NavigationMenuProviderState) {
		this.id = props.id;
		this.ref = props.ref;
		this.context = context;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.context.viewportRef.current = node;
			},
		});

		/**
		 * Update viewport size to match the active content node.
		 * We prefer offset dimensions over `getBoundingClientRect` as the latter respects CSS transform.
		 * For example, if content animates in from `scale(0.5)` the dimensions would be anything
		 * from `0.5` to `1` of the intended size.
		 */
		const handleSizeChange = () => {
			if (this.contentNode) {
				this.size = {
					width: this.contentNode.offsetWidth,
					height: this.contentNode.offsetHeight,
				};
			}
		};

		useResizeObserver(() => this.contentNode, handleSizeChange);
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-state": getDataOpenClosed(this.open),
				"data-orientation": getDataOrientation(this.context.orientation.current),
				style: {
					pointerEvents: !this.open && this.context.isRootMenu ? "none" : undefined,
					"--bits-navigation-menu-viewport-width": this.viewportWidth,
					"--bits-navigation-menu-viewport-height": this.viewportHeight,
				},
				onpointerenter: this.context.onContentEnter,
				onpointerleave: this.context.onContentLeave,
			}) as const
	);
}

const NavigationMenuProviderContext = new Context<NavigationMenuProviderState>(
	"NavigationMenu.Root"
);

const NavigationMenuItemContext = new Context<NavigationMenuItemState>("NavigationMenu.Item");

const NavigationMenuListContext = new Context<NavigationMenuListState>("NavigationMenu.List");

const NavigationMenuContentContext = new Context<NavigationMenuContentState>(
	"NavigationMenu.Content"
);

export function useNavigationMenuRoot(props: NavigationMenuRootStateProps) {
	return new NavigationMenuRootState(props);
}

export function useNavigationMenuProvider(props: NavigationMenuProviderStateProps) {
	return NavigationMenuProviderContext.set(new NavigationMenuProviderState(props));
}

export function useNavigationMenuSub(props: NavigationMenuSubStateProps) {
	return new NavigationMenuSubState(props, NavigationMenuProviderContext.get());
}

export function useNavigationMenuList(props: NavigationMenuListStateProps) {
	return NavigationMenuListContext.set(
		new NavigationMenuListState(props, NavigationMenuProviderContext.get())
	);
}

export function useNavigationMenuItem(props: NavigationMenuItemStateProps) {
	return NavigationMenuItemContext.set(
		new NavigationMenuItemState(props, NavigationMenuListContext.get())
	);
}

export function useNavigationMenuIndicatorImpl(props: NavigationMenuIndicatorStateProps) {
	return new NavigationMenuIndicatorImplState(props, {
		provider: NavigationMenuProviderContext.get(),
		list: NavigationMenuListContext.get(),
	});
}

export function useNavigationMenuTrigger(props: NavigationMenuTriggerStateProps) {
	return new NavigationMenuTriggerState(props, {
		provider: NavigationMenuProviderContext.get(),
		item: NavigationMenuItemContext.get(),
		list: NavigationMenuListContext.get(),
	});
}

export function useNavigationMenuContent(props: NavigationMenuContentStateProps) {
	return NavigationMenuContentContext.set(
		new NavigationMenuContentState(props, {
			provider: NavigationMenuProviderContext.get(),
			item: NavigationMenuItemContext.get(),
			list: NavigationMenuListContext.get(),
		})
	);
}

export function useNavigationMenuLink(props: NavigationMenuLinkStateProps) {
	return new NavigationMenuLinkState(props, NavigationMenuProviderContext.get());
}

export function useNavigationMenuContentImpl(
	props: NavigationMenuContentImplStateProps,
	itemState: NavigationMenuItemState = NavigationMenuItemContext.get()
) {
	return new NavigationMenuContentImplState(props, itemState);
}

export function useNavigationMenuViewport() {
	return new NavigationMenuViewportState(NavigationMenuProviderContext.get());
}

export function useNavigationMenuViewportImpl(props: NavigationMenuViewportImplStateProps) {
	return new NavigationMenuViewportImplState(props, NavigationMenuProviderContext.get());
}

export function useNavigationMenuViewportContentMounter(
	props: NavigationMenuViewportContentMounterStateProps
) {
	return new NavigationMenuViewportContentMounterState(
		props,
		NavigationMenuProviderContext.get(),
		NavigationMenuContentContext.get()
	);
}

export function useNavigationMenuIndicator() {
	return new NavigationMenuIndicatorState(NavigationMenuProviderContext.get());
}

//

function focusFirst(candidates: HTMLElement[]) {
	const previouslyFocusedElement = document.activeElement;
	return candidates.some((candidate) => {
		// if focus is already where we want to go, we don't want to keep going through the candidates
		if (candidate === previouslyFocusedElement) return true;
		candidate.focus();
		return document.activeElement !== previouslyFocusedElement;
	});
}

function removeFromTabOrder(candidates: HTMLElement[]) {
	candidates.forEach((candidate) => {
		candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
		candidate.setAttribute("tabindex", "-1");
	});
	return () => {
		candidates.forEach((candidate) => {
			const prevTabIndex = candidate.dataset.tabindex as string;
			candidate.setAttribute("tabindex", prevTabIndex);
		});
	};
}

type BitsPointerEventHandler<T extends HTMLElement = HTMLElement> = (
	e: BitsPointerEvent<T>
) => void;

function whenMouse<T extends HTMLElement = HTMLElement>(
	handler: BitsPointerEventHandler<T>
): BitsPointerEventHandler<T> {
	return (e) => (e.pointerType === "mouse" ? handler(e) : undefined);
}
