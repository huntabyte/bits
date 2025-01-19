---
title: Popover
description: Display supplementary content or information when users interact with specific elements.
---

<script>
	import { APISection, ComponentPreviewV2, PopoverDemo, PopoverDemoTransition, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="popover-demo" comp="Popover">

{#snippet preview()}
<PopoverDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Popover } from "bits-ui";
</script>

<Popover.Root>
	<Popover.Trigger />
	<Popover.Content>
		<Popover.Close />
		<Popover.Arrow />
	</Popover.Content>
</Popover.Root>
```

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Popover's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the dialog's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Popover } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Popover</button>

<Popover.Root bind:open={isOpen}>
	<!-- ... -->
</Popover.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the popover closes/opens (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { Popover } from "bits-ui";
	let isOpen = $state(false);
</script>

<Popover.Root
	open={isOpen}
	onOpenChange={(o) => {
		isOpen = o;
		// additional logic here.
	}}
>
	<!-- ... -->
</Popover.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Popover } from "bits-ui";
	let myOpen = $state(false);
</script>

<Popover.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</Popover.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Managing Focus

### Focus Trap

By default, when a Popover is opened, focus will be trapped within that Popover. You can disable this behavior by setting the `trapFocus` prop to `false` on the `Popover.Content` component.

```svelte /trapFocus={false}/
<Popover.Content trapFocus={false}>
	<!-- ... -->
</Popover.Content>
```

### Open Focus

By default, when a Popover is opened, focus will be set to the first focusable element with the `Popover.Content`. This ensures that users navigating my keyboard end up somewhere within the Popover that they can interact with.

You can override this behavior using the `onOpenAutoFocus` prop on the `Popover.Content` component. It's _highly_ recommended that you use this prop to focus _something_ within the Popover's content.

You'll first need to cancel the default behavior of focusing the first focusable element by cancelling the event passed to the `onOpenAutoFocus` callback. You can then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { Popover } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<Popover.Root>
	<Popover.Trigger>Open Popover</Popover.Trigger>
	<Popover.Content
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<input type="text" bind:this={nameInput} />
	</Popover.Content>
</Popover.Root>
```

### Close Focus

By default, when a Popover is closed, focus will be set to the trigger element of the Popover. You can override this behavior using the `onCloseAutoFocus` prop on the `Popover.Content` component.

You'll need to cancel the default behavior of focusing the trigger element by cancelling the event passed to the `onCloseAutoFocus` callback, and then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { Popover } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<input type="text" bind:this={nameInput} />
<Popover.Root>
	<Popover.Trigger>Open Popover</Popover.Trigger>
	<Popover.Content
		onCloseAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<!-- ... -->
	</Popover.Content>
</Popover.Root>
```

## Scroll Lock

By default, when a Popover is opened, users can still scroll the body and interact with content outside of the Popover. If you wish to lock the body scroll and prevent users from interacting with content outside of the Popover, you can set the `preventScroll` prop to `true` on the `Popover.Content` component.

```svelte /preventScroll={true}/
<Popover.Content preventScroll={true}>
	<!-- ... -->
</Popover.Content>
```

## Escape Keydown

By default, when a Popover is open, pressing the `Escape` key will close the dialog. Bits UI provides a couple ways to override this behavior.

### escapeKeydownBehavior

You can set the `escapeKeydownBehavior` prop to `'ignore'` on the `Popover.Content` component to prevent the dialog from closing when the `Escape` key is pressed.

```svelte /escapeKeydownBehavior="ignore"/
<Popover.Content escapeKeydownBehavior="ignore">
	<!-- ... -->
</Popover.Content>
```

### onEscapeKeydown

You can also override the default behavior by cancelling the event passed to the `onEscapeKeydown` callback on the `Popover.Content` component.

```svelte /onEscapeKeydown={(e) => e.preventDefault()}/
<Popover.Content onEscapeKeydown={(e) => e.preventDefault()}>
	<!-- ... -->
</Popover.Content>
```

## Interact Outside

By default, when a Popover is open, pointer down events outside the content will close the popover. Bits UI provides a couple ways to override this behavior.

### interactOutsideBehavior

You can set the `interactOutsideBehavior` prop to `'ignore'` on the `Popover.Content` component to prevent the dialog from closing when the user interacts outside the content.

```svelte /interactOutsideBehavior="ignore"/
<Popover.Content interactOutsideBehavior="ignore">
	<!-- ... -->
</Popover.Content>
```

### onInteractOutside

You can also override the default behavior by cancelling the event passed to the `onInteractOutside` callback on the `Popover.Content` component.

```svelte /onInteractOutside={(e) => e.preventDefault()}/
<Popover.Content onInteractOutside={(e) => e.preventDefault()}>
	<!-- ... -->
</Popover.Content>
```

## Custom Anchor

By default, the `Popover.Content` is anchored to the `Popover.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector `string` or an `HTMLElement` to the `customAnchor` prop of the `Popover.Content` component.

```svelte
<script lang="ts">
	import { Popover } from "bits-ui";
	let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Popover.Root>
	<Popover.Trigger />
	<Popover.Content {customAnchor}>
		<!-- ... -->
	</Popover.Content>
</Popover.Root>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Popover.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
	import { Popover } from "bits-ui";
	import { fly } from "svelte/transition";
</script>

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
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="popover-demo-transition" comp="Popover" containerClass="mt-4">

{#snippet preview()}
<PopoverDemoTransition />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
