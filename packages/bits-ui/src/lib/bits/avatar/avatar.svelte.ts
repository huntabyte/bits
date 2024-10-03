import { untrack } from "svelte";
import type { ReadableBox, WritableBox } from "svelte-toolbelt";
import type { HTMLImgAttributes } from "svelte/elements";
import type { AvatarImageLoadingStatus } from "./types.js";
import { createContext } from "$lib/internal/createContext.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";

const AVATAR_ROOT_ATTR = "data-avatar-root";
const AVATAR_IMAGE_ATTR = "data-avatar-image";
const AVATAR_FALLBACK_ATTR = "data-avatar-fallback";

type CrossOrigin = HTMLImgAttributes["crossorigin"];
type ReferrerPolicy = HTMLImgAttributes["referrerpolicy"];

/**
 * ROOT
 */
type AvatarRootStateProps = WithRefProps<{
	delayMs: ReadableBox<number>;
	loadingStatus: WritableBox<AvatarImageLoadingStatus>;
}>;

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	#id: AvatarRootStateProps["id"];
	#ref: AvatarRootStateProps["ref"];
	delayMs: AvatarRootStateProps["delayMs"];
	loadingStatus: AvatarRootStateProps["loadingStatus"];

	constructor(props: AvatarRootStateProps) {
		this.delayMs = props.delayMs;
		this.loadingStatus = props.loadingStatus;
		this.#ref = props.ref;
		this.#id = props.id;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	loadImage(src: string, crossorigin?: CrossOrigin, referrerPolicy?: ReferrerPolicy) {
		let imageTimerId: number;
		const image = new Image();

		image.src = src;
		if (crossorigin) image.crossOrigin = crossorigin;
		if (referrerPolicy) image.referrerPolicy = referrerPolicy;

		this.loadingStatus.current = "loading";
		image.onload = () => {
			imageTimerId = window.setTimeout(() => {
				this.loadingStatus.current = "loaded";
			}, this.delayMs.current);
		};
		image.onerror = () => {
			this.loadingStatus.current = "error";
		};
		return () => {
			clearTimeout(imageTimerId);
		};
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[AVATAR_ROOT_ATTR]: "",
				"data-status": this.loadingStatus.current,
			}) as const
	);

	createImage(props: AvatarImageStateProps) {
		return new AvatarImageState(props, this);
	}

	createFallback(props: AvatarFallbackStateProps) {
		return new AvatarFallbackState(props, this);
	}
}

/**
 * IMAGE
 */

type AvatarImageStateProps = WithRefProps<
	ReadableBoxedValues<{
		src: AvatarImageSrc;
		crossOrigin: CrossOrigin;
		referrerPolicy: ReferrerPolicy;
	}>
>;

class AvatarImageState {
	#id: AvatarImageStateProps["id"];
	#ref: AvatarImageStateProps["ref"];
	crossOrigin: AvatarImageStateProps["crossOrigin"];
	referrerPolicy: AvatarImageStateProps["referrerPolicy"];
	src: AvatarImageStateProps["src"];
	root: AvatarRootState;

	constructor(props: AvatarImageStateProps, root: AvatarRootState) {
		this.root = root;
		this.src = props.src;
		this.#id = props.id;
		this.#ref = props.ref;
		this.crossOrigin = props.crossOrigin;
		this.referrerPolicy = props.referrerPolicy;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect.pre(() => {
			if (!this.src.current) return;
			// dependency on crossorigin
			this.crossOrigin.current;
			untrack(() =>
				this.root.loadImage(
					this.src.current ?? "",
					this.crossOrigin.current,
					this.referrerPolicy.current
				)
			);
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				style: {
					display: this.root.loadingStatus.current === "loaded" ? "block" : "none",
				},
				"data-status": this.root.loadingStatus.current,
				[AVATAR_IMAGE_ATTR]: "",
				src: this.src.current,
				crossorigin: this.crossOrigin.current,
				referrerpolicy: this.referrerPolicy.current,
			}) as const
	);
}

/**
 * FALLBACK
 */

type AvatarFallbackStateProps = WithRefProps;

class AvatarFallbackState {
	#id: AvatarFallbackStateProps["id"];
	#ref: AvatarFallbackStateProps["ref"];
	root: AvatarRootState;

	constructor(props: AvatarFallbackStateProps, root: AvatarRootState) {
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
				style: {
					display: this.root.loadingStatus.current === "loaded" ? "none" : undefined,
				},
				"data-status": this.root.loadingStatus.current,
				[AVATAR_FALLBACK_ATTR]: "",
			}) as const
	);
}

/**
 * CONTEXT METHODS
 */

const [setAvatarRootContext, getAvatarRootContext] = createContext<AvatarRootState>("Avatar.Root");

export function useAvatarRoot(props: AvatarRootStateProps) {
	return setAvatarRootContext(new AvatarRootState(props));
}

export function useAvatarImage(props: AvatarImageStateProps) {
	return getAvatarRootContext().createImage(props);
}

export function useAvatarFallback(props: AvatarFallbackStateProps) {
	return getAvatarRootContext().createFallback(props);
}
