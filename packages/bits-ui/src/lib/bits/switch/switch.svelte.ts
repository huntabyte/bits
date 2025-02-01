import { srOnlyStyles, styleToString, useRefById } from "svelte-toolbelt";
import { Context } from "runed";
import {
	getAriaChecked,
	getAriaHidden,
	getAriaRequired,
	getDataChecked,
	getDataDisabled,
	getDataRequired,
	getDisabled,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import type { BitsKeyboardEvent, BitsPointerEvent, WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-switch-root";
const THUMB_ATTR = "data-switch-thumb";

type SwitchRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		name: string | undefined;
		value: string;
	}> &
		WritableBoxedValues<{
			checked: boolean;
		}>
>;
class SwitchRootState {
	#id: SwitchRootStateProps["id"];
	#ref: SwitchRootStateProps["ref"];
	checked: SwitchRootStateProps["checked"];
	disabled: SwitchRootStateProps["disabled"];
	required: SwitchRootStateProps["required"];
	name: SwitchRootStateProps["name"];
	value: SwitchRootStateProps["value"];

	constructor(props: SwitchRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
	}

	#toggle() {
		this.checked.current = !this.checked.current;
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE) || this.disabled.current) return;
		e.preventDefault();
		this.#toggle();
	}

	onclick(_: BitsPointerEvent) {
		if (this.disabled.current) return;
		this.#toggle();
	}

	sharedProps = $derived.by(() => ({
		"data-disabled": getDataDisabled(this.disabled.current),
		"data-state": getDataChecked(this.checked.current),
		"data-required": getDataRequired(this.required.current),
	}));

	props = $derived.by(
		() =>
			({
				...this.sharedProps,
				id: this.#id.current,
				role: "switch",
				disabled: getDisabled(this.disabled.current),
				"aria-checked": getAriaChecked(this.checked.current, false),
				"aria-required": getAriaRequired(this.required.current),
				[ROOT_ATTR]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);
}

class SwitchInputState {
	#root: SwitchRootState;
	shouldRender = $derived.by(() => this.#root.name.current !== undefined);

	constructor(root: SwitchRootState) {
		this.#root = root;
	}

	props = $derived.by(
		() =>
			({
				type: "checkbox",
				name: this.#root.name.current,
				value: this.#root.value.current,
				checked: this.#root.checked.current,
				disabled: this.#root.disabled.current,
				required: this.#root.required.current,
				"aria-hidden": getAriaHidden(true),
				style: styleToString(srOnlyStyles),
			}) as const
	);
}

type SwitchThumbStateProps = WithRefProps;

class SwitchThumbState {
	#id: SwitchThumbStateProps["id"];
	#ref: SwitchThumbStateProps["ref"];
	root: SwitchRootState;

	constructor(props: SwitchThumbStateProps, root: SwitchRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				...this.root.sharedProps,
				id: this.#id.current,
				[THUMB_ATTR]: "",
			}) as const
	);
}

const SwitchRootContext = new Context<SwitchRootState>("Switch.Root");

export function useSwitchRoot(props: SwitchRootStateProps) {
	return SwitchRootContext.set(new SwitchRootState(props));
}

export function useSwitchInput(): SwitchInputState {
	return new SwitchInputState(SwitchRootContext.get());
}

export function useSwitchThumb(props: SwitchThumbStateProps): SwitchThumbState {
	return new SwitchThumbState(props, SwitchRootContext.get());
}
