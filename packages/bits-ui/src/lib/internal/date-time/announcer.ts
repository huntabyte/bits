import { srOnlyStylesString } from "svelte-toolbelt";
import { isBrowser, isHTMLElement } from "$lib/internal/is.js";

/**
 * Creates or gets an announcer element which is used to announce messages to screen readers.
 * Within the date components, we use this to announce when the values of the individual segments
 * change, as without it we get inconsistent behavior across screen readers.
 */
function initAnnouncer() {
	if (!isBrowser) return null;
	let el = document.querySelector("[data-bits-announcer]");
	if (!isHTMLElement(el)) {
		const div = document.createElement("div");
		div.style.cssText = srOnlyStylesString;
		div.setAttribute("data-bits-announcer", "");
		div.appendChild(createLog("assertive"));
		div.appendChild(createLog("polite"));
		el = div;
		document.body.insertBefore(el, document.body.firstChild);
	}

	/**
	 * Creates a log element for assertive or polite announcements.
	 */
	function createLog(kind: "assertive" | "polite") {
		const log = document.createElement("div");
		log.role = "log";
		log.ariaLive = kind;
		log.setAttribute("aria-relevant", "additions");
		return log;
	}

	/**
	 * Retrieves the log element for assertive or polite announcements.
	 */
	function getLog(kind: "assertive" | "polite") {
		if (!isHTMLElement(el)) return null;
		const log = el.querySelector(`[aria-live="${kind}"]`);
		if (!isHTMLElement(log)) return null;
		return log;
	}

	return {
		getLog,
	};
}

export type Announcer = ReturnType<typeof getAnnouncer>;

/**
 * Creates an announcer object that can be used to make `aria-live` announcements to screen readers.
 */
export function getAnnouncer() {
	const announcer = initAnnouncer();

	/**
	 * Announces a message to screen readers using the specified kind of announcement.
	 */
	function announce(
		value: string | null | number,
		kind: "assertive" | "polite" = "assertive",
		timeout = 7500
	) {
		if (!announcer || !isBrowser) return;
		const log = announcer.getLog(kind);
		const content = document.createElement("div");
		if (typeof value === "number") {
			value = value.toString();
		} else if (value === null) {
			value = "Empty";
		} else {
			value = value.trim();
		}
		content.innerText = value;
		if (kind === "assertive") {
			log?.replaceChildren(content);
		} else {
			log?.appendChild(content);
		}
		return setTimeout(() => {
			content.remove();
		}, timeout);
	}

	return {
		announce,
	};
}
