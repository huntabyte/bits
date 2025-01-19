import { Previous } from "runed";
import { untrack } from "svelte";
import { type WritableBox, box, useRefById } from "svelte-toolbelt";
import { usePasswordManagerBadge } from "./usePasswordManager.svelte.js";
import type { PinInputCell, PinInputRootProps as RootComponentProps } from "./types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type {
	BitsEvent,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { noop } from "$lib/internal/noop.js";
import { addEventListener } from "$lib/internal/events.js";
import { getDisabled } from "$lib/internal/attrs.js";

export const REGEXP_ONLY_DIGITS = "^\\d+$";
export const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";

const ROOT_ATTR = "data-pin-input-root";
const CELL_ATTR = "data-pin-input-cell";

type PinInputRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: string;
	}> &
		ReadableBoxedValues<{
			inputId: string;
			disabled: boolean;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onComplete: (...args: any[]) => void;
			onPaste?: (text: string) => string;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			pattern: any;
			maxLength: number;
			pushPasswordManagerStrategy: "increase-width" | "none";
			textAlign: RootComponentProps["textalign"];
			autocomplete: RootComponentProps["autocomplete"];
			inputmode: RootComponentProps["inputmode"];
		}>
>;

type PrevInputMetadata = {
	prev: [number | null, number | null, "none" | "forward" | "backward"];
	willSyntheticBlur: boolean;
};
type InitialLoad = {
	value: WritableBox<string>;
	isIOS: boolean;
};

class PinInputRootState {
	#id: PinInputRootStateProps["id"];
	#ref: PinInputRootStateProps["ref"];
	#inputId: PinInputRootStateProps["inputId"];
	#inputRef = box<HTMLInputElement | null>(null);
	#isHoveringInput = $state(false);
	#isFocused = box(false);
	#mirrorSelectionStart = $state<number | null>(null);
	#mirrorSelectionEnd = $state<number | null>(null);
	#onComplete: PinInputRootStateProps["onComplete"];
	#onPaste: PinInputRootStateProps["onPaste"];
	value: PinInputRootStateProps["value"];
	#previousValue = new Previous(() => this.value.current ?? "");
	#maxLength: PinInputRootStateProps["maxLength"];
	#disabled: PinInputRootStateProps["disabled"];
	#pattern: PinInputRootStateProps["pattern"];
	#textAlign: PinInputRootStateProps["textAlign"];
	#autocomplete: PinInputRootStateProps["autocomplete"];
	#inputmode: PinInputRootStateProps["inputmode"];
	#regexPattern = $derived.by(() => {
		if (typeof this.#pattern.current === "string") {
			return new RegExp(this.#pattern.current);
		} else {
			return this.#pattern.current;
		}
	});
	#prevInputMetadata = $state<PrevInputMetadata>({
		prev: [null, null, "none"],
		willSyntheticBlur: false,
	});
	#pushPasswordManagerStrategy: PinInputRootStateProps["pushPasswordManagerStrategy"];
	#pwmb: ReturnType<typeof usePasswordManagerBadge>;
	#initialLoad: InitialLoad;

	constructor(props: PinInputRootStateProps) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#pushPasswordManagerStrategy = props.pushPasswordManagerStrategy;
		this.value = props.value;
		this.#pattern = props.pattern;
		this.#maxLength = props.maxLength;
		this.#onComplete = props.onComplete;
		this.#disabled = props.disabled;
		this.#textAlign = props.textAlign;
		this.#autocomplete = props.autocomplete;
		this.#inputmode = props.inputmode;
		this.#inputId = props.inputId;
		this.#onPaste = props.onPaste;

		this.#initialLoad = {
			value: this.value,
			isIOS:
				typeof window !== "undefined" &&
				window?.CSS?.supports("-webkit-touch-callout", "none"),
		};

		this.#pwmb = usePasswordManagerBadge({
			containerRef: this.#ref,
			inputRef: this.#inputRef,
			isFocused: this.#isFocused,
			pushPasswordManagerStrategy: this.#pushPasswordManagerStrategy,
		});

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		useRefById({
			id: this.#inputId,
			ref: this.#inputRef,
		});

		$effect(() => {
			let unsub = noop;
			return untrack(() => {
				const input = this.#inputRef.current;
				const container = this.#ref.current;

				if (!input || !container) return;

				if (this.#initialLoad.value.current !== input.value) {
					this.value.current = input.value;
				}

				this.#prevInputMetadata.prev = [
					input.selectionStart,
					input.selectionEnd,
					input.selectionDirection ?? "none",
				];

				unsub = addEventListener(
					document,
					"selectionchange",
					this.#onDocumentSelectionChange,
					{ capture: true }
				);

				this.#onDocumentSelectionChange();
				if (document.activeElement === input) {
					this.#isFocused.current = true;
				}

				if (!document.getElementById("pin-input-style")) {
					this.#applyStyles();
				}

				const updateRootHeight = () => {
					if (container) {
						container.style.setProperty(
							"--bits-pin-input-root-height",
							`${input.clientHeight}px`
						);
					}
				};
				updateRootHeight();

				const resizeObserver = new ResizeObserver(updateRootHeight);
				resizeObserver.observe(input);

				return () => {
					unsub();
					resizeObserver.disconnect();
				};
			});
		});

		$effect(() => {
			this.value.current;
			this.#inputRef.current;
			syncTimeouts(() => {
				const input = this.#inputRef.current;
				if (!input) return;
				// forcefully remove :autofill state
				input.dispatchEvent(new Event("input"));

				// update selection state
				const start = input.selectionStart;
				const end = input.selectionEnd;
				const dir = input.selectionDirection ?? "none";
				if (start !== null && end !== null) {
					this.#mirrorSelectionStart = start;
					this.#mirrorSelectionEnd = end;
					this.#prevInputMetadata.prev = [start, end, dir];
				}
			});
		});

		$effect(() => {
			// invoke `onComplete` when the input is completely filled.
			const value = this.value.current;
			const prevValue = this.#previousValue.current;
			const maxLength = this.#maxLength.current;
			const onComplete = this.#onComplete.current;

			if (prevValue === undefined) return;
			if (value !== prevValue && prevValue.length < maxLength && value.length === maxLength) {
				onComplete(value);
			}
		});

		this.onkeydown = this.onkeydown.bind(this);

		this.oninput = this.oninput.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onmouseover = this.onmouseover.bind(this);
		this.onmouseleave = this.onmouseleave.bind(this);
		this.onblur = this.onblur.bind(this);
		this.onpaste = this.onpaste.bind(this);
	}

	keysToIgnore = [
		"Backspace",
		"Delete",
		"ArrowLeft",
		"ArrowRight",
		"ArrowUp",
		"ArrowDown",
		"Home",
		"End",
		"Escape",
		"Enter",
		"Tab",
		"Shift",
		"Control",
		"Meta",
	];

	onkeydown(e: BitsKeyboardEvent) {
		const key = e.key;
		if (this.keysToIgnore.includes(key)) return;
		if (key && this.#regexPattern && !this.#regexPattern.test(key)) {
			e.preventDefault();
		}
	}

	#rootStyles = $derived.by(() => ({
		position: "relative",
		cursor: this.#disabled.current ? "default" : "text",
		userSelect: "none",
		WebkitUserSelect: "none",
		pointerEvents: "none",
	}));

	rootProps = $derived.by(
		() =>
			({
				id: this.#id.current,
				[ROOT_ATTR]: "",
				style: this.#rootStyles,
			}) as const
	);

	inputWrapperProps = $derived.by(
		() =>
			({
				style: {
					position: "absolute",
					inset: 0,
					pointerEvents: "none",
				},
			}) as const
	);

	#inputStyle = $derived.by(() => ({
		position: "absolute",
		inset: 0,
		width: this.#pwmb.willPushPwmBadge
			? `calc(100% + ${this.#pwmb.PWM_BADGE_SPACE_WIDTH})`
			: "100%",
		clipPath: this.#pwmb.willPushPwmBadge
			? `inset(0 ${this.#pwmb.PWM_BADGE_SPACE_WIDTH} 0 0)`
			: undefined,
		height: "100%",
		display: "flex",
		textAlign: this.#textAlign.current,
		opacity: "1",
		color: "transparent",
		pointerEvents: "all",
		background: "transparent",
		caretColor: "transparent",
		border: "0 solid transparent",
		outline: "0 solid transparent",
		boxShadow: "none",
		lineHeight: "1",
		letterSpacing: "-.5em",
		fontSize: "var(--bits-pin-input-root-height)",
		fontFamily: "monospace",
		fontVariantNumeric: "tabular-nums",
	}));

	#applyStyles() {
		const styleEl = document.createElement("style");
		styleEl.id = "pin-input-style";
		document.head.appendChild(styleEl);

		if (styleEl.sheet) {
			const autoFillStyles =
				"background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";

			safeInsertRule(
				styleEl.sheet,
				"[data-pin-input-input]::selection { background: transparent !important; color: transparent !important; }"
			);
			safeInsertRule(styleEl.sheet, `[data-pin-input-input]:autofill { ${autoFillStyles} }`);
			safeInsertRule(
				styleEl.sheet,
				`[data-pin-input-input]:-webkit-autofill { ${autoFillStyles} }`
			);
			// iOS
			safeInsertRule(
				styleEl.sheet,
				`@supports (-webkit-touch-callout: none) { [data-pin-input-input] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }`
			);
			// PWM badges
			safeInsertRule(
				styleEl.sheet,
				`[data-pin-input-input] + * { pointer-events: all !important; }`
			);
		}
	}

	#onDocumentSelectionChange = () => {
		const input = this.#inputRef.current;
		const container = this.#ref.current;
		if (!input || !container) return;

		if (document.activeElement !== input) {
			this.#mirrorSelectionStart = null;
			this.#mirrorSelectionEnd = null;
			return;
		}

		const selStart = input.selectionStart;
		const selEnd = input.selectionEnd;
		const selDir = input.selectionDirection ?? "none";
		const maxLength = input.maxLength;
		const val = input.value;
		const prev = this.#prevInputMetadata.prev;

		let start = -1;
		let end = -1;
		let direction: "forward" | "backward" | "none" | undefined;
		if (val.length !== 0 && selStart !== null && selEnd !== null) {
			const isSingleCaret = selStart === selEnd;
			const isInsertMode = selStart === val.length && val.length < maxLength;

			if (isSingleCaret && !isInsertMode) {
				const c = selStart;
				if (c === 0) {
					start = 0;
					end = 1;
					direction = "forward";
				} else if (c === maxLength) {
					start = c - 1;
					end = c;
					direction = "backward";
				} else if (maxLength > 1 && val.length > 1) {
					let offset = 0;
					if (prev[0] !== null && prev[1] !== null) {
						direction = c < prev[0] ? "backward" : "forward";
						const wasPreviouslyInserting = prev[0] === prev[1] && prev[0] < maxLength;
						if (direction === "backward" && !wasPreviouslyInserting) {
							offset = -1;
						}
					}

					start = offset - c;
					end = offset + c + 1;
				}
			}

			if (start !== -1 && end !== -1 && start !== end) {
				this.#inputRef.current?.setSelectionRange(start, end, direction);
			}
		}

		// finally update the state
		const s = start !== -1 ? start : selStart;
		const e = end !== -1 ? end : selEnd;
		const dir = direction ?? selDir;
		this.#mirrorSelectionStart = s;
		this.#mirrorSelectionEnd = e;
		this.#prevInputMetadata.prev = [s, e, dir];
	};

	oninput(e: BitsEvent<Event, HTMLInputElement>) {
		const newValue = e.currentTarget.value.slice(0, this.#maxLength.current);
		if (newValue.length > 0 && this.#regexPattern && !this.#regexPattern.test(newValue)) {
			e.preventDefault();
			return;
		}

		const maybeHasDeleted =
			typeof this.#previousValue.current === "string" &&
			newValue.length < this.#previousValue.current.length;

		if (maybeHasDeleted) {
			// Since cutting/deleting text doesn't trigger
			// selectionchange event, we'll have to dispatch it manually.
			// NOTE: The following line also triggers when cmd+A then pasting
			// a value with smaller length, which is not ideal for performance.
			document.dispatchEvent(new Event("selectionchange"));
		}
		this.value.current = newValue;
	}

	onfocus = (_: BitsFocusEvent<HTMLInputElement>) => {
		const input = this.#inputRef.current;
		if (input) {
			const start = Math.min(input.value.length, this.#maxLength.current - 1);
			const end = input.value.length;
			input.setSelectionRange(start, end);
			this.#mirrorSelectionStart = start;
			this.#mirrorSelectionEnd = end;
		}
		this.#isFocused.current = true;
	};

	onpaste = (e: BitsEvent<ClipboardEvent>) => {
		const input = this.#inputRef.current;

		if (!this.#initialLoad.isIOS) {
			if (!e.clipboardData || !input) return;
			const content = e.clipboardData.getData("text/plain");
			const sanitizedContent = this.#onPaste?.current?.(content) ?? content;
			if (
				sanitizedContent.length > 0 &&
				this.#regexPattern &&
				!this.#regexPattern.test(sanitizedContent)
			) {
				e.preventDefault();
				return;
			}
		}

		if (!this.#initialLoad.isIOS || !e.clipboardData || !input) return;
		const content = e.clipboardData.getData("text/plain");
		e.preventDefault();

		const sanitizedContent = this.#onPaste?.current?.(content) ?? content;
		if (
			sanitizedContent.length > 0 &&
			this.#regexPattern &&
			!this.#regexPattern.test(sanitizedContent)
		) {
			return;
		}

		const start = input.selectionStart === null ? undefined : input.selectionStart;
		const end = input.selectionEnd === null ? undefined : input.selectionEnd;

		const isReplacing = start !== end;

		const initNewVal = this.value.current;

		const newValueUncapped = isReplacing
			? initNewVal.slice(0, start) + sanitizedContent + initNewVal.slice(end)
			: initNewVal.slice(0, start) + sanitizedContent + initNewVal.slice(start);

		const newValue = newValueUncapped.slice(0, this.#maxLength.current);

		if (newValue.length > 0 && this.#regexPattern && !this.#regexPattern.test(newValue)) {
			return;
		}

		input.value = newValue;
		this.value.current = newValue;

		const selStart = Math.min(newValue.length, this.#maxLength.current - 1);
		const selEnd = newValue.length;

		input.setSelectionRange(selStart, selEnd);
		this.#mirrorSelectionStart = selStart;
		this.#mirrorSelectionEnd = selEnd;
	};

	onmouseover = (_: BitsMouseEvent) => {
		this.#isHoveringInput = true;
	};

	onmouseleave = (_: BitsMouseEvent) => {
		this.#isHoveringInput = false;
	};

	onblur = (_: BitsFocusEvent) => {
		if (this.#prevInputMetadata.willSyntheticBlur) {
			this.#prevInputMetadata.willSyntheticBlur = false;
			return;
		}
		this.#isFocused.current = false;
	};

	inputProps = $derived.by(() => ({
		id: this.#inputId.current,
		style: this.#inputStyle,
		autocomplete: this.#autocomplete.current || "one-time-code",
		"data-pin-input-input": "",
		"data-pin-input-input-mss": this.#mirrorSelectionStart,
		"data-pin-input-input-mse": this.#mirrorSelectionEnd,
		inputmode: this.#inputmode.current,
		pattern: this.#regexPattern?.source,
		maxlength: this.#maxLength.current,
		value: this.value.current,
		disabled: getDisabled(this.#disabled.current),
		//
		onpaste: this.onpaste,
		oninput: this.oninput,
		onkeydown: this.onkeydown,
		onmouseover: this.onmouseover,
		onmouseleave: this.onmouseleave,
		onfocus: this.onfocus,
		onblur: this.onblur,
	}));

	#cells = $derived.by(() =>
		Array.from({ length: this.#maxLength.current }).map((_, idx) => {
			const isActive =
				this.#isFocused.current &&
				this.#mirrorSelectionStart !== null &&
				this.#mirrorSelectionEnd !== null &&
				((this.#mirrorSelectionStart === this.#mirrorSelectionEnd &&
					idx === this.#mirrorSelectionStart) ||
					(idx >= this.#mirrorSelectionStart && idx < this.#mirrorSelectionEnd));

			const char = this.value.current[idx] !== undefined ? this.value.current[idx] : null;

			return {
				char,
				isActive,
				hasFakeCaret: isActive && char === null,
			} satisfies PinInputCell;
		})
	);

	snippetProps = $derived.by(() => ({
		cells: this.#cells,
		isFocused: this.#isFocused.current,
		isHovering: this.#isHoveringInput,
	}));
}

type PinInputCellStateProps = WithRefProps &
	ReadableBoxedValues<{
		cell: PinInputCell;
	}>;

class PinInputCellState {
	#id: PinInputCellStateProps["id"];
	#ref: PinInputCellStateProps["ref"];
	#cell: PinInputCellStateProps["cell"];

	constructor(props: PinInputCellStateProps) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#cell = props.cell;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[CELL_ATTR]: "",
				"data-active": this.#cell.current.isActive ? "" : undefined,
				"data-inactive": !this.#cell.current.isActive ? "" : undefined,
			}) as const
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function syncTimeouts(cb: (...args: any[]) => unknown): number[] {
	const t1 = setTimeout(cb, 0); // For faster machines
	const t2 = setTimeout(cb, 1_0);
	const t3 = setTimeout(cb, 5_0);
	return [t1, t2, t3];
}

function safeInsertRule(sheet: CSSStyleSheet, rule: string) {
	try {
		sheet.insertRule(rule);
	} catch {
		console.error("pin input could not insert CSS rule:", rule);
	}
}

export function usePinInput(props: PinInputRootStateProps) {
	return new PinInputRootState(props);
}

export function usePinInputCell(props: PinInputCellStateProps) {
	return new PinInputCellState(props);
}
