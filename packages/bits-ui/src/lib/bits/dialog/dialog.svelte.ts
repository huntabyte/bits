import { useRefById } from "svelte-toolbelt";
import { Context } from "runed";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";

type DialogVariant = "alert-dialog" | "dialog";

function createAttrs(variant: DialogVariant) {
	return {
		content: `data-${variant}-content`,
		trigger: `data-${variant}-trigger`,
		overlay: `data-${variant}-overlay`,
		title: `data-${variant}-title`,
		description: `data-${variant}-description`,
		close: `data-${variant}-close`,
		cancel: `data-${variant}-cancel`,
		action: `data-${variant}-action`,
	} as const;
}

type DialogRootStateProps = WritableBoxedValues<{
	open: boolean;
}> &
	ReadableBoxedValues<{
		variant: DialogVariant;
	}>;

class DialogRootState {
	open: DialogRootStateProps["open"];
	variant: DialogRootStateProps["variant"];
	triggerNode = $state<HTMLElement | null>(null);
	titleNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	titleId = $state<string | undefined>(undefined);
	triggerId = $state<string | undefined>(undefined);
	descriptionId = $state<string | undefined>(undefined);
	cancelNode = $state<HTMLElement | null>(null);
	attrs = $derived.by(() => createAttrs(this.variant.current));

	constructor(props: DialogRootStateProps) {
		this.open = props.open;
		this.variant = props.variant;
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleOpen() {
		if (this.open.current) return;
		this.open.current = true;
	}

	handleClose() {
		if (!this.open.current) return;
		this.open.current = false;
	}

	sharedProps = $derived.by(
		() =>
			({
				"data-state": getDataOpenClosed(this.open.current),
			}) as const
	);
}

type DialogTriggerStateProps = WithRefProps & ReadableBoxedValues<{ disabled: boolean }>;

class DialogTriggerState {
	#id: DialogTriggerStateProps["id"];
	#ref: DialogTriggerStateProps["ref"];
	#root: DialogRootState;
	#disabled: DialogTriggerStateProps["disabled"];

	constructor(props: DialogTriggerStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#ref = props.ref;
		this.#disabled = props.disabled;

		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.triggerNode = node;
				this.#root.triggerId = node?.id;
			},
		});

		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#disabled.current) return;
		if (e.button > 0) return;
		this.#root.handleOpen();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.#disabled.current) return;
		if (e.button > 0) return;
		// by default, it will attempt to focus this trigger on pointerdown
		// since this also opens the dialog we want to prevent that behavior
		e.preventDefault();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#root.handleOpen();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.#root.open.current),
				"aria-controls": this.#root.contentId,
				[this.#root.attrs.trigger]: "",
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				disabled: this.#disabled.current ? true : undefined,
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogCloseStateProps = WithRefProps &
	ReadableBoxedValues<{
		variant: "action" | "cancel" | "close";
		disabled: boolean;
	}>;
class DialogCloseState {
	#id: DialogCloseStateProps["id"];
	#ref: DialogCloseStateProps["ref"];
	#root: DialogRootState;
	#variant: DialogCloseStateProps["variant"];
	#disabled: DialogCloseStateProps["disabled"];
	#attr = $derived.by(() => this.#root.attrs[this.#variant.current]);

	constructor(props: DialogCloseStateProps, root: DialogRootState) {
		this.#root = root;
		this.#ref = props.ref;
		this.#id = props.id;
		this.#variant = props.variant;
		this.#disabled = props.disabled;

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.#root.open.current,
		});
	}

	onclick(e: BitsMouseEvent) {
		if (this.#disabled.current) return;
		if (e.button > 0) return;
		this.#root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#root.handleClose();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.#attr]: "",
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				disabled: this.#disabled.current ? true : undefined,
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogActionStateProps = WithRefProps;

class DialogActionState {
	#id: DialogActionStateProps["id"];
	#ref: DialogActionStateProps["ref"];
	#root: DialogRootState;
	#attr = $derived.by(() => this.#root.attrs.action);

	constructor(props: DialogActionStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.#attr]: "",
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogTitleStateProps = WithRefProps<
	ReadableBoxedValues<{
		level: 1 | 2 | 3 | 4 | 5 | 6;
	}>
>;
class DialogTitleState {
	#id: DialogTitleStateProps["id"];
	#ref: DialogTitleStateProps["ref"];
	#root: DialogRootState;
	#level: DialogTitleStateProps["level"];

	constructor(props: DialogTitleStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#ref = props.ref;
		this.#level = props.level;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.titleNode = node;
				this.#root.titleId = node?.id;
			},
			deps: () => this.#root.open.current,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "heading",
				"aria-level": this.#level.current,
				[this.#root.attrs.title]: "",
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogDescriptionStateProps = WithRefProps;

class DialogDescriptionState {
	#id: DialogDescriptionStateProps["id"];
	#ref: DialogDescriptionStateProps["ref"];
	#root: DialogRootState;

	constructor(props: DialogDescriptionStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.#root.open.current,
			onRefChange: (node) => {
				this.#root.descriptionNode = node;
				this.#root.descriptionId = node?.id;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.#root.attrs.description]: "",
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogContentStateProps = WithRefProps;

class DialogContentState {
	#id: DialogContentStateProps["id"];
	#ref: DialogContentStateProps["ref"];
	root: DialogRootState;

	constructor(props: DialogContentStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.root = root;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.root.open.current,
			onRefChange: (node) => {
				this.root.contentNode = node;
				this.root.contentId = node?.id;
			},
		});
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: this.root.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
				"aria-describedby": this.root.descriptionId,
				"aria-labelledby": this.root.titleId,
				[this.root.attrs.content]: "",
				style: {
					pointerEvents: "auto",
				},
				...this.root.sharedProps,
			}) as const
	);
}

type DialogOverlayStateProps = WithRefProps;

class DialogOverlayState {
	#id: DialogOverlayStateProps["id"];
	#ref: DialogOverlayStateProps["ref"];
	root: DialogRootState;

	constructor(props: DialogOverlayStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.root.open.current,
		});
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.root.attrs.overlay]: "",
				style: {
					pointerEvents: "auto",
				},
				...this.root.sharedProps,
			}) as const
	);
}

type AlertDialogCancelStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class AlertDialogCancelState {
	#id: AlertDialogCancelStateProps["id"];
	#ref: AlertDialogCancelStateProps["ref"];
	#root: DialogRootState;
	#disabled: AlertDialogCancelStateProps["disabled"];

	constructor(props: AlertDialogCancelStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#disabled = props.disabled;
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.#root.open.current,
			onRefChange: (node) => {
				this.#root.cancelNode = node;
			},
		});
	}

	onclick(e: BitsMouseEvent) {
		if (this.#disabled.current) return;
		if (e.button > 0) return;
		this.#root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#root.handleClose();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.#root.attrs.cancel]: "",
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.#root.sharedProps,
			}) as const
	);
}

const DialogRootContext = new Context<DialogRootState>("Dialog.Root");

export function useDialogRoot(props: DialogRootStateProps) {
	return DialogRootContext.set(new DialogRootState(props));
}

export function useDialogTrigger(props: DialogTriggerStateProps) {
	return new DialogTriggerState(props, DialogRootContext.get());
}

export function useDialogTitle(props: DialogTitleStateProps) {
	return new DialogTitleState(props, DialogRootContext.get());
}

export function useDialogContent(props: DialogContentStateProps) {
	return new DialogContentState(props, DialogRootContext.get());
}

export function useDialogOverlay(props: DialogOverlayStateProps) {
	return new DialogOverlayState(props, DialogRootContext.get());
}

export function useDialogDescription(props: DialogDescriptionStateProps) {
	return new DialogDescriptionState(props, DialogRootContext.get());
}

export function useDialogClose(props: DialogCloseStateProps) {
	return new DialogCloseState(props, DialogRootContext.get());
}

export function useAlertDialogCancel(props: AlertDialogCancelStateProps) {
	return new AlertDialogCancelState(props, DialogRootContext.get());
}

export function useAlertDialogAction(props: DialogActionStateProps) {
	return new DialogActionState(props, DialogRootContext.get());
}
