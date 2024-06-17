import {
	type ReadableBoxedValues,
	type WithRefProps,
	type WritableBoxedValues,
	getAriaChecked,
	getAriaRequired,
	getDataDisabled,
	srOnlyStyles,
	styleToString,
	useRefById,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/shared/index.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "data-radio-group-root";
const ITEM_ATTR = "data-radio-group-item";

type RadioGroupRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		loop: boolean;
		orientation: Orientation;
		name: string | undefined;
	}> &
		WritableBoxedValues<{ value: string }>
>;
class RadioGroupRootState {
	id: RadioGroupRootStateProps["id"];
	ref: RadioGroupRootStateProps["ref"];
	disabled: RadioGroupRootStateProps["disabled"];
	required: RadioGroupRootStateProps["required"];
	loop: RadioGroupRootStateProps["loop"];
	orientation: RadioGroupRootStateProps["orientation"];
	name: RadioGroupRootStateProps["name"];
	value: RadioGroupRootStateProps["value"];
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(props: RadioGroupRootStateProps) {
		this.id = props.id;
		this.disabled = props.disabled;
		this.required = props.required;
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.name = props.name;
		this.value = props.value;
		this.ref = props.ref;
		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.id,
			candidateSelector: ITEM_ATTR,
			loop: this.loop,
			orientation: this.orientation,
		});

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	isChecked(value: string) {
		return this.value.value === value;
	}

	selectValue(value: string) {
		this.value.value = value;
	}

	createItem(props: RadioGroupItemStateProps) {
		return new RadioGroupItemState(props, this);
	}

	createInput() {
		return new RadioGroupInputState(this);
	}

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "radiogroup",
				"aria-required": getAriaRequired(this.required.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-orientation": this.orientation.value,
				[ROOT_ATTR]: "",
			}) as const
	);
}

//
// RADIO GROUP ITEM
//

type RadioGroupItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		value: string;
	}>
>;

class RadioGroupItemState {
	#id: RadioGroupItemStateProps["id"];
	#ref: RadioGroupItemStateProps["ref"];
	#root: RadioGroupRootState;
	#disabled: RadioGroupItemStateProps["disabled"];
	#value: RadioGroupItemStateProps["value"];
	checked = $derived.by(() => this.#root.value.value === this.#value.value);
	#isDisabled = $derived.by(() => this.#disabled.value || this.#root.disabled.value);
	#isChecked = $derived.by(() => this.#root.isChecked(this.#value.value));

	constructor(props: RadioGroupItemStateProps, root: RadioGroupRootState) {
		this.#disabled = props.disabled;
		this.#value = props.value;
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onclick = () => {
		this.#root.selectValue(this.#value.value);
	};

	#onfocus = () => {
		this.#root.selectValue(this.#value.value);
	};

	#onkeydown = (e: KeyboardEvent) => {
		this.#root.rovingFocusGroup.handleKeydown(this.#ref.value, e);
	};

	#tabIndex = $derived.by(() => this.#root.rovingFocusGroup.getTabIndex(this.#ref.value));

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				disabled: this.#isDisabled ? true : undefined,
				"data-value": this.#value.value,
				"data-orientation": this.#root.orientation.value,
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": this.#isChecked ? "checked" : "unchecked",
				"aria-checked": getAriaChecked(this.#isChecked),
				[ITEM_ATTR]: "",
				type: "button",
				role: "radio",
				tabindex: this.#tabIndex,
				//
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
				onfocus: this.#onfocus,
			}) as const
	);
}

//
// INPUT
//

class RadioGroupInputState {
	#root: RadioGroupRootState;
	shouldRender = $derived.by(() => this.#root.name.value !== undefined);
	props = $derived.by(
		() =>
			({
				name: this.#root.name.value,
				value: this.#root.value.value,
				required: this.#root.required.value,
				disabled: this.#root.disabled.value,
				"aria-hidden": "true",
				hidden: true,
				style: styleToString(srOnlyStyles),
				tabIndex: -1,
			}) as const
	);

	constructor(root: RadioGroupRootState) {
		this.#root = root;
	}
}

//
// CONTEXT METHODS
//

const [setRadioGroupRootContext, getRadioGroupRootContext] =
	createContext<RadioGroupRootState>("RadioGroup.Root");

export function useRadioGroupRoot(props: RadioGroupRootStateProps) {
	return setRadioGroupRootContext(new RadioGroupRootState(props));
}

export function useRadioGroupItem(props: RadioGroupItemStateProps) {
	return getRadioGroupRootContext().createItem(props);
}

export function useRadioGroupInput() {
	return getRadioGroupRootContext().createInput();
}
