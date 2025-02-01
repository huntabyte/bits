export function shouldTrapFocus({
	forceMount,
	present,
	trapFocus,
	open,
}: {
	forceMount: boolean;
	present: boolean;
	trapFocus: boolean;
	open: boolean;
}): boolean {
	if (forceMount) {
		return open && trapFocus;
	}
	return present && trapFocus && open;
}
