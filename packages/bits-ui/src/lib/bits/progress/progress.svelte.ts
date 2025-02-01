import { useRefById } from "svelte-toolbelt";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-progress-root";

type ProgressRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: number | null;
		max: number;
	}>
>;

class ProgressRootState {
	#id: ProgressRootStateProps["id"];
	#ref: ProgressRootStateProps["ref"];
	#value: ProgressRootStateProps["value"];
	#max: ProgressRootStateProps["max"];

	constructor(props: ProgressRootStateProps) {
		this.#value = props.value;
		this.#max = props.max;
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
				role: "meter",
				value: this.#value.current,
				max: this.#max.current,
				"aria-valuemin": 0,
				"aria-valuemax": this.#max.current,
				"aria-valuenow": this.#value.current,
				"data-value": this.#value.current,
				"data-state": getProgressDataState(this.#value.current, this.#max.current),
				"data-max": this.#max.current,
				[ROOT_ATTR]: "",
			}) as const
	);
}

function getProgressDataState(
	value: number | null,
	max: number
): "indeterminate" | "loaded" | "loading" {
	if (value === null) return "indeterminate";
	return value === max ? "loaded" : "loading";
}

export function useProgressRootState(props: ProgressRootStateProps) {
	return new ProgressRootState(props);
}
