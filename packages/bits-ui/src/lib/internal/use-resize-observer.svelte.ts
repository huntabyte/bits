import type { Getter } from "svelte-toolbelt";

export function useResizeObserver(node: Getter<HTMLElement | null>, onResize: () => void) {
	$effect(() => {
		let rAF = 0;
		const _node = node();
		if (!_node) return;
		const resizeObserver = new ResizeObserver(() => {
			cancelAnimationFrame(rAF);
			rAF = window.requestAnimationFrame(onResize);
		});

		resizeObserver.observe(_node);
		return () => {
			window.cancelAnimationFrame(rAF);
			resizeObserver.unobserve(_node);
		};
	});
}
