import { useRefById } from "svelte-toolbelt";
import { getAriaHidden, getAriaOrientation, getDataOrientation } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import type { Orientation } from "$lib/shared/index.js";

const ROOT_ATTR = "data-separator-root";

type SeparatorRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		orientation: Orientation;
		decorative: boolean;
	}>
>;

class SeparatorRootState {
	#id: SeparatorRootStateProps["id"];
	#ref: SeparatorRootStateProps["ref"];
	#orientation: SeparatorRootStateProps["orientation"];
	#decorative: SeparatorRootStateProps["decorative"];

	constructor(props: SeparatorRootStateProps) {
		this.#orientation = props.orientation;
		this.#decorative = props.decorative;
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
				id: this.#id.current,
				role: this.#decorative.current ? "none" : "separator",
				"aria-orientation": getAriaOrientation(this.#orientation.current),
				"aria-hidden": getAriaHidden(this.#decorative.current),
				"data-orientation": getDataOrientation(this.#orientation.current),
				[ROOT_ATTR]: "",
			}) as const
	);
}

export function useSeparatorRoot(props: SeparatorRootStateProps) {
	return new SeparatorRootState(props);
}
