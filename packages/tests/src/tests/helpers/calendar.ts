export function getSelectedDays(calendar: HTMLElement) {
	return Array.from(calendar.querySelectorAll<HTMLElement>("[data-bits-day][data-selected]"));
}

export function getSelectedDay(calendar: HTMLElement) {
	return calendar.querySelector<HTMLElement>("[data-bits-day][data-selected]") as HTMLElement;
}
