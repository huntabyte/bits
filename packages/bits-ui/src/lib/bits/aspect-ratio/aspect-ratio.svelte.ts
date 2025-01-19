import { useRefById } from "svelte-toolbelt";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";

const ASPECT_RATIO_ROOT_ATTR = "data-aspect-ratio-root";

type AspectRatioRootStateProps = WithRefProps<ReadableBoxedValues<{ ratio: number }>>;

export class AspectRatioRootState {
	#ref: AspectRatioRootStateProps["ref"];
	#id: AspectRatioRootStateProps["id"];
	#ratio: AspectRatioRootStateProps["ratio"];

	constructor(props: AspectRatioRootStateProps) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#ratio = props.ratio;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	wrapperProps = $derived.by(() => ({
		style: {
			position: "relative",
			width: "100%",
			paddingBottom: `${this.#ratio.current ? 100 / this.#ratio.current : 0}%}`,
		},
	}));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				style: {
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				[ASPECT_RATIO_ROOT_ATTR]: "",
			}) as const
	);
}

export function useAspectRatioRoot(props: AspectRatioRootStateProps) {
	return new AspectRatioRootState(props);
}
