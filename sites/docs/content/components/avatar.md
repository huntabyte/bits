---
title: Avatar
description: Represents a user or entity with a recognizable image or placeholder in UI elements.
---

<script>
	import { APISection, ComponentPreviewV2, AvatarDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="avatar-demo" comp="Avatar">

{#snippet preview()}
<AvatarDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Avatar component is designed to represent a user or entity within your application's user interface. It provides a flexible and accessible way to display profile pictures or placeholder images.

## Key Features

-   **Compound Component Structure**: Offers a set of sub-components that work together to create a fully-featured avatar.
-   **Fallback Mechanism**: Provides a fallback when the primary image is unavailable or loading.
-   **Customizable**: Each sub-component can be styled and configured independently to match your design system.

## Architecture

The Avatar component is composed of several sub-components, each with a specific role:

-   **Root**: The main container component that manages the state of the avatar.
-   **Image**: The primary image element that displays the user's profile picture or a representative image.
-   **Fallback**: The fallback element that displays alternative content when the primary image is unavailable or loading.

## Structure

Here's an overview of how the Avatar component is structured in code:

```svelte
<script lang="ts">
	import { Avatar } from "bits-ui";
</script>

<Avatar.Root>
	<Avatar.Image />
	<Avatar.Fallback />
</Avatar.Root>
```

## Reusable Components

You can create your own reusable components that combine the `Avatar` primitives and simplify the usage throughout your application. In the following example, we're creating a reusable `MyAvatar` component that takes in a `src` and `fallback` prop and renders an `Avatar.Root` component with an `Avatar.Image` and `Avatar.Fallback` component.

```svelte title="MyAvatar.svelte"
<script lang="ts">
	import { Avatar, type WithoutChildrenOrChild } from "bits-ui";

	let {
		src,
		alt,
		fallback,
		ref = $bindable(null),
		imageRef = $bindable(null),
		fallbackRef = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Avatar.RootProps> & {
		src: string;
		alt: string;
		fallback: string;
		imageRef?: HTMLImageElement | null;
		fallbackRef?: HTMLElement | null;
	} = $props();
</script>

<Avatar.Root {...restProps} bind:ref>
	<Avatar.Image {src} {alt} bind:ref={imageRef} />
	<Avatar.Fallback bind:ref={fallbackRef}>
		{fallback}
	</Avatar.Fallback>
</Avatar.Root>
```

You could then use the `MyAvatar` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyAvatar from "$lib/components/MyAvatar.svelte";
</script>

<MyAvatar src="https://github.com/huntabyte.png" alt="huntabyte" fallback="HJ" />
```

<APISection {schemas} />
