import {
	afterTick,
	box,
	executeCallbacks,
	mergeProps,
	onDestroyEffect,
	useRefById,
} from "svelte-toolbelt";
import { Context, IsFocusWithin, watch } from "runed";
import { on } from "svelte/events";
import {
	FIRST_LAST_KEYS,
	type GraceIntent,
	LAST_KEYS,
	SELECTION_KEYS,
	SUB_OPEN_KEYS,
	type Side,
	getCheckedState,
	isMouseEvent,
} from "./utils.js";
import { focusFirst } from "$lib/internal/focus.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { CustomEventDispatcher } from "$lib/internal/events.js";
import type {
	AnyFn,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { useDOMTypeahead } from "$lib/internal/use-dom-typeahead.svelte.js";
import { isElement, isElementOrSVGElement, isHTMLElement } from "$lib/internal/is.js";
import { useRovingFocus } from "$lib/internal/use-roving-focus.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	getAriaChecked,
	getAriaDisabled,
	getAriaExpanded,
	getAriaOrientation,
	getDataDisabled,
	getDataOpenClosed,
} from "$lib/internal/attrs.js";
import type { Direction } from "$lib/shared/index.js";
import { isPointerInGraceArea, makeHullFromElements } from "$lib/internal/polygon.js";

export const CONTEXT_MENU_TRIGGER_ATTR = "data-context-menu-trigger";

const MenuRootContext = new Context<MenuRootState>("Menu.Root");
const MenuMenuContext = new Context<MenuMenuState>("Menu.Root | Menu.Sub");
const MenuContentContext = new Context<MenuContentState>("Menu.Content");
const MenuGroupContext = new Context<MenuGroupState | MenuRadioGroupState>(
	"Menu.Group | Menu.RadioGroup"
);
const MenuRadioGroupContext = new Context<MenuRadioGroupState>("Menu.RadioGroup");

type MenuVariant = "context-menu" | "dropdown-menu" | "menubar";

export type MenuRootStateProps = ReadableBoxedValues<{
	dir: Direction;
	variant: MenuVariant;
}> & {
	onClose: AnyFn;
};

export const MenuOpenEvent = new CustomEventDispatcher("bitsmenuopen", {
	bubbles: false,
	cancelable: true,
});

class MenuRootState {
	onClose: MenuRootStateProps["onClose"];
	variant: MenuRootStateProps["variant"];
	isUsingKeyboard = $state(false);
	dir: MenuRootStateProps["dir"];

	constructor(props: MenuRootStateProps) {
		this.onClose = props.onClose;
		this.dir = props.dir;
		this.variant = props.variant;

		$effect(() => {
			const callbacksToDispose: AnyFn[] = [];

			const handlePointer = (_: PointerEvent) => {
				this.isUsingKeyboard = false;
			};

			const handleKeydown = (_: KeyboardEvent) => {
				this.isUsingKeyboard = true;

				const disposePointerDown = on(document, "pointerdown", handlePointer, {
					capture: true,
					once: true,
				});
				const disposePointerMove = on(document, "pointermove", handlePointer, {
					capture: true,
					once: true,
				});

				callbacksToDispose.push(disposePointerDown, disposePointerMove);
			};

			const disposeKeydown = on(document, "keydown", handleKeydown, {
				capture: true,
			});
			callbacksToDispose.push(disposeKeydown);

			return () => {
				executeCallbacks(callbacksToDispose);
			};
		});
	}

	getAttr(name: string) {
		return `data-${this.variant.current}-${name}`;
	}
}

type MenuMenuStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class MenuMenuState {
	root: MenuRootState;
	open: MenuMenuStateProps["open"];
	contentId = box.with<string>(() => "");
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	parentMenu?: MenuMenuState;

	constructor(props: MenuMenuStateProps, root: MenuRootState, parentMenu?: MenuMenuState) {
		this.root = root;
		this.open = props.open;
		this.parentMenu = parentMenu;

		if (parentMenu) {
			watch(
				() => parentMenu.open,
				(isOpen) => {
					if (isOpen) return;
					this.open.current = false;
				}
			);
		}
	}

	toggleOpen() {
		this.open.current = !this.open.current;
	}

	onOpen() {
		this.open.current = true;
	}

	onClose() {
		this.open.current = false;
	}
}

type MenuContentStateProps = ReadableBoxedValues<{
	id: string;
	loop: boolean;
	isMounted: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class MenuContentState {
	#id: MenuContentStateProps["id"];
	contentRef: MenuContentStateProps["ref"];
	parentMenu: MenuMenuState;
	search = $state("");
	#loop: MenuContentStateProps["loop"];
	#timer = $state(0);
	pointerGraceTimer = $state(0);
	#pointerGraceIntent = $state<GraceIntent | null>(null);
	#pointerDir = $state<Side>("right");
	#lastPointerX = $state(0);
	#handleTypeaheadSearch: ReturnType<typeof useDOMTypeahead>["handleTypeaheadSearch"];
	rovingFocusGroup: ReturnType<typeof useRovingFocus>;
	isMounted: MenuContentStateProps["isMounted"];
	isFocusWithin = new IsFocusWithin(() => this.parentMenu.contentNode ?? undefined);

	constructor(props: MenuContentStateProps, parentMenu: MenuMenuState) {
		this.#id = props.id;
		this.#loop = props.loop;
		this.parentMenu = parentMenu;
		this.parentMenu.contentId = props.id;
		this.contentRef = props.ref;
		this.isMounted = props.isMounted;

		this.onkeydown = this.onkeydown.bind(this);
		this.onblur = this.onblur.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.handleInteractOutside = this.handleInteractOutside.bind(this);

		useRefById({
			id: this.#id,
			ref: this.contentRef,
			deps: () => this.parentMenu.open.current,
			onRefChange: (node) => {
				if (this.parentMenu.contentNode !== node) {
					this.parentMenu.contentNode = node;
				}
			},
		});

		onDestroyEffect(() => {
			window.clearTimeout(this.#timer);
		});

		this.#handleTypeaheadSearch = useDOMTypeahead().handleTypeaheadSearch;
		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.parentMenu.contentId,
			candidateAttr: this.parentMenu.root.getAttr("item"),
			loop: this.#loop,
			orientation: box.with(() => "vertical"),
		});

		watch(
			() => this.parentMenu.contentNode,
			(contentNode) => {
				if (!contentNode) return;
				const handler = () => {
					afterTick(() => {
						if (!this.parentMenu.root.isUsingKeyboard) return;
						this.rovingFocusGroup.focusFirstCandidate();
					});
				};
				return MenuOpenEvent.listen(contentNode, handler);
			}
		);
	}

	#getCandidateNodes() {
		const node = this.parentMenu.contentNode;
		if (!node) return [];
		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(
				`[${this.parentMenu.root.getAttr("item")}]:not([data-disabled])`
			)
		);
		return candidates;
	}

	#isPointerMovingToSubmenu(e: BitsPointerEvent) {
		const isMovingTowards = this.#pointerDir === this.#pointerGraceIntent?.side;
		return isMovingTowards && isPointerInGraceArea(e, this.#pointerGraceIntent?.area);
	}

	onPointerGraceIntentChange(intent: GraceIntent | null) {
		this.#pointerGraceIntent = intent;
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.defaultPrevented) return;

		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isKeydownInside =
			target.closest(`[${this.parentMenu.root.getAttr("content")}]`)?.id ===
			this.parentMenu.contentId.current;
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
		if (kbdFocusedEl) return;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		const candidateNodes = this.#getCandidateNodes();

		if (isKeydownInside) {
			// menus do not respect the tab key
			if (e.key === kbd.TAB) e.preventDefault();
			if (!isModifierKey && isCharacterKey) {
				this.#handleTypeaheadSearch(e.key, candidateNodes);
			}
		}

		// focus first/last based on key pressed
		if ((e.target as HTMLElement)?.id !== this.parentMenu.contentId.current) return;

		if (!FIRST_LAST_KEYS.includes(e.key)) return;
		e.preventDefault();

		if (LAST_KEYS.includes(e.key)) {
			candidateNodes.reverse();
		}
		focusFirst(candidateNodes);
	}

	onblur(e: BitsFocusEvent) {
		if (!isElement(e.currentTarget)) return;
		if (!isElement(e.target)) return;
		// clear search buffer when leaving the menu
		if (!e.currentTarget.contains?.(e.target)) {
			window.clearTimeout(this.#timer);
			this.search = "";
		}
	}

	onfocus(_: BitsFocusEvent) {
		if (!this.parentMenu.root.isUsingKeyboard) return;
		afterTick(() => this.rovingFocusGroup.focusFirstCandidate());
	}

	onpointermove(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		const target = e.target;
		if (!isElement(target)) return;
		const pointerXHasChanged = this.#lastPointerX !== e.clientX;
		const currentTarget = e.currentTarget;
		if (!isElement(currentTarget)) return;

		// We don't use `event.movementX` for this check because Safari will
		// always return `0` on a pointer event.
		if (currentTarget.contains(target) && pointerXHasChanged) {
			const newDir = e.clientX > this.#lastPointerX ? "right" : "left";
			this.#pointerDir = newDir;
			this.#lastPointerX = e.clientX;
		}
	}

	onItemEnter(e: BitsPointerEvent) {
		if (this.#isPointerMovingToSubmenu(e)) return true;
		return false;
	}

	onItemLeave(e: BitsPointerEvent) {
		if (this.#isPointerMovingToSubmenu(e)) return;
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus();
		this.rovingFocusGroup.setCurrentTabStopId("");
	}

	onTriggerLeave(e: BitsPointerEvent) {
		if (this.#isPointerMovingToSubmenu(e)) return true;
		return false;
	}

	onOpenAutoFocus = (e: Event) => {
		if (e.defaultPrevented) return;
		e.preventDefault();
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus();
	};

	handleInteractOutside(e: PointerEvent) {
		if (!isElementOrSVGElement(e.target)) return;
		const triggerId = this.parentMenu.triggerNode?.id;
		if (e.target.id === triggerId) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${triggerId}`)) {
			e.preventDefault();
		}
	}

	snippetProps = $derived.by(() => ({ open: this.parentMenu.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "menu",
				"aria-orientation": getAriaOrientation("vertical"),
				[this.parentMenu.root.getAttr("content")]: "",
				"data-state": getDataOpenClosed(this.parentMenu.open.current),
				onkeydown: this.onkeydown,
				onblur: this.onblur,
				onpointermove: this.onpointermove,
				onfocus: this.onfocus,
				dir: this.parentMenu.root.dir.current,
				style: {
					pointerEvents: "auto",
				},
			}) as const
	);
}

type MenuItemSharedStateProps = ReadableBoxedValues<{
	disabled: boolean;
	id: string;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class MenuItemSharedState {
	content: MenuContentState;
	ref: MenuItemSharedStateProps["ref"];
	id: MenuItemSharedStateProps["id"];
	disabled: MenuItemSharedStateProps["disabled"];
	#isFocused = $state(false);

	constructor(props: MenuItemSharedStateProps, content: MenuContentState) {
		this.content = content;
		this.id = props.id;
		this.disabled = props.disabled;
		this.ref = props.ref;
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);

		useRefById({
			id: this.id,
			ref: this.ref,
			deps: () => this.content.isMounted.current,
		});
	}

	onpointermove(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;

		if (this.disabled.current) {
			this.content.onItemLeave(e);
		} else {
			const defaultPrevented = this.content.onItemEnter(e);
			if (defaultPrevented) return;
			const item = e.currentTarget;
			if (!isHTMLElement(item)) return;
			item.focus();
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		afterTick(() => {
			if (e.defaultPrevented) return;
			if (!isMouseEvent(e)) return;
			this.content.onItemLeave(e);
		});
	}

	onfocus(e: BitsFocusEvent) {
		afterTick(() => {
			if (e.defaultPrevented || this.disabled.current) return;
			this.#isFocused = true;
		});
	}

	onblur(e: BitsFocusEvent) {
		afterTick(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				tabindex: -1,
				role: "menuitem",
				"aria-disabled": getAriaDisabled(this.disabled.current),
				"data-disabled": getDataDisabled(this.disabled.current),
				"data-highlighted": this.#isFocused ? "" : undefined,
				[this.content.parentMenu.root.getAttr("item")]: "",
				//
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onfocus: this.onfocus,
				onblur: this.onblur,
			}) as const
	);
}

type MenuItemStateProps = ReadableBoxedValues<{
	onSelect: AnyFn;
	closeOnSelect: boolean;
}>;

class MenuItemState {
	#item: MenuItemSharedState;
	#onSelect: MenuItemStateProps["onSelect"];
	#closeOnSelect: MenuItemStateProps["closeOnSelect"];
	#isPointerDown = $state(false);
	root: MenuRootState;

	constructor(props: MenuItemStateProps, item: MenuItemSharedState) {
		this.#item = item;
		this.root = item.content.parentMenu.root;
		this.#onSelect = props.onSelect;
		this.#closeOnSelect = props.closeOnSelect;

		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}

	#handleSelect() {
		if (this.#item.disabled.current) return;
		const selectEvent = new CustomEvent("menuitemselect", { bubbles: true, cancelable: true });
		this.#onSelect.current(selectEvent);
		afterTick(() => {
			if (selectEvent.defaultPrevented) {
				this.#item.content.parentMenu.root.isUsingKeyboard = false;
				return;
			}
			if (this.#closeOnSelect.current) {
				this.#item.content.parentMenu.root.onClose();
			}
		});
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.#item.content.search !== "";
		if (this.#item.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;
		if (SELECTION_KEYS.includes(e.key)) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget.click();
			/**
			 * We prevent default browser behavior for selection keys as they should trigger
			 * a selection only:
			 * - prevents space from scrolling the page.
			 * - if keydown causes focus to move, prevents keydown from firing on the new target.
			 */
			e.preventDefault();
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.#item.disabled.current) return;
		this.#handleSelect();
	}

	onpointerup(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!this.#isPointerDown) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget?.click();
		}
	}

	onpointerdown(_: BitsPointerEvent) {
		this.#isPointerDown = true;
	}

	props = $derived.by(() =>
		mergeProps(this.#item.props, {
			onclick: this.onclick,
			onpointerdown: this.onpointerdown,
			onpointerup: this.onpointerup,
			onkeydown: this.onkeydown,
		})
	);
}

class MenuSubTriggerState {
	#item: MenuItemSharedState;
	// The menu this sub-trigger item belongs within
	#content: MenuContentState;
	// the menu this sub-trigger item opens
	#submenu: MenuMenuState;
	#openTimer = $state<number | null>(null);

	constructor(item: MenuItemSharedState, content: MenuContentState, submenu: MenuMenuState) {
		this.#item = item;
		this.#content = content;
		this.#submenu = submenu;

		this.onpointerleave = this.onpointerleave.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		onDestroyEffect(() => {
			this.#clearOpenTimer();
		});

		useRefById({
			id: this.#item.id,
			ref: this.#item.ref,
			onRefChange: (node) => {
				this.#submenu.triggerNode = node;
			},
		});
	}

	#clearOpenTimer() {
		if (this.#openTimer === null) return;
		window.clearTimeout(this.#openTimer);
		this.#openTimer = null;
	}

	onpointermove(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		const defaultPrevented = this.#content.onItemEnter(e);
		if (defaultPrevented) return;
		if (!this.#item.disabled.current && !this.#submenu.open.current && !this.#openTimer) {
			this.#content.onPointerGraceIntentChange(null);
			this.#openTimer = window.setTimeout(() => {
				this.#submenu.onOpen();
				this.#clearOpenTimer();
			}, 100);
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		this.#clearOpenTimer();

		const contentNode = this.#submenu.contentNode;
		const subTriggerNode = this.#item.ref.current;

		if (contentNode && subTriggerNode) {
			const polygon = makeHullFromElements([subTriggerNode, contentNode]);
			const side = contentNode?.dataset.side as Side;

			this.#content.onPointerGraceIntentChange({
				area: polygon,
				side,
			});

			window.clearTimeout(this.#content.pointerGraceTimer);
			this.#content.pointerGraceTimer = window.setTimeout(
				() => this.#content.onPointerGraceIntentChange(null),
				300
			);
		} else {
			const defaultPrevented = this.#content.onTriggerLeave(e);
			if (defaultPrevented) return;

			// There's 100ms where the user may leave an item before the submenu was opened.
			this.#content.onPointerGraceIntentChange(null);
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.#content.search !== "";
		if (this.#item.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;

		if (SUB_OPEN_KEYS[this.#submenu.root.dir.current].includes(e.key)) {
			this.#submenu.onOpen();
			afterTick(() => {
				const contentNode = this.#submenu.contentNode;
				if (!contentNode) return;
				MenuOpenEvent.dispatch(contentNode);
			});
			e.preventDefault();
		}
	}

	onclick(e: BitsMouseEvent) {
		if (this.#item.disabled.current) return;
		/**
		 * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
		 * and we rely heavily on `onFocusOutside` for submenus to close when switching
		 * between separate submenus.
		 */
		if (!isHTMLElement(e.currentTarget)) return;
		e.currentTarget.focus();
		if (!this.#submenu.open.current) {
			this.#submenu.onOpen();
		}
	}

	props = $derived.by(() =>
		mergeProps(
			{
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.#submenu.open.current),
				"data-state": getDataOpenClosed(this.#submenu.open.current),
				"aria-controls": this.#submenu.open.current
					? this.#submenu.contentId.current
					: undefined,
				[this.#submenu.root.getAttr("sub-trigger")]: "",
				onclick: this.onclick,
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onkeydown: this.onkeydown,
			},
			this.#item.props
		)
	);
}

type MenuCheckboxItemStateProps = WritableBoxedValues<{
	checked: boolean;
	indeterminate: boolean;
}>;

class MenuCheckboxItemState {
	#item: MenuItemState;
	#checked: MenuCheckboxItemStateProps["checked"];
	#indeterminate: MenuCheckboxItemStateProps["indeterminate"];

	constructor(props: MenuCheckboxItemStateProps, item: MenuItemState) {
		this.#item = item;
		this.#checked = props.checked;
		this.#indeterminate = props.indeterminate;
	}

	toggleChecked() {
		if (this.#indeterminate.current) {
			this.#indeterminate.current = false;
			this.#checked.current = true;
		} else {
			this.#checked.current = !this.#checked.current;
		}
	}

	snippetProps = $derived.by(() => ({
		checked: this.#checked.current,
		indeterminate: this.#indeterminate.current,
	}));

	props = $derived.by(
		() =>
			({
				...this.#item.props,
				role: "menuitemcheckbox",
				"aria-checked": getAriaChecked(this.#checked.current, this.#indeterminate.current),
				"data-state": getCheckedState(this.#checked.current),
				[this.#item.root.getAttr("checkbox-item")]: "",
			}) as const
	);
}

type MenuGroupStateProps = WithRefProps;

class MenuGroupState {
	#id: MenuGroupStateProps["id"];
	#ref: MenuGroupStateProps["ref"];
	groupHeadingId = $state<string | undefined>(undefined);
	root: MenuRootState;

	constructor(props: MenuGroupStateProps, root: MenuRootState) {
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
				"aria-labelledby": this.groupHeadingId,
				[this.root.getAttr("group")]: "",
			}) as const
	);
}

type MenuGroupHeadingStateProps = WithRefProps;
class MenuGroupHeadingState {
	#id: MenuGroupHeadingStateProps["id"];
	#ref: MenuGroupHeadingStateProps["ref"];
	#group: MenuGroupState | MenuRadioGroupState;

	constructor(props: MenuGroupHeadingStateProps, group: MenuGroupState | MenuRadioGroupState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#group = group;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#group.groupHeadingId = node?.id;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "group",
				[this.#group.root.getAttr("group-heading")]: "",
			}) as const
	);
}

type MenuSeparatorStateProps = WithRefProps;

class MenuSeparatorState {
	#id: MenuSeparatorStateProps["id"];
	#ref: MenuSeparatorStateProps["ref"];
	#root: MenuRootState;

	constructor(props: MenuSeparatorStateProps, root: MenuRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

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
				[this.#root.getAttr("separator")]: "",
			}) as const
	);
}

class MenuArrowState {
	#root: MenuRootState;

	constructor(root: MenuRootState) {
		this.#root = root;
	}

	props = $derived.by(
		() =>
			({
				[this.#root.getAttr("arrow")]: "",
			}) as const
	);
}

type MenuRadioGroupStateProps = WritableBoxedValues<{
	value: string;
	ref: HTMLElement | null;
}> &
	ReadableBoxedValues<{
		id: string;
	}>;

class MenuRadioGroupState {
	#id: MenuRadioGroupStateProps["id"];
	value: MenuRadioGroupStateProps["value"];
	#ref: MenuRadioGroupStateProps["ref"];
	content: MenuContentState;
	groupHeadingId = $state<string | null>(null);
	root: MenuRootState;

	constructor(props: MenuRadioGroupStateProps, content: MenuContentState) {
		this.value = props.value;
		this.#id = props.id;
		this.#ref = props.ref;
		this.content = content;
		this.root = content.parentMenu.root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	setValue(v: string) {
		this.value.current = v;
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.root.getAttr("radio-group")]: "",
				role: "group",
				"aria-labelledby": this.groupHeadingId,
			}) as const
	);
}

type MenuRadioItemStateProps = ReadableBoxedValues<{
	value: string;
	id: string;
	closeOnSelect: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class MenuRadioItemState {
	#id: MenuRadioItemStateProps["id"];
	#ref: MenuRadioItemStateProps["ref"];
	#item: MenuItemState;
	#value: MenuRadioItemStateProps["value"];
	#group: MenuRadioGroupState;
	isChecked = $derived.by(() => this.#group.value.current === this.#value.current);

	constructor(props: MenuRadioItemStateProps, item: MenuItemState, group: MenuRadioGroupState) {
		this.#item = item;
		this.#id = props.id;
		this.#ref = props.ref;
		this.#group = group;
		this.#value = props.value;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	selectValue() {
		this.#group.setValue(this.#value.current);
	}

	props = $derived.by(
		() =>
			({
				[this.#group.root.getAttr("radio-item")]: "",
				...this.#item.props,
				role: "menuitemradio",
				"aria-checked": getAriaChecked(this.isChecked, false),
				"data-state": getCheckedState(this.isChecked),
			}) as const
	);
}

//
// DROPDOWN MENU TRIGGER
//

type DropdownMenuTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class DropdownMenuTriggerState {
	#id: DropdownMenuTriggerStateProps["id"];
	#ref: DropdownMenuTriggerStateProps["ref"];
	#parentMenu: MenuMenuState;
	#disabled: DropdownMenuTriggerStateProps["disabled"];

	constructor(props: DropdownMenuTriggerStateProps, parentMenu: MenuMenuState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#parentMenu = parentMenu;
		this.#disabled = props.disabled;

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (ref) => {
				this.#parentMenu.triggerNode = ref;
			},
		});
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.#disabled.current) return;
		if (e.pointerType === "touch") return e.preventDefault();

		if (e.button === 0 && e.ctrlKey === false) {
			this.#parentMenu.toggleOpen();
			// prevent trigger focusing when opening to allow
			// the content to be given focus without competition
			if (!this.#parentMenu.open.current) e.preventDefault();
		}
	}

	onpointerup(e: BitsPointerEvent) {
		if (this.#disabled.current) return;
		if (e.pointerType === "touch") {
			e.preventDefault();
			this.#parentMenu.toggleOpen();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.#parentMenu.toggleOpen();
			e.preventDefault();
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.#parentMenu.onOpen();
			e.preventDefault();
		}
	}

	#ariaControls = $derived.by(() => {
		if (this.#parentMenu.open.current && this.#parentMenu.contentId.current)
			return this.#parentMenu.contentId.current;
		return undefined;
	});

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.#disabled.current,
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.#parentMenu.open.current),
				"aria-controls": this.#ariaControls,
				"data-disabled": getDataDisabled(this.#disabled.current),
				"data-state": getDataOpenClosed(this.#parentMenu.open.current),
				[this.#parentMenu.root.getAttr("trigger")]: "",
				//
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
				onkeydown: this.onkeydown,
			}) as const
	);
}

type ContextMenuTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class ContextMenuTriggerState {
	#id: ContextMenuTriggerStateProps["id"];
	#ref: ContextMenuTriggerStateProps["ref"];
	#parentMenu: MenuMenuState;
	#disabled: ContextMenuTriggerStateProps["disabled"];
	#point = $state({ x: 0, y: 0 });

	virtualElement = box({
		getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...this.#point }),
	});

	#longPressTimer = $state<number | null>(null);

	constructor(props: ContextMenuTriggerStateProps, parentMenu: MenuMenuState) {
		this.#parentMenu = parentMenu;
		this.#disabled = props.disabled;
		this.#id = props.id;
		this.#ref = props.ref;

		this.oncontextmenu = this.oncontextmenu.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.onpointerup = this.onpointerup.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#parentMenu.triggerNode = node;
			},
			deps: () => this.#parentMenu.open.current,
		});

		watch(
			() => this.#point,
			(point) => {
				this.virtualElement.current = {
					getBoundingClientRect: () =>
						DOMRect.fromRect({ width: 0, height: 0, ...point }),
				};
			}
		);

		$effect(() => {
			if (this.#disabled.current) {
				this.#clearLongPressTimer();
			}
		});

		onDestroyEffect(() => this.#clearLongPressTimer());
	}

	#clearLongPressTimer() {
		if (this.#longPressTimer === null) return;
		window.clearTimeout(this.#longPressTimer);
	}

	#handleOpen(e: BitsMouseEvent | BitsPointerEvent) {
		this.#point = { x: e.clientX, y: e.clientY };
		this.#parentMenu.onOpen();
	}

	oncontextmenu(e: BitsMouseEvent) {
		if (this.#disabled.current) return;
		this.#clearLongPressTimer();
		this.#handleOpen(e);
		e.preventDefault();
		this.#parentMenu.contentNode?.focus();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.#disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
		this.#longPressTimer = window.setTimeout(() => this.#handleOpen(e), 700);
	}

	onpointermove(e: BitsPointerEvent) {
		if (this.#disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointercancel(e: BitsPointerEvent) {
		if (this.#disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointerup(e: BitsPointerEvent) {
		if (this.#disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.#disabled.current,
				"data-disabled": getDataDisabled(this.#disabled.current),
				"data-state": getDataOpenClosed(this.#parentMenu.open.current),
				[CONTEXT_MENU_TRIGGER_ATTR]: "",
				//
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointercancel: this.onpointercancel,
				onpointerup: this.onpointerup,
				oncontextmenu: this.oncontextmenu,
			}) as const
	);
}

type MenuItemCombinedProps = MenuItemSharedStateProps & MenuItemStateProps;

export function useMenuRoot(props: MenuRootStateProps) {
	return MenuRootContext.set(new MenuRootState(props));
}

export function useMenuMenu(root: MenuRootState, props: MenuMenuStateProps) {
	return MenuMenuContext.set(new MenuMenuState(props, root));
}

export function useMenuSubmenu(props: MenuMenuStateProps) {
	const menu = MenuMenuContext.get();
	return MenuMenuContext.set(new MenuMenuState(props, menu.root, menu));
}

export function useMenuSubTrigger(props: MenuItemSharedStateProps) {
	const content = MenuContentContext.get();
	const item = new MenuItemSharedState(props, content);
	const submenu = MenuMenuContext.get();
	return new MenuSubTriggerState(item, content, submenu);
}

export function useMenuDropdownTrigger(props: DropdownMenuTriggerStateProps) {
	return new DropdownMenuTriggerState(props, MenuMenuContext.get());
}

export function useMenuContextTrigger(props: ContextMenuTriggerStateProps) {
	return new ContextMenuTriggerState(props, MenuMenuContext.get());
}

export function useMenuContent(props: MenuContentStateProps) {
	return MenuContentContext.set(new MenuContentState(props, MenuMenuContext.get()));
}

export function useMenuItem(props: MenuItemCombinedProps) {
	const item = new MenuItemSharedState(props, MenuContentContext.get());
	return new MenuItemState(props, item);
}

export function useMenuCheckboxItem(props: MenuItemCombinedProps & MenuCheckboxItemStateProps) {
	const item = new MenuItemState(props, new MenuItemSharedState(props, MenuContentContext.get()));
	return new MenuCheckboxItemState(props, item);
}

export function useMenuRadioGroup(props: MenuRadioGroupStateProps) {
	return MenuGroupContext.set(
		MenuRadioGroupContext.set(new MenuRadioGroupState(props, MenuContentContext.get()))
	);
}

export function useMenuRadioItem(props: MenuRadioItemStateProps & MenuItemCombinedProps) {
	const radioGroup = MenuRadioGroupContext.get();
	const sharedItem = new MenuItemSharedState(props, radioGroup.content);
	const item = new MenuItemState(props, sharedItem);
	return new MenuRadioItemState(props, item, radioGroup);
}

export function useMenuGroup(props: MenuGroupStateProps) {
	return MenuGroupContext.set(new MenuGroupState(props, MenuRootContext.get()));
}

export function useMenuGroupHeading(props: MenuGroupHeadingStateProps) {
	return new MenuGroupHeadingState(props, MenuGroupContext.get());
}

export function useMenuSeparator(props: MenuSeparatorStateProps) {
	return new MenuSeparatorState(props, MenuRootContext.get());
}

export function useMenuArrow() {
	return new MenuArrowState(MenuRootContext.get());
}
