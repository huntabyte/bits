import type { DateValue } from "@internationalized/date";
import { untrack } from "svelte";
import { box, onDestroyEffect, useRefById } from "svelte-toolbelt";
import { Context } from "runed";
import type { DateFieldRootState } from "../date-field/date-field.svelte.js";
import { DateFieldInputState, useDateFieldRoot } from "../date-field/date-field.svelte.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/use-id.js";
import type {
	DateOnInvalid,
	DateRange,
	DateRangeValidator,
	SegmentPart,
} from "$lib/shared/index.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { getDataDisabled, getDataInvalid } from "$lib/internal/attrs.js";
import type { Granularity } from "$lib/shared/date/types.js";
import { type Formatter, createFormatter } from "$lib/internal/date-time/formatter.js";
import { removeDescriptionElement } from "$lib/internal/date-time/field/helpers.js";
import { isBefore } from "$lib/internal/date-time/utils.js";
import { getFirstSegment } from "$lib/internal/date-time/field/segments.js";

export const DATE_RANGE_FIELD_ROOT_ATTR = "data-date-range-field-root";
const DATE_RANGE_FIELD_LABEL_ATTR = "data-date-range-field-label";

type DateRangeFieldRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: DateRange;
		placeholder: DateValue;
		startValue: DateValue | undefined;
		endValue: DateValue | undefined;
	}> &
		ReadableBoxedValues<{
			readonlySegments: SegmentPart[];
			validate: DateRangeValidator | undefined;
			onInvalid: DateOnInvalid | undefined;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			readonly: boolean;
			granularity: Granularity | undefined;
			hourCycle: 12 | 24 | undefined;
			locale: string;
			hideTimeZone: boolean;
			required: boolean;
			errorMessageId: string | undefined;
		}>
>;

export class DateRangeFieldRootState {
	ref: DateRangeFieldRootStateProps["ref"];
	id: DateRangeFieldRootStateProps["id"];
	value: DateRangeFieldRootStateProps["value"];
	placeholder: DateRangeFieldRootStateProps["placeholder"];
	readonlySegments: DateRangeFieldRootStateProps["readonlySegments"];
	validate: DateRangeFieldRootStateProps["validate"];
	minValue: DateRangeFieldRootStateProps["minValue"];
	maxValue: DateRangeFieldRootStateProps["maxValue"];
	disabled: DateRangeFieldRootStateProps["disabled"];
	readonly: DateRangeFieldRootStateProps["readonly"];
	granularity: DateRangeFieldRootStateProps["granularity"];
	hourCycle: DateRangeFieldRootStateProps["hourCycle"];
	locale: DateRangeFieldRootStateProps["locale"];
	hideTimeZone: DateRangeFieldRootStateProps["hideTimeZone"];
	required: DateRangeFieldRootStateProps["required"];
	startValue: DateRangeFieldRootStateProps["startValue"];
	endValue: DateRangeFieldRootStateProps["endValue"];
	onInvalid: DateRangeFieldRootStateProps["onInvalid"];
	errorMessageId: DateRangeFieldRootStateProps["errorMessageId"];
	startFieldState: DateFieldRootState | undefined = undefined;
	endFieldState: DateFieldRootState | undefined = undefined;
	descriptionId = useId();
	formatter: Formatter;
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	startValueComplete = $derived.by(() => this.startValue.current !== undefined);
	endValueComplete = $derived.by(() => this.endValue.current !== undefined);
	rangeComplete = $derived(this.startValueComplete && this.endValueComplete);
	mergedValues = $derived.by(() => {
		if (this.startValue.current === undefined || this.endValue.current === undefined) {
			return {
				start: undefined,
				end: undefined,
			};
		} else {
			return {
				start: this.startValue.current,
				end: this.endValue.current,
			};
		}
	});

	constructor(props: DateRangeFieldRootStateProps) {
		this.value = props.value;
		this.startValue = props.startValue;
		this.endValue = props.endValue;
		this.placeholder = props.placeholder;
		this.validate = props.validate;
		this.onInvalid = props.onInvalid;
		this.minValue = props.minValue;
		this.maxValue = props.maxValue;
		this.disabled = props.disabled;
		this.readonly = props.readonly;
		this.granularity = props.granularity;
		this.readonlySegments = props.readonlySegments;
		this.hourCycle = props.hourCycle;
		this.locale = props.locale;
		this.hideTimeZone = props.hideTimeZone;
		this.required = props.required;
		this.errorMessageId = props.errorMessageId;
		this.formatter = createFormatter(this.locale.current);
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.fieldNode = node;
			},
		});

		onDestroyEffect(() => {
			removeDescriptionElement(this.descriptionId);
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.locale.current) return;
			this.formatter.setLocale(this.locale.current);
		});

		$effect(() => {
			const startValue = this.value.current.start;
			untrack(() => {
				if (startValue) this.placeholder.current = startValue;
			});
		});

		$effect(() => {
			const endValue = this.value.current.end;
			untrack(() => {
				if (endValue) this.placeholder.current = endValue;
			});
		});

		/**
		 * Sync values set programatically with the `startValue` and `endValue`
		 */
		$effect(() => {
			const value = this.value.current;
			untrack(() => {
				if (value.start !== undefined && value.start !== this.startValue.current) {
					this.#setStartValue(value.start);
				}
				if (value.end !== undefined && value.end !== this.endValue.current) {
					this.#setEndValue(value.end);
				}
			});
		});

		// TODO: Handle description element

		$effect(() => {
			const placeholder = untrack(() => this.placeholder.current);
			const startValue = untrack(() => this.startValue.current);

			if (this.startValueComplete && placeholder !== startValue) {
				untrack(() => {
					if (startValue) {
						this.placeholder.current = startValue;
					}
				});
			}
		});

		$effect(() => {
			this.value.current = this.mergedValues;
		});
	}

	validationStatus = $derived.by(() => {
		const value = this.value.current;
		if (value === undefined) return false as const;
		if (value.start === undefined || value.end === undefined) return false as const;

		const msg = this.validate.current?.({
			start: value.start,
			end: value.end,
		});

		if (msg) {
			return {
				reason: "custom",
				message: msg,
			} as const;
		}

		const minValue = this.minValue.current;
		if (minValue && value.start && isBefore(value.start, minValue)) {
			return {
				reason: "min",
			} as const;
		}

		const maxValue = this.maxValue.current;

		if (
			(maxValue && value.end && isBefore(maxValue, value.end)) ||
			(maxValue && value.start && isBefore(maxValue, value.start))
		) {
			return {
				reason: "max",
			} as const;
		}

		return false as const;
	});

	isInvalid = $derived.by(() => {
		if (this.validationStatus === false) return false;
		return true;
	});

	#setStartValue(value: DateValue | undefined) {
		this.startValue.current = value;
	}

	#setEndValue(value: DateValue | undefined) {
		this.endValue.current = value;
	}

	/**
	 * These props are used to override those of the child fields.
	 * TODO:
	 */
	childFieldPropOverrides = {};

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "group",
				[DATE_RANGE_FIELD_ROOT_ATTR]: "",
				"data-invalid": getDataInvalid(this.isInvalid),
			}) as const
	);
}

type DateRangeFieldLabelStateProps = WithRefProps;

class DateRangeFieldLabelState {
	#id: DateRangeFieldLabelStateProps["id"];
	#ref: DateRangeFieldLabelStateProps["ref"];
	#root: DateRangeFieldRootState;

	constructor(props: DateRangeFieldLabelStateProps, root: DateRangeFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.labelNode = node;
			},
		});
	}

	#onclick = () => {
		if (this.#root.disabled.current) return;
		const firstSegment = getFirstSegment(this.#root.fieldNode);
		if (!firstSegment) return;
		firstSegment.focus();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				// TODO: invalid state for field
				"data-invalid": getDataInvalid(this.#root.isInvalid),
				"data-disabled": getDataDisabled(this.#root.disabled.current),
				[DATE_RANGE_FIELD_LABEL_ATTR]: "",
				onclick: this.#onclick,
			}) as const
	);
}

type DateRangeFieldInputStateProps = WritableBoxedValues<{
	value: DateValue | undefined;
}> &
	ReadableBoxedValues<{
		name: string;
	}> &
	WithRefProps;

export const DateRangeFieldRootContext = new Context<DateRangeFieldRootState>(
	"DateRangeField.Root"
);

export function useDateRangeFieldRoot(props: DateRangeFieldRootStateProps) {
	return DateRangeFieldRootContext.set(new DateRangeFieldRootState(props));
}

export function useDateRangeFieldLabel(props: DateRangeFieldLabelStateProps) {
	return new DateRangeFieldLabelState(props, DateRangeFieldRootContext.get());
}

export function useDateRangeFieldInput(
	props: Omit<DateRangeFieldInputStateProps, "value">,
	type: "start" | "end"
) {
	const root = DateRangeFieldRootContext.get();
	const fieldState = useDateFieldRoot(
		{
			value: type === "start" ? root.startValue : root.endValue,
			disabled: root.disabled,
			readonly: root.readonly,
			readonlySegments: root.readonlySegments,
			validate: box.with(() => undefined),
			minValue: root.minValue,
			maxValue: root.maxValue,
			hourCycle: root.hourCycle,
			locale: root.locale,
			hideTimeZone: root.hideTimeZone,
			required: root.required,
			granularity: root.granularity,
			placeholder: root.placeholder,
			onInvalid: root.onInvalid,
			errorMessageId: root.errorMessageId,
			isInvalidProp: box.with(() => root.isInvalid),
		},
		root
	);

	return new DateFieldInputState({ name: props.name, id: props.id, ref: props.ref }, fieldState);
}
