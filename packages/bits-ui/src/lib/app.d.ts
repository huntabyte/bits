/* eslint-disable no-var */
import type { ReadableBox } from "svelte-toolbelt";
import type { DismissibleLayerState } from "./bits/utilities/dismissible-layer/use-dismissable-layer.svelte.ts";
import type { InteractOutsideBehaviorType } from "./bits/utilities/dismissible-layer/types.ts";
import type { EscapeLayerState } from "./bits/utilities/escape-layer/use-escape-layer.svelte.ts";
import type { EscapeBehaviorType } from "./bits/utilities/escape-layer/types.ts";
import type { TextSelectionLayerState } from "./bits/utilities/text-selection-layer/use-text-selection-layer.svelte.ts";

declare global {
	var bitsDismissableLayers: Map<DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>>;
	var bitsEscapeLayers: Map<EscapeLayerState, ReadableBox<EscapeBehaviorType>>;
	var bitsTextSelectionLayers: Map<TextSelectionLayerState, ReadableBox<boolean>>;
	var bitsIdCounter: { current: number };
	var bitsBodyLockStackCount: {
		readonly map: SvelteMap<string, boolean>;
		resetBodyStyle: () => void;
	};
	var bitsAnimationsDisabled: boolean;
}
