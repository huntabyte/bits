import type { Snippet } from "svelte";

export type PresenceLayerProps = {
	/**
	 * Whether to force mount the component.
	 */
	forceMount?: boolean;
};

export type PresenceLayerImplProps = PresenceLayerProps & {
	id: string;
	/**
	 * The presence status.
	 */
	present: boolean;

	presence?: Snippet<[{ present: { current: boolean } }]>;
};
