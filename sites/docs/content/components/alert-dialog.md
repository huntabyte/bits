---
title: Alert Dialog
description: A modal window that alerts users with important information and awaits their acknowledgment or action.
---

<script>
	import { APISection, ComponentPreviewV2, AlertDialogDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="alert-dialog-demo" comp="Alert Dialog">

{#snippet preview()}
<AlertDialogDemo />
{/snippet}

</ComponentPreviewV2>

## Key Features

-   **Compound Component Structure**: Offers a set of sub-components that work together to create a fully-featured alert dialog.
-   **Accessibility**: Built with WAI-ARIA guidelines in mind, ensuring keyboard navigation and screen reader support.
-   **Customizable**: Each sub-component can be styled and configured independently.
-   **Portal Support**: Content can be rendered in a portal, ensuring proper stacking context.
-   **Managed Focus**: Automatically manages focus, with the option to take control if needed.
-   **Flexible State Management**: Supports both controlled and uncontrolled state, allowing for full control over the dialog's open state.

## Architecture

The Alert Dialog component is composed of several sub-components, each with a specific role:

-   **Root**: The main container component that manages the state of the dialog. Provides context for all child components.
-   **Trigger**: A button that toggles the dialog's open state.
-   **Portal**: Renders its children in a portal, outside the normal DOM hierarchy.
-   **Overlay**: A backdrop that sits behind the dialog content.
-   **Content**: The main container for the dialog's content.
-   **Title**: Renders the dialog's title.
-   **Description**: Renders a description or additional context for the dialog.
-   **Cancel**: A button that closes the dialog by cancelling the action.
-   **Action**: A button that closes the dialog by taking an action.

## Structure

```svelte
<script lang="ts">
	import { AlertDialog } from "bits-ui";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger />
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content>
			<AlertDialog.Title />
			<AlertDialog.Description />
			<AlertDialog.Cancel />
			<AlertDialog.Action />
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
```

## Reusable Components

Bits UI provides a decent number of components to construct an Alert Dialog. The idea is to provide a set of building blocks that can be used to create a variety of different components. It's recommended to use these components to build your own reusable Alert Dialog components that can be used throughout your application.

The following example shows at a high level how you might create a reusable Alert Dialog component. We've mixed and matched string props and snippets to demonstrate the flexibility of the component API. Use whatever makes sense for you.

This example is used in a few places throughout this documentation page to give you a better idea of how it's used.

```svelte title="MyAlertDialog.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { AlertDialog, type WithoutChild } from "bits-ui";

	type Props = AlertDialog.RootProps & {
		buttonText: string;
		title: Snippet;
		description: Snippet;
		contentProps?: WithoutChild<AlertDialog.ContentProps>;
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

<AlertDialog.Root bind:open {...restProps}>
	<AlertDialog.Trigger>
		{buttonText}
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content {...contentProps}>
			<AlertDialog.Title>
				{@render title()}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{@render description()}
			</AlertDialog.Description>
			{@render children?.()}
			<AlertDialog.Cancel>Cancel</AlertDialog.Close>
			<AlertDialog.Action>Confirm</AlertDialog.Close>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
```

You can then use the `MyAlertDialog` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyAlertDialog from "$lib/components/MyAlertDialog.svelte";
</script>

<MyAlertDialog buttonText="Open Dialog">
	{#snippet title()}
		Delete your account
	{/snippet}
	{#snippet description()}
		This action cannot be undone.
	{/snippet}
</MyAlertDialog>
```

Alternatively, you can define the snippets separately and pass them as props to the component:

```svelte title="+page.svelte"
<script lang="ts">
	import MyAlertDialog from "$lib/components/MyAlertDialog.svelte";
</script>

{#snippet title()}
	Delete your account
{/snippet}
{#snippet description()}
	This action cannot be undone.
{/snippet}

<MyAlertDialog buttonText="Open Dialog" {title} {description}>
	<!-- ... additional content here -->
</MyAlertDialog>
```

## Managing Open State

Bits UI offers several approaches to manage and synchronize the Alert Dialog's open state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:open` directive. This method automatically keeps your local state in sync with the dialog's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Dialog</button>

<AlertDialog.Root bind:open={isOpen}>
	<!-- ... -->
</AlertDialog.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates isOpen when the dialog closes (e.g., via escape key)
-   Allows external control (e.g., opening via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onOpenChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let isOpen = $state(false);
</script>

<AlertDialog.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</AlertDialog.Root>
```

#### Use Cases

-   Implementing custom behaviors on open/close
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { AlertDialog } from "bits-ui";

	let myOpen = $state(false);
</script>

<AlertDialog.Root bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
	<!-- ... -->
</AlertDialog.Root>
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

By default, when a dialog is opened, focus will be trapped within the Dialog, preventing the user from interacting with the rest of the page. This follows the [WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/examples/alertdialog/) for alert dialogs.

Although it isn't recommended unless absolutely necessary, you can disabled this behavior by setting the `trapFocus` prop to `false` on the `AlertDialog.Content` component.

```svelte /trapFocus={false}/
<AlertDialog.Content trapFocus={false}>
	<!-- ... -->
</AlertDialog.Content>
```

### Open Focus

By default, when a dialog is opened, focus will be set to the `AlertDialog.Cancel` button if it exists, or the first focusable element within the `AlertDialog.Content`. This ensures that users navigating my keyboard end up somewhere within the Dialog that they can interact with.

You can override this behavior using the `onOpenAutoFocus` prop on the `AlertDialog.Content` component. It's _highly_ recommended that you use this prop to focus _something_ within the Dialog.

You'll first need to cancel the default behavior of focusing the first focusable element by cancelling the event passed to the `onOpenAutoFocus` callback. You can then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
	<AlertDialog.Content
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<input type="text" bind:this={nameInput} />
	</AlertDialog.Content>
</AlertDialog.Root>
```

### Close Focus

By default, when a dialog is closed, focus will be set to the trigger element of the dialog. You can override this behavior using the `onCloseAutoFocus` prop on the `AlertDialog.Content` component.

You'll need to cancel the default behavior of focusing the trigger element by cancelling the event passed to the `onCloseAutoFocus` callback, and then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<input type="text" bind:this={nameInput} />
<AlertDialog.Root>
	<AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
	<AlertDialog.Content
		onCloseAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<!-- ... -->
	</AlertDialog.Content>
</AlertDialog.Root>
```

## Advanced Behaviors

The Alert Dialog component offers several advanced features to customize its behavior and enhance user experience. This section covers scroll locking, escape key handling, and interaction outside the dialog.

### Scroll Lock

By default, when an Alert Dialog opens, scrolling the body is disabled. This provides a more native-like experience, focusing user attention on the dialog content.

#### Customizing Scroll Behavior

To allow body scrolling while the dialog is open, use the `preventScroll` prop on `AlertDialog.Content`:

```svelte /preventScroll={false}/
<AlertDialog.Content preventScroll={false}>
	<!-- ... -->
</AlertDialog.Content>
```

<Callout type="warning" title="Note">

Enabling body scroll may affect user focus and accessibility. Use this option judiciously.

</Callout>

### Escape Key Handling

By default, pressing the `Escape` key closes an open Alert Dialog. Bits UI provides two methods to customize this behavior.

#### Method 1: `escapeKeydownBehavior`

The `escapeKeydownBehavior` prop allows you to customize the behavior taken by the component when the `Escape` key is pressed. It accepts one of the following values:

-   `'close'` (default): Closes the Alert Dialog immediately.
-   `'ignore'`: Prevents the Alert Dialog from closing.
-   `'defer-otherwise-close'`: If an ancestor Bits UI component also implements this prop, it will defer the closing decision to that component. Otherwise, the Alert Dialog will close immediately.
-   `'defer-otherwise-ignore'`: If an ancestor Bits UI component also implements this prop, it will defer the closing decision to that component. Otherwise, the Alert Dialog will ignore the key press and not close.

To always prevent the Alert Dialog from closing on Escape key press, set the `escapeKeydownBehavior` prop to `'ignore'` on `Dialog.Content`:

```svelte /escapeKeydownBehavior="ignore"/
<AlertDialog.Content escapeKeydownBehavior="ignore">
	<!-- ... -->
</AlertDialog.Content>
```

#### Method 2: `onEscapeKeydown`

For more granular control, override the default behavior using the `onEscapeKeydown` prop:

```svelte {2-5}
<AlertDialog.Content
	onEscapeKeydown={(e) => {
		e.preventDefault();
		// do something else instead
	}}
>
	<!-- ... -->
</AlertDialog.Content>
```

This method allows you to implement custom logic when the `Escape` key is pressed.

### Interaction Outside

By default, interacting outside the Alert Dialog content area closes the Alert Dialog. Bits UI offers two ways to modify this behavior.

#### Method 1: `interactOutsideBehavior`

The `interactOutsideBehavior` prop allows you to customize the behavior taken by the component when an interaction (touch, mouse, or pointer event) occurs outside the content. It accepts one of the following values:

-   `'close'` (default): Closes the Alert Dialog immediately.
-   `'ignore'`: Prevents the Alert Dialog from closing.
-   `'defer-otherwise-close'`: If an ancestor Bits UI component also implements this prop, it will defer the closing decision to that component. Otherwise, the Alert Dialog will close immediately.
-   `'defer-otherwise-ignore'`: If an ancestor Bits UI component also implements this prop, it will defer the closing decision to that component. Otherwise, the Alert Dialog will ignore the event and not close.

To always prevent the Alert Dialog from closing on Escape key press, set the `escapeKeydownBehavior` prop to `'ignore'` on `Alert.Content`:

```svelte /interactOutsideBehavior="ignore"/
<AlertDialog.Content interactOutsideBehavior="ignore">
	<!-- ... -->
</AlertDialog.Content>
```

#### Method 2: `onInteractOutside`

For custom handling of outside interactions, you can override the default behavior using the `onInteractOutside` prop:

```svelte {2-5}
<AlertDialog.Content
	onInteractOutside={(e) => {
		e.preventDefault();
		// do something else instead
	}}
>
	<!-- ... -->
</AlertDialog.Content>
```

This approach allows you to implement specific behaviors when users interact outside the Alert Dialog content.

### Best Practices

-   **Scroll Lock**: Consider your use case carefully before disabling scroll lock. It may be necessary for dialogs with scrollable content or for specific UX requirements.
-   **Escape Keydown**: Overriding the default escape key behavior should be done thoughtfully. Users often expect the escape key to close modals.
-   **Outside Interactions**: Ignoring outside interactions can be useful for important dialogs or multi-step processes, but be cautious not to trap users unintentionally.
-   **Accessibility**: Always ensure that any customizations maintain or enhance the dialog's accessibility.
-   **User Expectations**: Try to balance custom behaviors with common UX patterns to avoid confusing users.

By leveraging these advanced features, you can create highly customized dialog experiences while maintaining usability and accessibility standards.

## Nested Dialogs

Dialogs can be nested within each other to create more complex layouts. See the [Dialog](/docs/components/dialog) component for more information on nested dialogs.

## Svelte Transitions

See the [Dialog](/docs/components/dialog) component for more information on Svelte Transitions with dialog components.

## Working with Forms

### Form Submission

When using the `AlertDialog` component, often you'll want to submit a form or perform an asynchronous action when the user clicks the `Action` button.

This can be done by waiting for the asynchronous action to complete, then programmatically closing the dialog.

```svelte
<script lang="ts">
	import { AlertDialog } from "bits-ui";

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	let open = $state(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content>
			<AlertDialog.Title>Confirm your action</AlertDialog.Title>
			<AlertDialog.Description>Are you sure you want to do this?</AlertDialog.Description>
			<form
				method="POST"
				action="?/someAction"
				onsubmit={() => {
					wait(1000).then(() => (open = false));
				}}
			>
				<AlertDialog.Cancel type="button">No, cancel (close dialog)</AlertDialog.Cancel>
				<AlertDialog.Action type="submit">Yes (submit form)</AlertDialog.Action>
			</form>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
```

### Inside a Form

If you're using an `AlertDialog` _within_ a form, you'll need to ensure that the `Portal` is disabled or not included in the `AlertDialog` structure. This is because the `Portal` will render the dialog content _outside_ of the form, which will prevent the form from being submitted correctly.

<APISection {schemas} />
