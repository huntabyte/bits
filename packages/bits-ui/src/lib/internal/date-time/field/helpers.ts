import type { DateValue } from "@internationalized/date";
import { styleToString } from "svelte-toolbelt";
import type { Formatter } from "../formatter.js";
import { getPlaceholder } from "../placeholders.js";
import { hasTime, isZonedDateTime } from "../utils.js";
import type {
	DateAndTimeSegmentObj,
	DateSegmentPart,
	EditableSegmentPart,
	SegmentContentObj,
	SegmentPart,
	SegmentStateMap,
	SegmentValueObj,
	TimeSegmentPart,
} from "./types.js";
import {
	ALL_SEGMENT_PARTS,
	DATE_SEGMENT_PARTS,
	EDITABLE_SEGMENT_PARTS,
	TIME_SEGMENT_PARTS,
} from "./parts.js";
import { getSegments } from "./segments.js";
import { isBrowser, isNull, isNumberString } from "$lib/internal/is.js";
import { useId } from "$lib/internal/use-id.js";
import { kbd } from "$lib/internal/kbd.js";
import type { Granularity, HourCycle } from "$lib/shared/date/types.js";

export function initializeSegmentValues(granularity: Granularity) {
	const calendarDateTimeGranularities = ["hour", "minute", "second"];
	const initialParts = EDITABLE_SEGMENT_PARTS.map((part) => {
		if (part === "dayPeriod") {
			return [part, "AM"];
		}
		return [part, null];
	}).filter(([key]) => {
		if (key === "literal" || key === null) return false;
		if (granularity === "day") {
			return !calendarDateTimeGranularities.includes(key!);
		} else {
			return true;
		}
	});
	return Object.fromEntries(initialParts) as SegmentValueObj;
}

type SharedContentProps = {
	granularity: Granularity;
	dateRef: DateValue;
	formatter: Formatter;
	hideTimeZone: boolean;
	hourCycle: HourCycle | undefined;
};

type CreateContentObjProps = SharedContentProps & {
	segmentValues: SegmentValueObj;
	locale: string;
};

type CreateContentArrProps = SharedContentProps & {
	contentObj: SegmentContentObj;
};

function createContentObj(props: CreateContentObjProps) {
	const { segmentValues, formatter, locale, dateRef } = props;

	const content = Object.keys(segmentValues).reduce((obj, part) => {
		if (!isSegmentPart(part)) return obj;
		if ("hour" in segmentValues && part === "dayPeriod") {
			const value = segmentValues[part];
			if (!isNull(value)) {
				obj[part] = value;
			} else {
				obj[part] = getPlaceholder(part, "AM", locale);
			}
		} else {
			obj[part] = getPartContent(part);
		}

		return obj;
	}, {} as SegmentContentObj);

	function getPartContent(part: DateSegmentPart | TimeSegmentPart) {
		if ("hour" in segmentValues) {
			const value = segmentValues[part];
			const leadingZero = typeof value === "string" && value?.startsWith("0");
			const intValue = value !== null ? Number.parseInt(value) : null;

			if (value === "0" && part !== "year") {
				return "0";
			} else if (!isNull(value) && !isNull(intValue)) {
				const formatted = formatter.part(dateRef.set({ [part]: value }), part, {
					hourCycle: props.hourCycle === 24 ? "h23" : undefined,
				});

				/**
				 * If we're operating in a 12 hour clock and the part is an hour, we handle
				 * the conversion to 12 hour format with 2 digit hours and leading zeros here.
				 */
				if (part === "hour" && "dayPeriod" in segmentValues && props.hourCycle !== 24) {
					/**
					 * If the value is over 12, we convert to 12 hour format and add leading
					 * zeroes if the value is less than 10.
					 */
					if (intValue > 12) {
						const hour = intValue - 12;
						if (hour === 0) {
							return "12";
						} else if (hour < 10) {
							return `0${hour}`;
						} else {
							return `${hour}`;
						}
					}

					/**
					 * If the value is 0, we convert to 12, since 0 is not a valid 12 hour time.
					 */
					if (intValue === 0) {
						return "12";
					}

					/**
					 * If the value is less than 10, we add a leading zero to the value.
					 */
					if (intValue < 10) {
						return `0${intValue}`;
					}

					/**
					 * Otherwise, we don't need to do anything to the value.
					 */
					return `${intValue}`;
				}

				if (part === "year") {
					return `${value}`;
				}

				if (leadingZero && formatted.length === 1) {
					return `0${formatted}`;
				}
				return formatted;
			} else {
				return getPlaceholder(part, "", locale);
			}
		} else {
			if (isDateSegmentPart(part)) {
				const value = segmentValues[part];
				const leadingZero = typeof value === "string" && value?.startsWith("0");
				if (value === "0") {
					return "0";
				} else if (!isNull(value)) {
					const formatted = formatter.part(dateRef.set({ [part]: value }), part);
					if (part === "year") {
						return `${value}`;
					}
					if (leadingZero && formatted.length === 1) {
						return `0${formatted}`;
					}
					return formatted;
				} else {
					return getPlaceholder(part, "", locale);
				}
			}
			return "";
		}
	}

	return content;
}

function createContentArr(props: CreateContentArrProps) {
	const { granularity, dateRef, formatter, contentObj, hideTimeZone, hourCycle } = props;
	const parts = formatter.toParts(dateRef, getOptsByGranularity(granularity, hourCycle));
	const segmentContentArr = parts
		.map((part) => {
			const defaultParts = ["literal", "dayPeriod", "timeZoneName", null];

			if (defaultParts.includes(part.type) || !isSegmentPart(part.type)) {
				return {
					part: part.type,
					value: part.value,
				};
			}
			return {
				part: part.type,
				value: contentObj[part.type],
			};
		})
		.filter((segment): segment is { part: SegmentPart; value: string } => {
			if (isNull(segment.part) || isNull(segment.value)) return false;
			if (segment.part === "timeZoneName" && (!isZonedDateTime(dateRef) || hideTimeZone)) {
				return false;
			}
			return true;
		});
	return segmentContentArr;
}

type CreateContentProps = CreateContentObjProps;

export function createContent(props: CreateContentProps) {
	const contentObj = createContentObj(props);
	const contentArr = createContentArr({
		contentObj,
		...props,
	});
	return {
		obj: contentObj,
		arr: contentArr,
	};
}

function getOptsByGranularity(granularity: Granularity, hourCycle: HourCycle | undefined) {
	const opts: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
		hourCycle: hourCycle === 24 ? "h23" : undefined,
		hour12: hourCycle === 24 ? false : undefined,
	};

	if (granularity === "day") {
		delete opts.second;
		delete opts.hour;
		delete opts.minute;
		delete opts.timeZoneName;
	}
	if (granularity === "hour") {
		delete opts.minute;
	}
	if (granularity === "minute") {
		delete opts.second;
	}

	return opts;
}

export function initSegmentStates() {
	return EDITABLE_SEGMENT_PARTS.reduce((acc, key) => {
		acc[key] = {
			lastKeyZero: false,
			hasLeftFocus: true,
			updating: null,
		};
		return acc;
	}, {} as SegmentStateMap);
}

export function initSegmentIds() {
	return Object.fromEntries(
		ALL_SEGMENT_PARTS.map((part) => {
			return [part, useId()];
		}).filter(([key]) => key !== "literal")
	);
}

export function isDateSegmentPart(part: unknown): part is DateSegmentPart {
	return DATE_SEGMENT_PARTS.includes(part as DateSegmentPart);
}

export function isSegmentPart(part: string): part is EditableSegmentPart {
	return EDITABLE_SEGMENT_PARTS.includes(part as EditableSegmentPart);
}

export function isAnySegmentPart(part: unknown): part is SegmentPart {
	return ALL_SEGMENT_PARTS.includes(part as EditableSegmentPart);
}

/**
 * Get the segments being used/ are rendered in the DOM.
 * We're using this to determine when to set the value of
 * the date picker, which is when all the segments have
 * been filled.
 */
function getUsedSegments(fieldNode: HTMLElement | null) {
	if (!isBrowser || !fieldNode) return [];
	const usedSegments = getSegments(fieldNode)
		.map((el) => el.dataset.segment)
		.filter((part): part is EditableSegmentPart => {
			return EDITABLE_SEGMENT_PARTS.includes(part as EditableSegmentPart);
		});
	return usedSegments;
}

type GetValueFromSegments = {
	segmentObj: SegmentValueObj;
	fieldNode: HTMLElement | null;
	dateRef: DateValue;
};

export function getValueFromSegments(props: GetValueFromSegments) {
	const { segmentObj, fieldNode, dateRef } = props;
	const usedSegments = getUsedSegments(fieldNode);
	let date = dateRef;

	for (const part of usedSegments) {
		if ("hour" in segmentObj) {
			const value = segmentObj[part];
			if (isNull(value)) continue;
			date = date.set({ [part]: segmentObj[part] });
		} else if (isDateSegmentPart(part)) {
			const value = segmentObj[part];
			if (isNull(value)) continue;
			date = date.set({ [part]: segmentObj[part] });
		}
	}

	return date;
}

/**
 * Check if all the segments being used have been filled.
 * We use this to determine when we should set the value
 * store of the date field(s).
 *
 * @param segmentValues - The current `SegmentValueObj`
 * @param fieldNode  - The id of the date field
 */
export function areAllSegmentsFilled(
	segmentValues: SegmentValueObj,
	fieldNode: HTMLElement | null
) {
	const usedSegments = getUsedSegments(fieldNode);
	for (const part of usedSegments) {
		if ("hour" in segmentValues) {
			if (segmentValues[part] === null) {
				return false;
			}
		} else if (isDateSegmentPart(part)) {
			if (segmentValues[part] === null) {
				return false;
			}
		}
	}
	return true;
}

/**
 * Determines if the provided object is a valid `DateAndTimeSegmentObj`
 * by checking if it has the correct keys and values for each key.
 */
export function isDateAndTimeSegmentObj(obj: unknown): obj is DateAndTimeSegmentObj {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}
	return Object.entries(obj).every(([key, value]) => {
		const validKey =
			TIME_SEGMENT_PARTS.includes(key as TimeSegmentPart) ||
			DATE_SEGMENT_PARTS.includes(key as DateSegmentPart);

		const validValue =
			key === "dayPeriod"
				? value === "AM" || value === "PM" || value === null
				: typeof value === "string" || typeof value === "number" || value === null;

		return validKey && validValue;
	});
}

/**
 * Infer the granularity to use based on the
 * value and granularity props.
 */
export function inferGranularity(
	value: DateValue,
	granularity: Granularity | undefined
): Granularity {
	if (granularity) return granularity;
	if (hasTime(value)) return "minute";
	return "day";
}

export function isAcceptableSegmentKey(key: string) {
	const acceptableSegmentKeys = [
		kbd.ENTER,
		kbd.ARROW_UP,
		kbd.ARROW_DOWN,
		kbd.ARROW_LEFT,
		kbd.ARROW_RIGHT,
		kbd.BACKSPACE,
		kbd.SPACE,
	];
	if (acceptableSegmentKeys.includes(key)) return true;
	if (isNumberString(key)) return true;
	return false;
}

/**
 * Determines if the element with the provided id is the first focusable
 * segment in the date field with the provided fieldId.
 *
 * @param id - The id of the element to check if it's the first segment
 * @param fieldNode - The id of the date field associated with the segment
 */
export function isFirstSegment(id: string, fieldNode: HTMLElement | null) {
	if (!isBrowser) return false;
	const segments = getSegments(fieldNode);
	return segments.length ? segments[0]!.id === id : false;
}

/**
 * Creates or updates a description element for a date field
 * which enables screen readers to read the date field's value.
 *
 * This element is hidden from view, and is portalled to the body
 * so it can be associated via `aria-describedby` and read by
 * screen readers as the user interacts with the date field.
 */
export function setDescription(id: string, formatter: Formatter, value: DateValue) {
	if (!isBrowser) return;
	const valueString = formatter.selectedDate(value);
	const el = document.getElementById(id);
	if (!el) {
		const div = document.createElement("div");
		div.style.cssText = styleToString({
			display: "none",
		});
		div.id = id;
		div.innerText = `Selected Date: ${valueString}`;
		document.body.appendChild(div);
	} else {
		el.innerText = `Selected Date: ${valueString}`;
	}
}

/**
 * Removes the description element for the date field with
 * the provided ID. This function should be called when the
 * date field is unmounted.
 */
export function removeDescriptionElement(id: string) {
	if (!isBrowser) return;
	const el = document.getElementById(id);
	if (!el) return;
	document.body.removeChild(el);
}
