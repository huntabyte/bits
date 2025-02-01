import { getContext, hasContext, setContext } from "svelte";

type CopyToClipboardProps = {
	timeout?: number;
	onCopy?: () => void;
};

export class CopyToClipboard {
	isCopied = $state(false);
	onCopy: CopyToClipboardProps["onCopy"];
	timeout: CopyToClipboardProps["timeout"];
	codeString = $state("");

	constructor(props?: CopyToClipboardProps) {
		this.onCopy = props?.onCopy;
		this.timeout = props?.timeout ?? 2000;
	}

	setCodeString = (v: string) => {
		this.codeString = v;
	};

	copyToClipboard = (value: string = this.codeString) => {
		if (typeof window === "undefined" || !navigator.clipboard.writeText) {
			return;
		}

		if (!value) return;

		navigator.clipboard.writeText(value).then(() => {
			this.isCopied = true;

			if (this.onCopy) {
				this.onCopy();
			}

			setTimeout(() => {
				this.isCopied = false;
			}, this.timeout);
		}, console.error);
	};

	setCodeStringAction = (node: HTMLElement) => {
		this.codeString = node.innerText.trim() ?? "";
	};
}

const COPY_TO_CLIPBOARD_KEY = Symbol("copy-to-clipboard");

export function setCopyToClipboard(props?: CopyToClipboardProps) {
	return setContext(COPY_TO_CLIPBOARD_KEY, new CopyToClipboard(props));
}

export function useCopyToClipboard() {
	if (!hasContext(COPY_TO_CLIPBOARD_KEY)) {
		return null;
	}
	return getContext<CopyToClipboard>(COPY_TO_CLIPBOARD_KEY);
}
