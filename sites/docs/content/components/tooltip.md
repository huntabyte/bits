---
title: Tooltip
description: Provides additional information or context when users hover over or interact with an element.
---

<script>
	import { ComponentPreviewV2, TooltipDemo, TooltipDemoCustom, TooltipDemoDelayDuration, TooltipDemoTransition, APISection, Callout } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="tooltip-demo" comp="Tooltip">

{#snippet preview()}
<TooltipDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Tooltip } from "bits-ui";
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger />
		<Tooltip.Portal>
			<Tooltip.Content>
				<Tooltip.Arrow />
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
```

## Provider Component

The `Tooltip.Provider` component is required to be an ancestor of the `Tooltip.Root` component. It provides shared state for the tooltip components used within it. You can set a single `delayDuration` or `disableHoverableContent` prop on the provider component to apply to all the tooltip components within it.

```svelte
<script lang="ts">
	import { Tooltip } from "bits-ui";
</script>

<Tooltip.Provider delayDuration={0} disableHoverableContent={true}>
	<!-- Will have a delayDuration of 0 and disableHoverableContent of true -->
	<Tooltip.Root>
		<Tooltip.Trigger />
		<Tooltip.Portal>
			<Tooltip.Content>
				<Tooltip.Arrow />
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
	<!-- Will have a delayDuration of 0 and disableHoverableContent of true -->
	<Tooltip.Root>
		<Tooltip.Trigger />
		<Tooltip.Portal>
			<Tooltip.Content>
				<Tooltip.Arrow />
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
```

It also ensures that only a single tooltip within the same provider can be open at a time. It's recommended to wrap your root layout content with the provider component, setting your sensible default props there.

```svelte title="+layout.svelte"
<script lang="ts">
	import { Tooltip } from "bits-ui";
	let { children } = $props();
</script>

<Tooltip.Provider>
	{@render children()}
</Tooltip.Provider>
```

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Tooltip's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Tooltip } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Tooltip</button>

<Tooltip.Root bind:open={isOpen}>
	<!-- ... -->
</Tooltip.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the tooltip closes (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { Tooltip } from "bits-ui";
	let isOpen = $state(false);
</script>

<Tooltip.Root
	open={isOpen}
	onOpenChange={(o) => {
		isOpen = o;
		// additional logic here.
	}}
>
	<!-- ... -->
</Tooltip.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Tooltip } from "bits-ui";
	let myOpen = $state(false);
</script>

<Tooltip.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</Tooltip.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Mobile Tooltips

Tooltips are _not_ supported on mobile devices. The intent of a tooltip is to provide a "tip" about a "tool" before the user interacts with that tool (in most cases, a button).

This is not possible on mobile devices, because there is no sense of hover on mobile. If a user were to press/touch a button with a tooltip, the action that button triggers would be taken before they were even able to see the tooltip, which renders it useless.

If you are using a tooltip on a button without an action, you should consider using a [Popover](/docs/components/popover) instead.

If you'd like to learn more about how we came to this decision, here are some useful resources:

> The tooltip is not the appropriate role for the more information "i" icon, ⓘ. A tooltip is directly associated with the owning element. The ⓘ isn't 'described by' detailed information; the tool or control is.
>
> [MDN ARIA Tooltips](https://arc.net/l/quote/zfvjgalg)

<br />

> Tooltips should only ever contain non-essential content. The best approach to writing tooltip content is to always assume it may never be read.
>
> [Tooltips in the time of WCAG 2.1](https://arc.net/l/quote/gdrkepxb)

## Reusable Components

It's recommended to use the `Tooltip` primitives to build your own custom tooltip component that can be used throughout your application.

Below is an example of how you might create a reusable tooltip component that can be used throughout your application. Of course, this isn't the only way to do it, but it should give you a good idea of how to compose the primitives.

```svelte title="MyTooltip.svelte"
<script lang="ts">
	import { Tooltip } from "bits-ui";
	import { type Snippet } from "svelte";

	type Props = Tooltip.RootProps & {
		trigger: Snippet;
		triggerProps?: Tooltip.TriggerProps;
	};

	let {
		open = $bindable(false),
		children,
		buttonText,
		triggerProps = {},
		...restProps
	}: Tooltip.RootProps = $props();
</script>

<!--
 Ensure you have a `Tooltip.Provider` component wrapping
 your root layout content
-->
<Tooltip.Root bind:open {onOpenChange}>
	<Tooltip.Trigger {...triggerProps}>
		{@render trigger()}
	</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Content>
			<Tooltip.Arrow />
			{@render children?.()}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
```

You could then use the `MyTooltip` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyTooltip from "$lib/components/MyTooltip.svelte";
	import BoldIcon from "..some-icon-library"; // not real
</script>

<MyTooltip triggerProps={{ onclick: () => alert("changed to bold!") }}>
	{#snippet trigger()}
		<BoldIcon />
	{/snippet}
	Change font to bold
</MyTooltip>
```

## Delay Duration

You can change how long a user needs to hover over a trigger before the tooltip appears by setting the `delayDuration` prop on the `Tooltip.Root` or `Tooltip.Provider` component.

```svelte /delayDuration={200}/
<Tooltip.Root delayDuration={200}>
	<!-- .... -->
</Tooltip.Root>
```

<TooltipDemoDelayDuration />

## Close on Trigger Click

By default, the tooltip will close when the user clicks the trigger. If you want to disable this behavior, you can set the `disableCloseOnTriggerClick` prop to `true`.

```svelte /disableCloseOnTriggerClick/
<Tooltip.Root disableCloseOnTriggerClick>
	<!-- .... -->
</Tooltip.Root>
```

## Hoverable Content

By default, the tooltip will remain open when the user hovers over the content. If you instead want the tooltip to close as the user moves their mouse towards the content, you can set the `disableHoverableContent` prop to `true`.

```svelte /disableHoverableContent/
<Tooltip.Root disableHoverableContent>
	<!-- .... -->
</Tooltip.Root>
```

## Non-Keyboard Focus

If you want to prevent opening the tooltip when the user focuses the trigger without using the keyboard, you can set the `ignoreNonKeyboardFocus` prop to `true`.

```svelte /ignoreNonKeyboardFocus/
<Tooltip.Root ignoreNonKeyboardFocus>
	<!-- .... -->
</Tooltip.Root>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Tooltip.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fade/ /transition:fly/
<script lang="ts">
	import { Tooltip } from "bits-ui";
	import { fly, fade } from "svelte/transition";
</script>

<Tooltip.Root>
	<!-- ... other tooltip components -->
	<Tooltip.Content forceMount>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div {...props} transition:fly>
						<!-- ... -->
					</div>
				</div>
			{/if}
		{/snippet}
	</Tooltip.Content>
</Dialog.Root>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content components that handles this logic if you intend to use this approach throughout your app. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="tooltip-demo-transition" comp="Tooltip" containerClass="mt-4">

{#snippet preview()}
<TooltipDemoTransition />
{/snippet}

</ComponentPreviewV2>

## Opt-out of Floating UI

When you use the `Tooltip.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `Tooltip.ContentStatic` component. This component does not use Floating UI and leaves positioning the content entirely up to you.

```svelte /Tooltip.ContentStatic/
<Tooltip.Root>
	<Tooltip.Trigger>Hello</Tooltip.Trigger>
	<Tooltip.ContentStatic>
		<!-- ... -->
	</Tooltip.ContentStatic>
</Tooltip.Root>
```

<Callout>

When using the `Tooltip.ContentStatic` component, the `Tooltip.Arrow` component will not be rendered relative to it as it is designed to be used with `Tooltip.Content`.

</Callout>

## Custom Anchor

By default, the `Tooltip.Content` is anchored to the `Tooltip.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector `string` or an `HTMLElement` to the `customAnchor` prop of the `Tooltip.Content` component.

```svelte
<script lang="ts">
	import { Tooltip } from "bits-ui";
	let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Tooltip.Root>
	<Tooltip.Trigger />
	<Tooltip.Content {customAnchor}>
		<!-- ... -->
	</Tooltip.Content>
</Tooltip.Root>
```

<APISection {schemas} />
