export function getDataOpenClosed(condition: boolean): "open" | "closed" {
	return condition ? "open" : "closed";
}

export function getDataChecked(condition: boolean): "checked" | "unchecked" {
	return condition ? "checked" : "unchecked";
}

export function getAriaDisabled(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaReadonly(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaExpanded(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getDataDisabled(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getAriaRequired(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaSelected(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaChecked(
	checked: boolean,
	indeterminate: boolean
): "true" | "false" | "mixed" {
	if (indeterminate) {
		return "mixed";
	}
	return checked ? "true" : "false";
}

export function getAriaOrientation(
	orientation: "horizontal" | "vertical"
): "horizontal" | "vertical" {
	return orientation;
}

export function getAriaHidden(condition: boolean): "true" | undefined {
	return condition ? "true" : undefined;
}

export function getAriaInvalid(condition: boolean): "true" | undefined {
	return condition ? "true" : undefined;
}

export function getDataOrientation(
	orientation: "horizontal" | "vertical"
): "horizontal" | "vertical" {
	return orientation;
}

export function getDataInvalid(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataRequired(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataReadonly(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataSelected(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataUnavailable(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getHidden(condition: boolean): true | undefined {
	return condition ? true : undefined;
}

export function getDisabled(condition: boolean): true | undefined {
	return condition ? true : undefined;
}

export function getAriaPressed(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getRequired(condition: boolean): true | undefined {
	return condition ? true : undefined;
}
