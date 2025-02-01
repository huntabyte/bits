import { type WritableBox, useRefById } from "svelte-toolbelt";
import { Context } from "runed";
import {
	getAriaChecked,
	getAriaPressed,
	getDataDisabled,
	getDataOrientation,
	getDisabled,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";
import type { Orientation } from "$lib/shared/index.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-toolbar-root";
// all links, buttons, and items must have the ITEM_ATTR for roving focus
const ITEM_ATTR = "data-toolbar-item";
const GROUP_ATTR = "data-toolbar-group";
const GROUP_ITEM_ATTR = "data-toolbar-group-item";
const LINK_ATTR = "data-toolbar-link";
const BUTTON_ATTR = "data-toolbar-button";

type ToolbarRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		orientation: Orientation;
		loop: boolean;
	}>
>;

class ToolbarRootState {
	#id: ToolbarRootStateProps["id"];
	#ref: ToolbarRootStateProps["ref"];
	orientation: ToolbarRootStateProps["orientation"];
	#loop: ToolbarRootStateProps["loop"];
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(props: ToolbarRootStateProps) {
		this.#id = props.id;
		this.orientation = props.orientation;
		this.#loop = props.loop;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		this.rovingFocusGroup = useRovingFocus({
			orientation: this.orientation,
			loop: this.#loop,
			rootNodeId: this.#id,
			candidateAttr: ITEM_ATTR,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "toolbar",
				"data-orientation": this.orientation.current,
				[ROOT_ATTR]: "",
			}) as const
	);
}

type ToolbarGroupBaseStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

class ToolbarGroupBaseState {
	id: ToolbarGroupBaseStateProps["id"];
	ref: ToolbarGroupBaseStateProps["ref"];
	disabled: ToolbarGroupBaseStateProps["disabled"];
	root: ToolbarRootState;

	constructor(props: ToolbarGroupBaseStateProps, root: ToolbarRootState) {
		this.id = props.id;
		this.ref = props.ref;
		this.disabled = props.disabled;
		this.root = root;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				[GROUP_ATTR]: "",
				role: "group",
				"data-orientation": getDataOrientation(this.root.orientation.current),
				"data-disabled": getDataDisabled(this.disabled.current),
			}) as const
	);
}

//
// SINGLE
//

type ToolbarGroupSingleStateProps = ToolbarGroupBaseStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class ToolbarGroupSingleState extends ToolbarGroupBaseState {
	#value: ToolbarGroupSingleStateProps["value"];
	isMulti = false;
	anyPressed = $derived.by(() => this.#value.current !== "");

	constructor(props: ToolbarGroupSingleStateProps, root: ToolbarRootState) {
		super(props, root);
		this.#value = props.value;
	}

	includesItem(item: string) {
		return this.#value.current === item;
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.#value.current = "";
		} else {
			this.#value.current = item;
		}
	}
}

//
// MULTIPLE
//

type ToolbarGroupMultipleStateProps = ToolbarGroupBaseStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

class ToolbarGroupMultipleState extends ToolbarGroupBaseState {
	#value: ToolbarGroupMultipleStateProps["value"];
	isMulti = true;
	anyPressed = $derived.by(() => this.#value.current.length > 0);

	constructor(props: ToolbarGroupMultipleStateProps, root: ToolbarRootState) {
		super(props, root);
		this.#value = props.value;
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

type ToolbarGroupState = ToolbarGroupSingleState | ToolbarGroupMultipleState;

//
// ITEM
//

type ToolbarGroupItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}>
>;

class ToolbarGroupItemState {
	#id: ToolbarGroupItemStateProps["id"];
	#ref: ToolbarGroupSingleState["ref"];
	#group: ToolbarGroupState;
	#root: ToolbarRootState;
	#value: ToolbarGroupItemStateProps["value"];
	#disabled: ToolbarGroupItemStateProps["disabled"];
	#isDisabled = $derived.by(() => this.#disabled.current || this.#group.disabled.current);

	constructor(
		props: ToolbarGroupItemStateProps,
		group: ToolbarGroupState,
		root: ToolbarRootState
	) {
		this.#value = props.value;
		this.#disabled = props.disabled;
		this.#group = group;
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#toggleItem() {
		if (this.#isDisabled) return;
		this.#group.toggleItem(this.#value.current);
	}

	onclick(_: BitsMouseEvent) {
		if (this.#isDisabled) return;
		this.#toggleItem();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggleItem();
			return;
		}

		this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
	}

	isPressed = $derived.by(() => this.#group.includesItem(this.#value.current));

	#ariaChecked = $derived.by(() => {
		return this.#group.isMulti ? undefined : getAriaChecked(this.isPressed, false);
	});

	#ariaPressed = $derived.by(() => {
		return this.#group.isMulti ? getAriaPressed(this.isPressed) : undefined;
	});

	#tabIndex = $state(0);

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: this.#group.isMulti ? undefined : "radio",
				tabindex: this.#tabIndex,
				"data-orientation": getDataOrientation(this.#root.orientation.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": getToggleItemDataState(this.isPressed),
				"data-value": this.#value.current,
				"aria-pressed": this.#ariaPressed,
				"aria-checked": this.#ariaChecked,
				[ITEM_ATTR]: "",
				[GROUP_ITEM_ATTR]: "",
				disabled: getDisabled(this.#isDisabled),
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);
}

type ToolbarLinkStateProps = WithRefProps;

class ToolbarLinkState {
	#id: ToolbarLinkStateProps["id"];
	#ref: ToolbarLinkStateProps["ref"];
	#root: ToolbarRootState;

	constructor(props: ToolbarLinkStateProps, root: ToolbarRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
		});

		this.onkeydown = this.onkeydown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
	}

	#role = $derived.by(() => {
		if (!this.#ref.current) return undefined;
		const tagName = this.#ref.current.tagName;
		if (tagName !== "A") return "link" as const;
		return undefined;
	});

	#tabIndex = $state(0);

	props = $derived.by(() => ({
		id: this.#id.current,
		[LINK_ATTR]: "",
		[ITEM_ATTR]: "",
		role: this.#role,
		tabindex: this.#tabIndex,
		"data-orientation": getDataOrientation(this.#root.orientation.current),
		//
		onkeydown: this.onkeydown,
	}));
}

type ToolbarButtonStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

class ToolbarButtonState {
	#id: ToolbarButtonStateProps["id"];
	#ref: ToolbarButtonStateProps["ref"];
	#root: ToolbarRootState;
	#disabled: ToolbarButtonStateProps["disabled"];

	constructor(props: ToolbarButtonStateProps, root: ToolbarRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#disabled = props.disabled;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
		});

		this.onkeydown = this.onkeydown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
	}

	#tabIndex = $state(0);

	#role = $derived.by(() => {
		if (!this.#ref.current) return undefined;
		const tagName = this.#ref.current.tagName;
		if (tagName !== "BUTTON") return "button" as const;
		return undefined;
	});

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[ITEM_ATTR]: "",
				[BUTTON_ATTR]: "",
				role: this.#role,
				tabindex: this.#tabIndex,
				"data-disabled": getDataDisabled(this.#disabled.current),
				"data-orientation": getDataOrientation(this.#root.orientation.current),
				disabled: getDisabled(this.#disabled.current),
				//
				onkeydown: this.onkeydown,
			}) as const
	);
}

//
// HELPERS
//

function getToggleItemDataState(condition: boolean) {
	return condition ? "on" : "off";
}

const ToolbarRootContext = new Context<ToolbarRootState>("Toolbar.Root");
const ToolbarGroupContext = new Context<ToolbarGroupState>("Toolbar.Group");

export function useToolbarRoot(props: ToolbarRootStateProps) {
	return ToolbarRootContext.set(new ToolbarRootState(props));
}

type InitToolbarGroupProps = WithRefProps<
	{
		type: "single" | "multiple";
		value: WritableBox<string> | WritableBox<string[]>;
	} & ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

export function useToolbarGroup(props: InitToolbarGroupProps) {
	const { type, ...rest } = props;
	const rootState = ToolbarRootContext.get();
	const groupState =
		type === "single"
			? new ToolbarGroupSingleState(rest as ToolbarGroupSingleStateProps, rootState)
			: new ToolbarGroupMultipleState(rest as ToolbarGroupMultipleStateProps, rootState);

	return ToolbarGroupContext.set(groupState);
}

export function useToolbarGroupItem(props: ToolbarGroupItemStateProps) {
	const group = ToolbarGroupContext.get();
	return new ToolbarGroupItemState(props, group, group.root);
}

export function useToolbarButton(props: ToolbarButtonStateProps) {
	return new ToolbarButtonState(props, ToolbarRootContext.get());
}

export function useToolbarLink(props: ToolbarLinkStateProps) {
	return new ToolbarLinkState(props, ToolbarRootContext.get());
}
