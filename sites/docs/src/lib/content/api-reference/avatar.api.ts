import type {
	AvatarFallbackPropsWithoutHTML,
	AvatarImagePropsWithoutHTML,
	AvatarRootPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	createEnumDataAttr,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	withChildProps,
} from "./helpers.js";
import { LoadingStatusProp, OnLoadingStatusChangeProp } from "./extended-types/avatar/index.js";

const statusDataAttr = createEnumDataAttr({
	name: "status",
	description: "The loading status of the image.",
	options: ["loading", "loaded", "error"],
	definition: LoadingStatusProp,
});

export const root = createApiSchema<AvatarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to set and manage the state of the avatar.",
	props: {
		loadingStatus: createEnumProp({
			options: ["loading", "loaded", "error"],
			description:
				"The loading status of the avatars source image. You can bind a variable to track the status outside of the component and use it to show a loading indicator or error message.",
			bindable: true,
			definition: LoadingStatusProp,
		}),
		onLoadingStatusChange: createFunctionProp({
			definition: OnLoadingStatusChangeProp,
			description: "A callback function called when the loading status of the image changes.",
		}),
		delayMs: createNumberProp({
			default: "0",
			description:
				"How long to wait before showing the image after it has loaded. This can be useful to prevent a harsh flickering effect when the image loads quickly.",
		}),

		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		statusDataAttr,
		createDataAttrSchema({
			name: "avatar-root",
			description: "Present on the root element.",
		}),
	],
});

export const image = createApiSchema<AvatarImagePropsWithoutHTML>({
	title: "Image",
	description: "The avatar image displayed once it has loaded.",
	props: withChildProps({ elType: "HTMLImageElement" }),
	dataAttributes: [
		statusDataAttr,
		createDataAttrSchema({
			name: "avatar-image",
			description: "Present on the root element.",
		}),
	],
});

export const fallback = createApiSchema<AvatarFallbackPropsWithoutHTML>({
	title: "Fallback",
	description: "The fallback displayed while the avatar image is loading or if it fails to load",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		statusDataAttr,
		createDataAttrSchema({
			name: "avatar-fallback",
			description: "Present on the fallback element.",
		}),
	],
});

export const avatar = [root, image, fallback];
