import { useRefById } from "svelte-toolbelt";
import type { BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-label-root";

type LabelRootStateProps = WithRefProps;
class LabelRootState {
	#id: LabelRootStateProps["id"];
	#ref: LabelRootStateProps["ref"];
	constructor(props: LabelRootStateProps) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.onmousedown = this.onmousedown.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	onmousedown(e: BitsMouseEvent) {
		if (e.detail > 1) e.preventDefault();
	}

	props = $derived({
		[ROOT_ATTR]: "",
		onmousedown: this.onmousedown,
	} as const);
}

export function setLabelRootState(props: LabelRootStateProps) {
	return new LabelRootState(props);
}
