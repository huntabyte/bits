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
import type { Orientation } from "$lib/shared/index.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-toggle-group-root";
const ITEM_ATTR = "data-toggle-group-item";

type ToggleGroupBaseStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		rovingFocus: boolean;
		loop: boolean;
		orientation: Orientation;
	}>
>;

class ToggleGroupBaseState {
	id: ToggleGroupBaseStateProps["id"];
	ref: ToggleGroupBaseStateProps["ref"];
	disabled: ToggleGroupBaseStateProps["disabled"];
	rovingFocus: ToggleGroupBaseStateProps["rovingFocus"];
	loop: ToggleGroupBaseStateProps["loop"];
	orientation: ToggleGroupBaseStateProps["orientation"];
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(props: ToggleGroupBaseStateProps) {
		this.id = props.id;
		this.ref = props.ref;
		this.disabled = props.disabled;
		this.rovingFocus = props.rovingFocus;
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.rovingFocusGroup = useRovingFocus({
			candidateAttr: ITEM_ATTR,
			rootNodeId: this.id,
			loop: this.loop,
			orientation: this.orientation,
		});

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				[ROOT_ATTR]: "",
				role: "group",
				"data-orientation": getDataOrientation(this.orientation.current),
				"data-disabled": getDataDisabled(this.disabled.current),
			}) as const
	);
}

//
// SINGLE
//

type ToggleGroupSingleStateProps = ToggleGroupBaseStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class ToggleGroupSingleState extends ToggleGroupBaseState {
	#value: ToggleGroupSingleStateProps["value"];
	isMulti = false;
	anyPressed = $derived.by(() => this.#value.current !== "");

	constructor(props: ToggleGroupSingleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem(item: string) {
		return this.#value.current === item;
	}

	toggleItem(item: string, id: string) {
		if (this.includesItem(item)) {
			this.#value.current = "";
		} else {
			this.#value.current = item;
			this.rovingFocusGroup.setCurrentTabStopId(id);
		}
	}
}

//
// MULTIPLE
//

type ToggleGroupMultipleStateProps = ToggleGroupBaseStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

class ToggleGroupMultipleState extends ToggleGroupBaseState {
	#value: ToggleGroupMultipleStateProps["value"];
	isMulti = true;
	anyPressed = $derived.by(() => this.#value.current.length > 0);

	constructor(props: ToggleGroupMultipleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem(item: string) {
		return this.#value.current.includes(item);
	}

	toggleItem(item: string, id: string) {
		if (this.includesItem(item)) {
			this.#value.current = this.#value.current.filter((v) => v !== item);
		} else {
			this.#value.current = [...this.#value.current, item];
			this.rovingFocusGroup.setCurrentTabStopId(id);
		}
	}
}

type ToggleGroupState = ToggleGroupSingleState | ToggleGroupMultipleState;

//
// ITEM
//

type ToggleGroupItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}> & {
		rootState: ToggleGroupState;
	}
>;

class ToggleGroupItemState {
	#id: ToggleGroupItemStateProps["id"];
	#ref: ToggleGroupItemStateProps["ref"];
	#root: ToggleGroupItemStateProps["rootState"];
	#value: ToggleGroupItemStateProps["value"];
	#disabled: ToggleGroupItemStateProps["disabled"];
	#isDisabled = $derived.by(() => this.#disabled.current || this.#root.disabled.current);

	constructor(props: ToggleGroupItemStateProps) {
		this.#value = props.value;
		this.#disabled = props.disabled;
		this.#root = props.rootState;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			if (!this.#root.rovingFocus.current) {
				this.#tabIndex = 0;
			} else {
				this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
			}
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#toggleItem() {
		if (this.#isDisabled) return;
		this.#root.toggleItem(this.#value.current, this.#id.current);
	}

	onclick(_: BitsMouseEvent) {
		if (this.#isDisabled) return;
		this.#root.toggleItem(this.#value.current, this.#id.current);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggleItem();
			return;
		}
		if (!this.#root.rovingFocus.current) return;

		this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
	}

	isPressed = $derived.by(() => this.#root.includesItem(this.#value.current));

	#ariaChecked = $derived.by(() => {
		return this.#root.isMulti ? undefined : getAriaChecked(this.isPressed, false);
	});

	#ariaPressed = $derived.by(() => {
		return this.#root.isMulti ? getAriaPressed(this.isPressed) : undefined;
	});

	#tabIndex = $state(0);

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: this.#root.isMulti ? undefined : "radio",
				tabindex: this.#tabIndex,
				"data-orientation": getDataOrientation(this.#root.orientation.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": getToggleItemDataState(this.isPressed),
				"data-value": this.#value.current,
				"aria-pressed": this.#ariaPressed,
				"aria-checked": this.#ariaChecked,
				disabled: getDisabled(this.#isDisabled),
				[ITEM_ATTR]: "",
				//
				onclick: this.onclick,
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

const ToggleGroupRootContext = new Context<ToggleGroupState>("ToggleGroup.Root");

type InitToggleGroupProps = WithRefProps<
	{
		type: "single" | "multiple";
		value: WritableBox<string> | WritableBox<string[]>;
	} & ReadableBoxedValues<{
		disabled: boolean;
		rovingFocus: boolean;
		loop: boolean;
		orientation: Orientation;
	}>
>;

export function useToggleGroupRoot(props: InitToggleGroupProps) {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new ToggleGroupSingleState(rest as ToggleGroupSingleStateProps)
			: new ToggleGroupMultipleState(rest as ToggleGroupMultipleStateProps);
	return ToggleGroupRootContext.set(rootState);
}

export function useToggleGroupItem(props: Omit<ToggleGroupItemStateProps, "rootState">) {
	return new ToggleGroupItemState({ ...props, rootState: ToggleGroupRootContext.get() });
}
