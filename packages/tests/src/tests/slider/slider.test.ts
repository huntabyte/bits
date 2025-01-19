// Credit to @paoloricciuti for this code via melt :)
import { render } from "@testing-library/svelte";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd, setupUserEvents } from "../utils.js";
import SliderMultiTest, { type SliderMultiTestProps } from "./slider-test-multi.svelte";
import SliderRangeTest, { type SliderMultiRangeTestProps } from "./slider-range-test.svelte";

const kbd = getTestKbd();

function renderSlider(props: SliderMultiTestProps = {}) {
	return render(SliderMultiTest, { ...props });
}
function renderSliderRange(props: SliderMultiRangeTestProps = {}) {
	return render(SliderRangeTest, { ...props });
}

function setup(props: SliderMultiTestProps = {}, kind: "default" | "range" = "default") {
	const user = setupUserEvents();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let returned: any;
	if (kind === "default") {
		returned = renderSlider(props);
	} else {
		returned = renderSliderRange(props);
	}
	const { getByTestId } = returned;
	const root = getByTestId("root");
	return { root, user, ...returned };
}

describe("slider (default)", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(SliderMultiTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have a thumb positioned at 30% of the container", async () => {
		const { getByTestId } = setup();

		const thumb = getByTestId("thumb");
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(30, thumb.style.left)).toBeTruthy();
	});
	it("should have a range that covers from 0 to 30%", async () => {
		const { getByTestId } = setup();

		const range = getByTestId("range");
		expect(range).toBeInTheDocument();

		expect(isCloseEnough(0, range.style.left)).toBeTruthy();
		expect(isCloseEnough(70, range.style.right)).toBeTruthy();
	});

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s",
		async (key) => {
			const { getByTestId, user } = setup();

			const thumb = getByTestId("thumb");
			const range = getByTestId("range");

			thumb.focus();
			await user.keyboard(key);

			expectPercentage({ percentage: 31, thumb, range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 1% when pressing %s",
		async (key) => {
			const { getByTestId, user } = setup();

			const thumb = getByTestId("thumb");
			const range = getByTestId("range");
			thumb.focus();

			await user.keyboard(key);

			expectPercentage({ percentage: 29, thumb, range });
		}
	);

	it("should go to minimum when pressing Home", async () => {
		const { getByTestId, user } = setup();

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(kbd.HOME);

		expectPercentage({ percentage: 0, thumb, range });
	});

	it("should go to maximum when pressing End", async () => {
		const { getByTestId, user } = setup();
		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(kbd.END);

		expectPercentage({ percentage: 100, thumb, range });
	});

	it("should not allow the value to change when the `disabled` prop is set to true", async () => {
		const { getByTestId, user } = setup({ disabled: true });

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(kbd.HOME);
		expectPercentage({ percentage: 30, thumb, range });
	});
});

describe("slider (range)", () => {
	it("should have no accessibility violations", async () => {
		const { container } = setup({}, "range");

		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have a thumb positioned at 20% of the container and one at 80%", async () => {
		const { getByTestId } = setup({}, "range");

		const thumb0 = getByTestId("thumb-0");
		expect(thumb0).toBeInTheDocument();
		const thumb1 = getByTestId("thumb-1");
		expect(thumb1).toBeInTheDocument();

		expect(isCloseEnough(20, thumb0.style.left)).toBeTruthy();
		expect(isCloseEnough(80, thumb1.style.left)).toBeTruthy();
	});
	it("should have a range that covers from 20% to 80%", async () => {
		const { getByTestId } = setup({}, "range");

		const range = getByTestId("range");
		expect(range).toBeInTheDocument();

		expect(isCloseEnough(20, range.style.left)).toBeTruthy();
		expect(isCloseEnough(20, range.style.right)).toBeTruthy();
	});

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s (pressing on the first thumb)",
		async (key) => {
			const { getByTestId, user } = setup({}, "range");

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb0.focus();
			await user.keyboard(key);

			expectPercentages({ percentages: [21, 80], thumbs: [thumb0, thumb1], range });
		}
	);

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s (pressing on the last thumb)",
		async (key) => {
			const { getByTestId, user } = setup({}, "range");

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb1.focus();
			await user.keyboard(key);

			expectPercentages({ percentages: [20, 81], thumbs: [thumb0, thumb1], range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 1% when pressing %s (pressing on the first thumb)",
		async (key) => {
			const { getByTestId, user } = setup({}, "range");

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb0.focus();
			await user.keyboard(key);

			expectPercentages({ percentages: [19, 80], thumbs: [thumb0, thumb1], range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 1% when pressing %s (pressing on the last thumb)",
		async (key) => {
			const { getByTestId, user } = setup({}, "range");

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb1.focus();
			await user.keyboard(key);

			expectPercentages({ percentages: [20, 79], thumbs: [thumb0, thumb1], range });
		}
	);

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should swap handler places when they overlap pressing %s (going up)",
		async (key) => {
			const { getByTestId, user } = setup(
				{
					value: [49, 51],
				},
				"range"
			);

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb0.focus();
			await user.keyboard(key);
			await user.keyboard(key);
			await user.keyboard(key);

			expectPercentages({ percentages: [51, 52], thumbs: [thumb0, thumb1], range });
			expect(thumb1).toHaveFocus();
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should swap handler places when they overlap pressing %s (going down)",
		async (key) => {
			const { getByTestId, user } = setup(
				{
					value: [49, 51],
				},
				"range"
			);

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb1.focus();
			await user.keyboard(key);
			await user.keyboard(key);
			await user.keyboard(key);

			expectPercentages({ percentages: [48, 49], thumbs: [thumb0, thumb1], range });
			expect(thumb0).toHaveFocus();
		}
	);

	it("should bring thumb to 0  to minimum when pressing Home", async () => {
		const { getByTestId, user } = setup({}, "range");

		const thumb0 = getByTestId("thumb-0");
		const thumb1 = getByTestId("thumb-1");
		const range = getByTestId("range");

		thumb0.focus();
		await user.keyboard(kbd.HOME);

		expectPercentages({ percentages: [0, 80], thumbs: [thumb0, thumb1], range });
	});

	it("should bring thumb 1  to maximum when pressing End", async () => {
		const { getByTestId, user } = setup({}, "range");

		const thumb0 = getByTestId("thumb-0");
		const thumb1 = getByTestId("thumb-1");
		const range = getByTestId("range");

		thumb1.focus();
		await user.keyboard(kbd.END);

		expectPercentages({ percentages: [20, 100], thumbs: [thumb0, thumb1], range });
	});

	it("should bring thumb 1  to minimum when pressing Home (thumbs swap places)", async () => {
		const { getByTestId, user } = setup({}, "range");

		const thumb0 = getByTestId("thumb-0");
		const thumb1 = getByTestId("thumb-1");
		const range = getByTestId("range");

		thumb1.focus();
		await user.keyboard(kbd.HOME);

		expectPercentages({ percentages: [0, 20], thumbs: [thumb0, thumb1], range });
		expect(thumb0).toHaveFocus();
	});

	it("should bring thumb 0 to maximum when pressing End (thumbs swap places)", async () => {
		const { getByTestId, user } = setup({}, "range");

		const thumb0 = getByTestId("thumb-0");
		const thumb1 = getByTestId("thumb-1");
		const range = getByTestId("range");

		thumb0.focus();
		await user.keyboard(kbd.END);

		expectPercentages({ percentages: [80, 100], thumbs: [thumb0, thumb1], range });
		expect(thumb1).toHaveFocus();
	});
});

describe("slider (small min, max, step)", () => {
	it("should have a thumb positioned at 50% of the container", async () => {
		const { getByTestId } = setup({
			value: [0.5],
			min: 0,
			max: 1,
			step: 0.01,
		});

		const thumb = getByTestId("thumb");
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(50, thumb.style.left)).toBeTruthy();
	});

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s",
		async (key) => {
			const { getByTestId, user } = setup({
				value: [0.5],
				min: 0,
				max: 1,
				step: 0.01,
			});

			const thumb = getByTestId("thumb");
			const range = getByTestId("range");

			thumb.focus();
			await user.keyboard(key);

			expectPercentage({ percentage: 51, thumb, range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 10% when pressing %s",
		async (key) => {
			const { getByTestId, user } = setup({
				value: [0.5],
				min: 0,
				max: 1,
				step: 0.01,
			});

			const thumb = getByTestId("thumb");
			const range = getByTestId("range");

			thumb.focus();
			await user.keyboard(key);

			expectPercentage({ percentage: 49, thumb, range });
		}
	);
});

describe("slider (negative min)", () => {
	it("should have a thumb positioned at 50% of the container", async () => {
		const { getByTestId } = setup({
			value: [0],
			min: -50,
			max: 50,
			step: 1,
		});

		const thumb = getByTestId("thumb");
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(50, thumb.style.left)).toBeTruthy();
	});

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s",
		async (key) => {
			const { getByTestId, user } = setup({
				value: [0],
				min: -50,
				max: 50,
				step: 1,
			});

			const thumb = getByTestId("thumb");
			const range = getByTestId("range");

			thumb.focus();
			await user.keyboard(key);

			expectPercentage({ percentage: 51, thumb, range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 10% when pressing %s",
		async (key) => {
			const { getByTestId, user } = setup({
				value: [0],
				min: -50,
				max: 50,
				step: 1,
			});

			const thumb = getByTestId("thumb");
			const range = getByTestId("range");

			thumb.focus();
			await user.keyboard(key);

			expectPercentage({ percentage: 49, thumb, range });
		}
	);
});

describe("slider (value=[5], min=0, max=10, step=1)", () => {
	const props = {
		value: [5],
		min: 0,
		max: 10,
		step: 1,
	};

	it("should render 11 ticks", () => {
		const { getAllByTestId } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(11);
	});

	it("should have a data-bounded attribute on ticks 0-5", () => {
		const { getAllByTestId } = setup(props);

		const ticks = getAllByTestId("tick");
		for (let i = 0; i <= 5; ++i) {
			expect(ticks[i]).toHaveAttribute("data-bounded");
		}
	});

	it("should not have a data-bounded attribute on ticks 6-10", () => {
		const { getAllByTestId } = setup(props);

		const ticks = getAllByTestId("tick");
		for (let i = 6; i <= 10; ++i) {
			expect(ticks[i]).not.toHaveAttribute("data-bounded");
		}
	});
});

describe("slider (min=0, max=8, step=3)", () => {
	it("should render 3 ticks", () => {
		const { getAllByTestId } = setup({
			min: 0,
			max: 8,
			step: 3,
		});

		expect(getAllByTestId("tick")).toHaveLength(3);
	});
});

describe("slider (min=0, max=9, step=3)", () => {
	it("should render 4 ticks", () => {
		const { getAllByTestId } = setup({
			min: 0,
			max: 9,
			step: 3,
		});

		expect(getAllByTestId("tick")).toHaveLength(4);
	});
});

describe("slider (value=[3,6], min=0, max=10, step=3)", () => {
	const props = {
		value: [3, 6],
		min: 0,
		max: 10,
		step: 3,
	};

	it("should render 4 ticks", () => {
		const { getAllByTestId } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(4);
	});

	it("should have a data-bounded attribute on ticks 1,2", () => {
		const { getAllByTestId } = setup(props);

		const ticks = getAllByTestId("tick");
		for (const i of [1, 2]) {
			expect(ticks[i]).toHaveAttribute("data-bounded");
		}
	});

	it("should not have a data-bounded attribute on ticks 0,3", () => {
		const { getAllByTestId } = setup(props);

		const ticks = getAllByTestId("tick");
		for (const i of [0, 3]) {
			expect(ticks[i]).not.toHaveAttribute("data-bounded");
		}
	});
});

describe("slider changing options after building", () => {
	const props = {
		value: [5],
		min: 0,
		max: 10,
		step: 1,
	};

	it("should change the min", async () => {
		const { getAllByTestId, rerender } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(11);

		await rerender({ ...props, resetMin: 2 });

		expect(getAllByTestId("tick")).toHaveLength(9);
	});

	it("should change the max", async () => {
		const { getAllByTestId, rerender } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(11);

		await rerender({ ...props, resetMax: 8 });

		expect(getAllByTestId("tick")).toHaveLength(9);
	});

	it("should change the  step", async () => {
		const { getAllByTestId, rerender } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(11);

		await rerender({ ...props, resetStep: 2 });

		expect(getAllByTestId("tick")).toHaveLength(6);
	});
});

const IS_ENOUGH_CLOSE = 0.0001;

/**
 * Unfortunately sometimes floating point arithmetic still strikes
 * so we need to check that we are close enough rather than precisely
 */
function isCloseEnough(value: number, style: string) {
	const numStyle = Number.parseFloat(style.replace("%", ""));
	return Math.abs(numStyle - value) < IS_ENOUGH_CLOSE;
}

function expectPercentage({
	percentage,
	thumb,
	range,
}: {
	percentage: number;
	thumb: HTMLElement;
	range: HTMLElement;
}) {
	expect(isCloseEnough(percentage, thumb.style.left)).toBeTruthy();
	expect(isCloseEnough(0, range.style.left)).toBeTruthy();
	expect(isCloseEnough(100 - percentage, range.style.right)).toBeTruthy();
}

function expectPercentages({
	percentages,
	thumbs,
	range,
}: {
	percentages: number[];
	thumbs: HTMLElement[];
	range: HTMLElement;
}) {
	let lesserPercentage = Number.POSITIVE_INFINITY;
	let higherPercentage = Number.NEGATIVE_INFINITY;
	for (let i = 0; i < percentages.length; i++) {
		const thumb = thumbs[i] as HTMLElement;
		const percentage = percentages[i] as number;
		if (percentage > higherPercentage) {
			higherPercentage = percentage;
		}
		if (percentage < lesserPercentage) {
			lesserPercentage = percentage;
		}
		expect(isCloseEnough(percentage, thumb.style.left)).toBeTruthy();
	}
	expect(isCloseEnough(lesserPercentage, range.style.left)).toBeTruthy();
	expect(isCloseEnough(100 - higherPercentage, range.style.right)).toBeTruthy();
}
