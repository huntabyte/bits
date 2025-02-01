import { srOnlyStyles, styleToString, useRefById } from "svelte-toolbelt";
import type { HTMLButtonAttributes } from "svelte/elements";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";

const CHECKBOX_ROOT_ATTR = "data-checkbox-root";
const CHECKBOX_GROUP_ATTR = "data-checkbox-group";
const CHECKBOX_GROUP_LABEL_ATTR = "data-checkbox-group-label";

type CheckboxGroupStateProps = WithRefProps<
	ReadableBoxedValues<{
		name: string | undefined;
		disabled: boolean;
		required: boolean;
	}> &
		WritableBoxedValues<{
			value: string[];
		}>
>;

class CheckboxGroupState {
	id: CheckboxGroupStateProps["id"];
	ref: CheckboxGroupStateProps["ref"];
	value: CheckboxGroupStateProps["value"];
	disabled: CheckboxGroupStateProps["disabled"];
	required: CheckboxGroupStateProps["required"];
	name: CheckboxGroupStateProps["name"];
	labelId = $state<string | undefined>(undefined);

	constructor(props: CheckboxGroupStateProps) {
		this.id = props.id;
		this.ref = props.ref;
		this.value = props.value;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	addValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		if (!this.value.current.includes(checkboxValue)) {
			this.value.current.push(checkboxValue);
		}
	}

	removeValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		const index = this.value.current.indexOf(checkboxValue);
		if (index === -1) return;
		this.value.current.splice(index, 1);
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "group",
				"aria-labelledby": this.labelId,
				"data-disabled": getDataDisabled(this.disabled.current),
				[CHECKBOX_GROUP_ATTR]: "",
			}) as const
	);
}

type CheckboxGroupLabelStateProps = WithRefProps;

class CheckboxGroupLabelState {
	id: CheckboxGroupLabelStateProps["id"];
	ref: CheckboxGroupLabelStateProps["ref"];
	group: CheckboxGroupState;

	constructor(props: CheckboxGroupLabelStateProps, group: CheckboxGroupState) {
		this.id = props.id;
		this.ref = props.ref;
		this.group = group;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				if (node) {
					group.labelId = node.id;
				} else {
					group.labelId = undefined;
				}
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-disabled": getDataDisabled(this.group.disabled.current),
				[CHECKBOX_GROUP_LABEL_ATTR]: "",
			}) as const
	);
}

type CheckboxRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		name: string | undefined;
		value: string | undefined;
		type: HTMLButtonAttributes["type"];
	}> &
		WritableBoxedValues<{
			checked: boolean;
			indeterminate: boolean;
		}>
>;

class CheckboxRootState {
	#id: CheckboxRootStateProps["id"];
	#ref: CheckboxRootStateProps["ref"];
	#type: CheckboxRootStateProps["type"];
	checked: CheckboxRootStateProps["checked"];
	#disabled: CheckboxRootStateProps["disabled"];
	#required: CheckboxRootStateProps["required"];
	#name: CheckboxRootStateProps["name"];
	value: CheckboxRootStateProps["value"];
	indeterminate: CheckboxRootStateProps["indeterminate"];
	group: CheckboxGroupState | null = null;

	trueName = $derived.by(() => {
		if (this.group && this.group.name.current) {
			return this.group.name.current;
		} else {
			return this.#name.current;
		}
	});
	trueRequired = $derived.by(() => {
		if (this.group && this.group.required.current) {
			return true;
		}
		return this.#required.current;
	});
	trueDisabled = $derived.by(() => {
		if (this.group && this.group.disabled.current) {
			return true;
		}
		return this.#disabled.current;
	});

	constructor(props: CheckboxRootStateProps, group: CheckboxGroupState | null = null) {
		this.checked = props.checked;
		this.#disabled = props.disabled;
		this.#required = props.required;
		this.#name = props.name;
		this.value = props.value;
		this.#ref = props.ref;
		this.#id = props.id;
		this.indeterminate = props.indeterminate;
		this.#type = props.type;
		this.group = group;
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		watch(
			[() => $state.snapshot(this.group?.value.current), () => this.value.current],
			([groupValue, value]) => {
				if (!groupValue || !value) return;
				this.checked.current = groupValue.includes(value);
			}
		);

		watch(
			() => this.checked.current,
			(checked) => {
				if (!this.group) return;
				if (checked) {
					this.group?.addValue(this.value.current);
				} else {
					this.group?.removeValue(this.value.current);
				}
			}
		);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#disabled.current) return;
		if (e.key === kbd.ENTER) e.preventDefault();
		if (e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggle();
		}
	}

	#toggle() {
		if (this.indeterminate.current) {
			this.indeterminate.current = false;
			this.checked.current = true;
		} else {
			this.checked.current = !this.checked.current;
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.#disabled.current) return;
		this.#toggle();
	}

	snippetProps = $derived.by(() => ({
		checked: this.checked.current,
		indeterminate: this.indeterminate.current,
	}));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "checkbox",
				type: this.#type.current,
				disabled: this.trueDisabled,
				"aria-checked": getAriaChecked(this.checked.current, this.indeterminate.current),
				"aria-required": getAriaRequired(this.trueRequired),
				"data-disabled": getDataDisabled(this.trueDisabled),
				"data-state": getCheckboxDataState(
					this.checked.current,
					this.indeterminate.current
				),
				[CHECKBOX_ROOT_ATTR]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);
}

//
// INPUT
//

class CheckboxInputState {
	root: CheckboxRootState;
	trueChecked = $derived.by(() => {
		if (this.root.group) {
			if (
				this.root.value.current !== undefined &&
				this.root.group.value.current.includes(this.root.value.current)
			) {
				return true;
			}
			return false;
		}
		return this.root.checked.current;
	});

	shouldRender = $derived.by(() => Boolean(this.root.trueName));

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				type: "checkbox",
				checked: this.root.checked.current === true,
				disabled: this.root.trueDisabled,
				required: this.root.trueRequired,
				name: this.root.trueName,
				value: this.root.value.current,
				"aria-hidden": "true",
				style: styleToString(srOnlyStyles),
			}) as const
	);
}

function getCheckboxDataState(checked: boolean, indeterminate: boolean) {
	if (indeterminate) return "indeterminate";
	return checked ? "checked" : "unchecked";
}

const CheckboxGroupContext = new Context<CheckboxGroupState>("Checkbox.Group");

const CheckboxRootContext = new Context<CheckboxRootState>("Checkbox.Root");

export function useCheckboxGroup(props: CheckboxGroupStateProps) {
	return CheckboxGroupContext.set(new CheckboxGroupState(props));
}

export function useCheckboxRoot(props: CheckboxRootStateProps) {
	return CheckboxRootContext.set(new CheckboxRootState(props, CheckboxGroupContext.getOr(null)));
}

export function useCheckboxGroupLabel(props: CheckboxGroupLabelStateProps) {
	return new CheckboxGroupLabelState(props, CheckboxGroupContext.get());
}

export function useCheckboxInput(): CheckboxInputState {
	return new CheckboxInputState(CheckboxRootContext.get());
}
