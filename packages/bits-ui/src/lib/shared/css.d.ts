// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as CSS from "csstype";

declare module "csstype" {
	interface Properties {
		// Allow any CSS Custom Properties
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[index: `--${string}`]: any;
	}
}
