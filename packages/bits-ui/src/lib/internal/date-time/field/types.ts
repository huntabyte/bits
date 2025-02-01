import type {
	DATE_SEGMENT_PARTS,
	EDITABLE_SEGMENT_PARTS,
	NON_EDITABLE_SEGMENT_PARTS,
	TIME_SEGMENT_PARTS,
} from "./parts.js";

export type DateSegmentPart = (typeof DATE_SEGMENT_PARTS)[number];
export type TimeSegmentPart = (typeof TIME_SEGMENT_PARTS)[number];
export type EditableSegmentPart = (typeof EDITABLE_SEGMENT_PARTS)[number];
export type NonEditableSegmentPart = (typeof NON_EDITABLE_SEGMENT_PARTS)[number];
export type SegmentPart = EditableSegmentPart | NonEditableSegmentPart;

export type AnyExceptLiteral = Exclude<SegmentPart, "literal">;

export type DayPeriod = "AM" | "PM" | null;
export type DateSegmentObj = {
	[K in DateSegmentPart]: string | null;
};
export type TimeSegmentObj = {
	[K in TimeSegmentPart]: K extends "dayPeriod" ? DayPeriod : string | null;
};
export type DateAndTimeSegmentObj = DateSegmentObj & TimeSegmentObj;
export type SegmentValueObj = DateSegmentObj | DateAndTimeSegmentObj;
export type SegmentContentObj = Record<EditableSegmentPart, string>;

export type SegmentState = {
	lastKeyZero: boolean;
	hasLeftFocus: boolean;
	updating: string | null;
};

export type SegmentStateMap = {
	[K in EditableSegmentPart]: SegmentState;
};
