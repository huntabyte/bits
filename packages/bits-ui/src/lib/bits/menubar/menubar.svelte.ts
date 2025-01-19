import {
	type ReadableBox,
	afterTick,
	box,
	onDestroyEffect,
	onMountEffect,
	useRefById,
} from "svelte-toolbelt";
import { untrack } from "svelte";
import { Context } from "runed";
import type { InteractOutsideBehaviorType } from "../utilities/dismissible-layer/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";
import type { Direction } from "$lib/shared/index.js";
import { getAriaExpanded, getDataDisabled, getDataOpenClosed } from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { wrapArray } from "$lib/internal/arrays.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";

const ROOT_ATTR = "data-menubar-root";
const TRIGGER_ATTR = "data-menubar-trigger";

type MenubarRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		dir: Direction;
		loop: boolean;
	}> &
		WritableBoxedValues<{
			value: string;
		}>
>;

class MenubarRootState {
	id: MenubarRootStateProps["id"];
	ref: MenubarRootStateProps["ref"];
	value: MenubarRootStateProps["value"];
	dir: MenubarRootStateProps["dir"];
	loop: MenubarRootStateProps["loop"];
	rovingFocusGroup: UseRovingFocusReturn;
	currentTabStopId = box<string | null>(null);
	wasOpenedByKeyboard = $state(false);
	triggerIds = $state<string[]>([]);
	valueToContentId = new Map<string, ReadableBox<string>>();

	constructor(props: MenubarRootStateProps) {
		this.value = props.value;
		this.dir = props.dir;
		this.loop = props.loop;
		this.id = props.id;
		this.ref = props.ref;

		this.onMenuClose = this.onMenuClose.bind(this);
		this.onMenuOpen = this.onMenuOpen.bind(this);
		this.onMenuToggle = this.onMenuToggle.bind(this);

		this.registerTrigger = this.registerTrigger.bind(this);
		this.deRegisterTrigger = this.deRegisterTrigger.bind(this);

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.id,
			candidateAttr: TRIGGER_ATTR,
			loop: this.loop,
			orientation: box.with(() => "horizontal"),
			currentTabStopId: this.currentTabStopId,
		});
	}

	registerTrigger(id: string) {
		this.triggerIds.push(id);
	}

	deRegisterTrigger(id: string) {
		this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
	}

	getTriggers() {
		const node = this.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLButtonElement>(`[${TRIGGER_ATTR}]`));
	}

	onMenuOpen(id: string) {
		this.value.current = id;
		this.currentTabStopId.current = id;
	}

	onMenuClose() {
		this.value.current = "";
	}

	onMenuToggle(id: string) {
		this.value.current = this.value.current ? "" : id;
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "menubar",
				[ROOT_ATTR]: "",
			}) as const
	);
}

type MenubarMenuStateProps = ReadableBoxedValues<{
	value: string;
}>;

class MenubarMenuState {
	root: MenubarRootState;
	value: MenubarMenuStateProps["value"];
	open = $derived.by(() => this.root.value.current === this.value.current);
	wasOpenedByKeyboard = $state(false);
	triggerNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);

	constructor(props: MenubarMenuStateProps, root: MenubarRootState) {
		this.value = props.value;
		this.root = root;

		$effect(() => {
			if (!this.open) {
				untrack(() => {
					this.wasOpenedByKeyboard = false;
				});
			}
		});

		onMountEffect(() => {
			this.root.valueToContentId.set(
				this.value.current,
				box.with(() => this.contentNode?.id ?? "")
			);
		});

		onDestroyEffect(() => {
			this.root.valueToContentId.delete(this.value.current);
		});
	}

	getTriggerNode() {
		return this.triggerNode;
	}
}

type MenubarTriggerStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

class MenubarTriggerState {
	id: MenubarTriggerStateProps["id"];
	ref: MenubarTriggerStateProps["ref"];
	disabled: MenubarTriggerStateProps["disabled"];
	menu: MenubarMenuState;
	root: MenubarRootState;
	isFocused = $state(false);
	#tabIndex = $state(0);

	constructor(props: MenubarTriggerStateProps, menu: MenubarMenuState) {
		this.disabled = props.disabled;
		this.menu = menu;
		this.id = props.id;
		this.ref = props.ref;
		this.root = menu.root;

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.menu.triggerNode = node;
			},
		});

		onMountEffect(() => {
			this.root.registerTrigger(props.id.current);
		});

		onDestroyEffect(() => {
			this.root.deRegisterTrigger(props.id.current);
		});

		$effect(() => {
			if (this.root.triggerIds.length) {
				this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.menu.getTriggerNode());
			}
		});
	}

	onpointerdown(e: BitsPointerEvent) {
		// only call if the left button but not when the CTRL key is pressed
		if (!this.disabled.current && e.button === 0 && e.ctrlKey === false) {
			// prevent trigger from focusing when opening
			// which allows the content to focus without competition
			if (!this.menu.open) {
				e.preventDefault();
			}
			this.root.onMenuOpen(this.menu.value.current);
		}
	}

	onpointerenter(_: BitsPointerEvent) {
		const isMenubarOpen = Boolean(this.root.value.current);
		if (isMenubarOpen && !this.menu.open) {
			this.root.onMenuOpen(this.menu.value.current);
			this.menu.getTriggerNode()?.focus();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.disabled.current) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			this.root.onMenuToggle(this.menu.value.current);
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.root.onMenuOpen(this.menu.value.current);
		}
		// prevent keydown from scrolling window / first focused item
		// from inadvertently closing the menu
		if (e.key === kbd.ENTER || e.key === kbd.SPACE || e.key === kbd.ARROW_DOWN) {
			this.menu.wasOpenedByKeyboard = true;
			e.preventDefault();
		}

		this.root.rovingFocusGroup.handleKeydown(this.menu.getTriggerNode(), e);
	}

	onfocus(_: BitsFocusEvent) {
		this.isFocused = true;
	}

	onblur(_: BitsFocusEvent) {
		this.isFocused = false;
	}

	props = $derived.by(
		() =>
			({
				type: "button",
				role: "menuitem",
				id: this.id.current,
				"aria-haspopup": "menu",
				"aria-expanded": getAriaExpanded(this.menu.open),
				"aria-controls": this.menu.open ? this.menu.contentNode?.id : undefined,
				"data-highlighted": this.isFocused ? "" : undefined,
				"data-state": getDataOpenClosed(this.menu.open),
				"data-disabled": getDataDisabled(this.disabled.current),
				"data-menu-value": this.menu.value.current,
				disabled: this.disabled.current ? true : undefined,
				tabIndex: this.#tabIndex,
				[TRIGGER_ATTR]: "",
				onpointerdown: this.onpointerdown,
				onpointerenter: this.onpointerenter,
				onkeydown: this.onkeydown,
				onfocus: this.onfocus,
				onblur: this.onblur,
			}) as const
	);
}

type MenubarContentStateProps = WithRefProps<
	ReadableBoxedValues<{
		interactOutsideBehavior: InteractOutsideBehaviorType;
	}>
>;

class MenubarContentState {
	id: MenubarContentStateProps["id"];
	ref: MenubarContentStateProps["ref"];
	menu: MenubarMenuState;
	root: MenubarRootState;
	hasInteractedOutside = $state(false);
	interactOutsideBehavior: MenubarContentStateProps["interactOutsideBehavior"];

	constructor(props: MenubarContentStateProps, menu: MenubarMenuState) {
		this.interactOutsideBehavior = props.interactOutsideBehavior;
		this.menu = menu;
		this.id = props.id;
		this.ref = props.ref;
		this.root = menu.root;

		this.onCloseAutoFocus = this.onCloseAutoFocus.bind(this);
		this.onFocusOutside = this.onFocusOutside.bind(this);
		this.onInteractOutside = this.onInteractOutside.bind(this);
		this.onOpenAutoFocus = this.onOpenAutoFocus.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.menu.contentNode = node;
			},
			deps: () => this.menu.open,
		});
	}

	onCloseAutoFocus(e: Event) {
		const menubarOpen = Boolean(this.root.value.current);
		if (!menubarOpen && !this.hasInteractedOutside) {
			this.menu.getTriggerNode()?.focus();
		}

		this.hasInteractedOutside = false;
		e.preventDefault();
	}

	onFocusOutside(e: Event) {
		const target = e.target as HTMLElement;
		const isMenubarTrigger = this.root
			.getTriggers()
			.some((trigger) => trigger.contains(target));
		if (isMenubarTrigger) e.preventDefault();
	}

	onInteractOutside() {
		this.hasInteractedOutside = true;
	}

	onOpenAutoFocus() {
		afterTick(() => this.ref.current?.focus());
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key !== kbd.ARROW_LEFT && e.key !== kbd.ARROW_RIGHT) return;

		const target = e.target as HTMLElement;
		const targetIsSubTrigger = target.hasAttribute("data-menu-sub-trigger");
		const isKeydownInsideSubMenu = target.closest("[data-menu-content]") !== e.currentTarget;

		const prevMenuKey = this.root.dir.current === "rtl" ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT;
		const isPrevKey = prevMenuKey === e.key;
		const isNextKey = !isPrevKey;

		// prevent navigation when opening a submenu
		if (isNextKey && targetIsSubTrigger) return;
		// or if we're inside a submenu and moving back to close it
		if (isKeydownInsideSubMenu && isPrevKey) return;

		const items = this.root.getTriggers().filter((trigger) => !trigger.disabled);
		let candidateValues = items.map((item) => item.getAttribute("data-menu-value")!);
		if (isPrevKey) candidateValues.reverse();

		const currentIndex = candidateValues.indexOf(this.menu.value.current);

		candidateValues = this.root.loop.current
			? wrapArray(candidateValues, currentIndex + 1)
			: candidateValues.slice(currentIndex + 1);
		const [nextValue] = candidateValues;
		if (nextValue) this.root.onMenuOpen(nextValue);
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"aria-labelledby": this.menu.triggerNode?.id,
				style: {
					"--bits-menubar-content-transform-origin":
						"var(--bits-floating-transform-origin)",
					"--bits-menubar-content-available-width":
						"var(--bits-floating-available-width)",
					"--bits-menubar-content-available-height":
						"var(--bits-floating-available-height)",
					"--bits-menubar-anchor-width": "var(--bits-floating-anchor-width)",
					"--bits-menubar-anchor-height": "var(--bits-floating-anchor-height)",
				},
				onkeydown: this.onkeydown,
				"data-menu-content": "",
			}) as const
	);
}

const MenubarRootContext = new Context<MenubarRootState>("Menubar.Root");
const MenubarMenuContext = new Context<MenubarMenuState>("Menubar.Menu");

export function useMenubarRoot(props: MenubarRootStateProps) {
	return MenubarRootContext.set(new MenubarRootState(props));
}

export function useMenubarMenu(props: MenubarMenuStateProps) {
	return MenubarMenuContext.set(new MenubarMenuState(props, MenubarRootContext.get()));
}

export function useMenubarTrigger(props: MenubarTriggerStateProps) {
	return new MenubarTriggerState(props, MenubarMenuContext.get());
}

export function useMenubarContent(props: MenubarContentStateProps) {
	return new MenubarContentState(props, MenubarMenuContext.get());
}
