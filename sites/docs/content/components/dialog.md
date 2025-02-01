---
title: Dialog
description: A modal window presenting content or seeking user input without navigating away from the current context.
---

<script>
	import { APISection, ComponentPreviewV2, DialogDemo, DialogDemoCustom, DialogDemoNested, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="dialog-demo" comp="Dialog">

{#snippet preview()}
<DialogDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Dialog component in Bits UI provides a flexible and accessible way to create modal dialogs in your Svelte applications. It follows a compound component pattern, allowing for fine-grained control over the dialog's structure and behavior while maintaining accessibility and ease of use.

## Key Features

-   **Compound Component Structure**: Offers a set of sub-components that work together to create a fully-featured dialog.
-   **Accessibility**: Built with WAI-ARIA guidelines in mind, ensuring keyboard navigation and screen reader support.
-   **Customizable**: Each sub-component can be styled and configured independently.
-   **Portal Support**: Content can be rendered in a portal, ensuring proper stacking context.
-   **Managed Focus**: Automatically manages focus, with the option to take control if needed.
-   **Flexible State Management**: Supports both controlled and uncontrolled state, allowing for full control over the dialog's open state.

## Architecture

The Dialog component is composed of several sub-components, each with a specific role:

-   **Root**: The main container component that manages the state of the dialog. Provides context for all child components.
-   **Trigger**: A button that toggles the dialog's open state.
-   **Portal**: Renders its children in a portal, outside the normal DOM hierarchy.
-   **Overlay**: A backdrop that sits behind the dialog content.
-   **Content**: The main container for the dialog's content.
-   **Title**: Renders the dialog's title.
-   **Description**: Renders a description or additional context for the dialog.
-   **Close**: A button that closes the dialog.

## Structure

Here's an overview of how the Dialog component is structured in code:

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";
</script>

<Dialog.Root>
	<Dialog.Trigger />
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title />
			<Dialog.Description />
			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

## Reusable Components

Bits UI provides a comprehensive set of Dialog components that serve as building blocks for creating customized, reusable Dialog implementations. This approach offers flexibility in design while maintaining consistency and accessibility across your application.

### Building a Reusable Dialog

The following example demonstrates how to create a versatile, reusable Dialog component using Bits UI building blocks. This implementation showcases the flexibility of the component API by combining props and snippets.

```svelte title="MyDialog.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { Dialog, type WithoutChild } from "bits-ui";

	type Props = Dialog.RootProps & {
		buttonText: string;
		title: Snippet;
		description: Snippet;
		contentProps?: WithoutChild<Dialog.ContentProps>;
		// ...other component props if you wish to pass them
	};

	let {
		open = $bindable(false),
		children,
		buttonText,
		contentProps,
		title,
		description,
		...restProps
	}: Props = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Trigger>
		{buttonText}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content {...contentProps}>
			<Dialog.Title>
				{@render title()}
			</Dialog.Title>
			<Dialog.Description>
				{@render description()}
			</Dialog.Description>
			{@render children?.()}
			<Dialog.Close>Close Dialog</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

#### Usage with Inline Snippets

```svelte
<script lang="ts">
	import MyDialog from "$lib/components/MyDialog.svelte";
</script>

<MyDialog buttonText="Open Dialog">
	{#snippet title()}
		Account settings
	{/snippet}

	{#snippet description()}
		Manage your account settings and preferences.
	{/snippet}

	<!-- Additional dialog content here... -->
</MyDialog>
```

#### Usage with Separate Snippets

```svelte
<script lang="ts">
	import MyDialog from "$lib/components/MyDialog.svelte";
</script>

{#snippet title()}
	Account settings
{/snippet}

{#snippet description()}
	Manage your account settings and preferences.
{/snippet}

<MyDialog buttonText="Open Dialog" {title} {description}>
	<!-- Additional dialog content here... -->
</MyDialog>
```

### Best Practices

-   **Prop Flexibility**: Design your component to accept props for any nested components for maximum flexibility
-   **Styling Options**: Use tools like `clsx` to merge class overrides
-   **Binding Props**: Use `bind:` and expose `$bindable` props to provide consumers with full control
-   **Type Safety**: Use the exported types from Bits UI to type your component props

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Alert Dialog's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the dialog's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Dialog } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Dialog</button>

<Dialog.Root bind:open={isOpen}>
	<!-- ... -->
</Dialog.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `isOpen` when the dialog closes (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { Dialog } from "bits-ui";
	let isOpen = $state(false);
</script>

<Dialog.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</Dialog.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";
	let myOpen = $state(false);
</script>

<Dialog.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</Dialog.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Focus Management

Proper focus management is crucial for accessibility and user experience in modal dialogs. Bits UI's Dialog component provides several features to help you manage focus effectively.

### Focus Trap

By default, the Dialog implements a focus trap, adhering to the WAI-ARIA design pattern for modal dialogs. This ensures that keyboard focus remains within the Dialog while it's open, preventing users from interacting with the rest of the page.

#### Disabling the Focus Trap

While not recommended, you can disable the focus trap if absolutely necessary:

```svelte /trapFocus={false}/
<Dialog.Content trapFocus={false}>
	<!-- ... -->
</Dialog.Content>
```

<Callout type="warning" title="Accessibility Warning">

Disabling the focus trap may compromise accessibility. Only do this if you have a specific reason and implement an alternative focus management strategy.

</Callout>

### Open Focus

When a Dialog opens, focus is automatically set to the first focusable element within `Dialog.Content`. This ensures keyboard users can immediately interact with the Dialog contents.

#### Customizing Initial Focus

To specify which element receives focus when the Dialog opens, use the `onOpenAutoFocus` prop on `Dialog.Content`:

```svelte {9-12}
<script lang="ts">
	import { Dialog } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<Dialog.Root>
	<Dialog.Trigger>Open Dialog</Dialog.Trigger>
	<Dialog.Content
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<input type="text" bind:this={nameInput} />
	</Dialog.Content>
</Dialog.Root>
```

<Callout type="warning" title="Important">

Always ensure that _something_ within the Dialog receives focus when it opens. This is crucial for maintaining keyboard navigation context and makes your users happy.

</Callout>

### Close Focus

When a Dialog closes, focus returns to the element that triggered its opening (typically the `Dialog.Trigger`).

#### Customizing Close Focus

To change which element receives focus when the Dialog closes, use the `onCloseAutoFocus` prop on `Dialog.Content`:

```svelte {9-12}
<script lang="ts">
	import { Dialog } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<input type="text" bind:this={nameInput} />
<Dialog.Root>
	<Dialog.Trigger>Open Dialog</Dialog.Trigger>
	<Dialog.Content
		onCloseAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<!-- ... -->
	</Dialog.Content>
</Dialog.Root>
```

### Best Practices

-   Always maintain a clear focus management strategy for your Dialogs.
-   Ensure that focus is predictable and logical for keyboard users.
-   Test your focus management with keyboard navigation to verify its effectiveness.

## Advanced Behaviors

Bits UI's Dialog component offers several advanced features to customize its behavior and enhance user experience. This section covers scroll locking, escape key handling, and interaction outside the dialog.

### Scroll Lock

By default, when a Dialog opens, scrolling the body is disabled. This provides a more native-like experience, focusing user attention on the dialog content.

#### Customizing Scroll Behavior

To allow body scrolling while the dialog is open, use the `preventScroll` prop on `Dialog.Content`:

```svelte /preventScroll={false}/
<Dialog.Content preventScroll={false}>
	<!-- ... -->
</Dialog.Content>
```

<Callout type="warning" title="Note">

Enabling body scroll may affect user focus and accessibility. Use this option judiciously.

</Callout>

### Escape Key Handling

By default, pressing the `Escape` key closes an open Dialog. Bits UI provides two methods to customize this behavior.

#### Method 1: `escapeKeydownBehavior`

The `escapeKeydownBehavior` prop allows you to customize the behavior taken by the component when the `Escape` key is pressed. It accepts one of the following values:

-   `'close'` (default): Closes the Dialog immediately.
-   `'ignore'`: Prevents the Dialog from closing.
-   `'defer-otherwise-close'`: If an ancestor Bits UI component also implements this prop, it will defer the closing decision to that component. Otherwise, the Dialog will close immediately.
-   `'defer-otherwise-ignore'`: If an ancestor Bits UI component also implements this prop, it will defer the closing decision to that component. Otherwise, the Dialog will ignore the key press and not close.

To always prevent the Dialog from closing on Escape key press, set the `escapeKeydownBehavior` prop to `'ignore'` on `Dialog.Content`:

```svelte /escapeKeydownBehavior="ignore"/
<Dialog.Content escapeKeydownBehavior="ignore">
	<!-- ... -->
</Dialog.Content>
```

#### Method 2: `onEscapeKeydown`

For more granular control, override the default behavior using the `onEscapeKeydown` prop:

```svelte {2-5}
<Dialog.Content
	onEscapeKeydown={(e) => {
		e.preventDefault();
		// do something else instead
	}}
>
	<!-- ... -->
</Dialog.Content>
```

This method allows you to implement custom logic when the `Escape` key is pressed.

### Interaction Outside

By default, interacting outside the Dialog content area closes the Dialog. Bits UI offers two ways to modify this behavior.

#### Method 1: `interactOutsideBehavior`

The `interactOutsideBehavior` prop allows you to customize the behavior taken by the component when an interaction (touch, mouse, or pointer event) occurs outside the content. It accepts one of the following values:

-   `'close'` (default): Closes the Dialog immediately.
-   `'ignore'`: Prevents the Dialog from closing.
-   `'defer-otherwise-close'`: If an ancestor Bits UI component also implements this prop, it will defer the closing decision to that component. Otherwise, the Dialog will close immediately.
-   `'defer-otherwise-ignore'`: If an ancestor Bits UI component also implements this prop, it will defer the closing decision to that component. Otherwise, the Dialog will ignore the event and not close.

To always prevent the Dialog from closing on Escape key press, set the `escapeKeydownBehavior` prop to `'ignore'` on `Dialog.Content`:

```svelte /interactOutsideBehavior="ignore"/
<Dialog.Content interactOutsideBehavior="ignore">
	<!-- ... -->
</Dialog.Content>
```

#### Method 2: `onInteractOutside`

For custom handling of outside interactions, you can override the default behavior using the `onInteractOutside` prop:

```svelte {2-5}
<Dialog.Content
	onInteractOutside={(e) => {
		e.preventDefault();
		// do something else instead
	}}
>
	<!-- ... -->
</Dialog.Content>
```

This approach allows you to implement specific behaviors when users interact outside the Dialog content.

### Best Practices

-   **Scroll Lock**: Consider your use case carefully before disabling scroll lock. It may be necessary for dialogs with scrollable content or for specific UX requirements.
-   **Escape Keydown**: Overriding the default escape key behavior should be done thoughtfully. Users often expect the escape key to close modals.
-   **Outside Interactions**: Ignoring outside interactions can be useful for important dialogs or multi-step processes, but be cautious not to trap users unintentionally.
-   **Accessibility**: Always ensure that any customizations maintain or enhance the dialog's accessibility.
-   **User Expectations**: Try to balance custom behaviors with common UX patterns to avoid confusing users.

By leveraging these advanced features, you can create highly customized dialog experiences while maintaining usability and accessibility standards.

## Nested Dialogs

Dialogs can be nested within each other to create more complex user interfaces:

```svelte
<script lang="ts">
	import MyDialog from "$lib/components/MyDialog.svelte";
</script>

<MyDialog buttonText="Open first dialog">
	{#snippet title()}
		First Dialog
	{/snippet}
	{#snippet description()}
		This is the first dialog.
	{/snippet}
	<MyDialog buttonText="Open second dialog">
		{#snippet title()}
			Second Dialog
		{/snippet}
		{#snippet description()}
			This is the second dialog.
		{/snippet}
	</MyDialog>
</MyDialog>
```

<DialogDemoNested />

## Svelte Transitions

The Dialog component can be enhanced with Svelte's built-in transition effects or other animation libraries.

### Using `forceMount` and `child` Snippets

To apply Svelte transitions to Dialog components, use the `forceMount` prop in combination with the `child` snippet. This approach gives you full control over the mounting behavior and animation of `Dialog.Content` and `Dialog.Overlay`.

```svelte /forceMount/ /transition:fade/ /transition:fly/
<script lang="ts">
	import { Dialog } from "bits-ui";
	import { fly, fade } from "svelte/transition";
</script>

<Dialog.Root>
	<!-- ... other dialog components -->
	<Dialog.Overlay forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:fade>
					<!-- ... -->
				</div>
			{/if}
		{/snippet}
	</Dialog.Overlay>
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

In this example:

-   The `forceMount` prop ensures the components are always in the DOM.
-   The `child` snippet provides access to the open state and component props.
-   Svelte's `#if` block controls when the content is visible.
-   Transition directives (`transition:fade` and `transition:fly`) apply the animations.

### Best Practices

For cleaner code and better maintainability, consider creating custom reusable components that encapsulate this transition logic.

```svelte title="MyDialogOverlay.svelte"
<script lang="ts">
	import { Dialog, type WithoutChildrenOrChild } from "bits-ui";
	import { fade } from "svelte/transition";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		duration = 200,
		children,
		...restProps
	}: WithoutChildrenOrChild<Dialog.OverlayProps> & {
		duration?: number;
		children?: Snippet;
	} = $props();
</script>

<Dialog.Overlay forceMount bind:ref {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:fade={{ duration }}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Dialog.Overlay>
```

You can then use the `MyDialogOverlay` component alongside the other `Dialog` primitives throughout your application:

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";
	import { MyDialogOverlay } from "$lib/components";
</script>

<Dialog.Root>
	<Dialog.Trigger>Open</Dialog.Trigger>
	<Dialog.Portal>
		<MyDialogOverlay duration={300} />
		<Dialog.Content>
			<!-- ... -->
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

## Working with Forms

### Form Submission

When using the `Dialog` component, often you'll want to submit a form or perform an asynchronous action and then close the dialog.

This can be done by waiting for the asynchronous action to complete, then programmatically closing the dialog.

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Confirm your action</Dialog.Title>
			<Dialog.Description>Are you sure you want to do this?</Dialog.Description>
			<form
				method="POST"
				action="?/someAction"
				onsubmit={() => {
					wait(1000).then(() => (open = false));
				}}
			>
				<button type="submit">Submit form</Dialog.Action>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

### Inside a Form

If you're using a `Dialog` _within_ a form, you'll need to ensure that the `Portal` is disabled or not included in the `Dialog` structure. This is because the `Portal` will render the dialog content _outside_ of the form, which will prevent the form from being submitted correctly.

<APISection {schemas} />
