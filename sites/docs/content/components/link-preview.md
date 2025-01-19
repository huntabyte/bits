---
title: Link Preview
description: Displays a summarized preview of a linked content's details or information.
---

<script>
	import { APISection, ComponentPreviewV2, LinkPreviewDemo, LinkPreviewDemoTransition, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="link-preview-demo" comp="LinkPreview">

{#snippet preview()}
<LinkPreviewDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

A component that lets users preview a link before they decide to follow it. This is useful for providing non-essential context or additional information about a link without having to navigate away from the current page.

<Callout type="warning" title="A note about mobile devices!">

This component is only intended to be used with a mouse or other pointing device. It doesn't respond to touch events, and the preview content cannot be accessed via the keyboard. On touch devices, the link will be followed immediately. As it is not accessible to all users, the preview should not contain vital information.

</Callout>

## Structure

```svelte
<script lang="ts">
	import { LinkPreview } from "bits-ui";
</script>

<LinkPreview.Root>
	<LinkPreview.Trigger />
	<LinkPreview.Content />
</LinkPreview.Root>
```

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Link Preview's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { LinkPreview } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Link Preview</button>

<LinkPreview.Root bind:open={isOpen}>
	<!-- ... -->
</LinkPreview.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the preview closes/opens (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { LinkPreview } from "bits-ui";
	let isOpen = $state(false);
</script>

<LinkPreview.Root
	open={isOpen}
	onOpenChange={(o) => {
		isOpen = o;
		// additional logic here.
	}}
>
	<!-- ... -->
</LinkPreview.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { LinkPreview } from "bits-ui";
	let myOpen = $state(false);
</script>

<LinkPreview.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</LinkPreview.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Opt-out of Floating UI

When you use the `LinkPreview.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `LinkPreview.ContentStatic` component. This component does not use Floating UI and leaves positioning the content entirely up to you.

```svelte /LinkPreview.ContentStatic/
<LinkPreview.Root>
	<LinkPreview.Trigger />
	<LinkPreview.ContentStatic>
		<!-- ... -->
	</LinkPreview.ContentStatic>
</LinkPreview.Root>
```

<Callout type="warning" title="Heads up!" class="mt-6">

The `LinkPreview.Arrow` component is designed to be used with Floating UI and `LinkPreview.Content`, so you may experience unexpected behavior if you attempt to use it with `LinkPreview.ContentStatic`.

</Callout>

## Custom Anchor

By default, the `LinkPreview.Content` is anchored to the `LinkPreview.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector `string` or an `HTMLElement` to the `customAnchor` prop of the `LinkPreview.Content` component.

```svelte
<script lang="ts">
	import { LinkPreview } from "bits-ui";
	let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<LinkPreview.Root>
	<LinkPreview.Trigger />
	<LinkPreview.Content {customAnchor}>
		<!-- ... -->
	</LinkPreview.Content>
</LinkPreview.Root>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `LinkPreview.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { LinkPreview } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

<LinkPreview.Content forceMount>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:fly>
					<!-- ... -->
				</div>
			</div>
		{/if}
	{/snippet}
</LinkPreview.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="link-preview-demo-transition" comp="LinkPreview" containerClass="mt-4">

{#snippet preview()}
<LinkPreviewDemoTransition />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
