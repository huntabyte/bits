---
title: Transitions
description: Learn how to use transitions with Bits UI components.
---

<script>
	import Callout from '$lib/components/callout.svelte';
</script>

Svelte Transitions are one of the awesome features of Svelte. Unfortunately, they don't play very nicely with components, due to the fact that they rely on various directives like `in:`, `out:`, and `transition:`, which aren't supported by components.

In previous version of Bits UI, we had a workaround for this by exposing a ton of `transition*` props on the components that we felt were most likely to be used with transitions. However, this was a bit of a hack and limited us to _only_ Svelte Transitions, and users who wanted to use other libraries or just CSS were left out.

With Bits UI for Svelte 5, we've completely removed this workaround and instead exposed props and snippets that allow you to use any animation or transitions library you want.

## The Defaults

By default, Bits UI components handle the mounting and unmounting of specific components for you. They are wrapped in a component that ensures the component waits for transitions to finish before unmounting.

You can use any CSS transitions or animations you want with this approach, which is what we're doing in the various example components in this documentation, using [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate).

## Force Mounting

On each component that we conditionally render, a `forceMount` prop is exposed. If set to `true`, the component will be forced to mount in the DOM and become visible to the user. You can use this prop in conjunction with the [delegated](/docs/child-snippet) `child` snippet to conditionally render the component and apply Svelte Transitions or another animation library.

The `child` snippet exposes a prop that you can use to conditionally render the element and apply your transitions.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { Dialog } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<Dialog.Root>
	<!-- ... -->
	<Dialog.Content forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:fly>
					<!-- ... -->
				</div>
			{/if}
		{/snippet}
	</Dialog.Content>
</Dialog.Root>
```

In the example above, we're using the `forceMount` prop to tell the component to forcefully mount the `Dialog.Content` component. We're then using the `child` snippet to delegate the rendering of the `Dialog.Content` to a `div` element which we can apply our props and transitions to.

We understand this isn't the prettiest syntax, but it enables us to cover every use case. If you intend to use this approach across your application, it's recommended to create a reusable component that handles this logic, like so:

```svelte title="MyDialogContent.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { fly } from "svelte/transition";
	import { Dialog, type WithoutChildrenOrChild } from "bits-ui";

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithoutChildrenOrChild<Dialog.ContentProps> & {
		children?: Snippet;
	} = $props();
</script>

<Dialog.Content bind:ref {...restProps} forceMount={true}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:fly>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Dialog.Content>
```

Which can then be used alongside the other `Dialog.*` components:

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";
	import MyDialogContent from "$lib/components/MyDialogContent.svelte";
</script>

<Dialog.Root>
	<Dialog.Trigger>Open Dialog</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<MyDialogContent>
			<Dialog.Title>Dialog Title</Dialog.Title>
			<Dialog.Description>Dialog Description</Dialog.Description>
			<Dialog.Close>Close</Dialog.Close>
			<div>Other dialog content</div>
		</MyDialogContent>
	</Dialog.Portal>
</Dialog.Root>
```

### Floating Content Components

`Content` components that rely on Floating UI require a slight modification to how the `child` snippet is used.

For example, if we were to use the `Popover.Content` component, we need to add a wrapper element within the `child` snippet, and spread the `wrapperProps` snippet prop to it.

```svelte {12,16} /wrapperProps,/
<script lang="ts">
	import { Popover } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<Popover.Root>
	<Popover.Trigger>Open Popover</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content forceMount>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly>
							<!-- ... -->
						</div>
					</div>
				{/if}
			{/snippet}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
```
