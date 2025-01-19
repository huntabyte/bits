---
title: PIN Input
description: Allows users to input a sequence of one-character alphanumeric inputs.
navLabel: New
---

<script>
	import { APISection, ComponentPreviewV2, PinInputDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="pin-input-demo" comp="PinInput">

{#snippet preview()}
<PinInputDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The PIN Input component provides a customizable solution for One-Time Password (OTP), Two-Factor Authentication (2FA), or Multi-Factor Authentication (MFA) input fields. Due to the lack of a native HTML element for these purposes, developers often resort to either basic input fields or custom implementations. This component offers a robust, accessible, and flexible alternative.

<Callout type="tip" title="Credits">

This component is derived from and would not have been possible without the work done by [Guilherme Rodz](https://x.com/guilhermerodz) with [Input OTP](https://github.com/guilhermerodz/input-otp).

</Callout>

## Key Features

-   **Invisible Input Technique**: Utilizes an invisible input element for seamless integration with form submissions and browser autofill functionality.
-   **Customizable Appearance**: Allows for custom designs while maintaining core functionality.
-   **Accessibility**: Ensures keyboard navigation and screen reader compatibility.
-   **Flexible Configuration**: Supports various PIN lengths and input types (numeric, alphanumeric).

## Architecture

1. **Root Container**: A relatively positioned root element that encapsulates the entire component.
2. **Invisible Input**: A hidden input field that manages the actual value and interacts with the browser's built-in features.
3. **Visual Cells**: Customizable elements representing each character of the PIN, rendered as siblings to the invisible input.

This structure allows for a seamless user experience while providing developers with full control over the visual representation.

## Structure

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
</script>

<PinInput.Root maxlength={6}>
	{#snippet children({ cells })}
		{#each cells as cell}
			<PinInput.Cell {cell} />
		{/each}
	{/snippet}
</PinInput.Root>
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the component's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
	let myValue = $state("");
</script>

<button onclick={() => (myValue = "123456")}> Set value to 123456 </button>

<PinInput.Root bind:value={myValue}>
	<!-- -->
</PinInput.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes (e.g., user typing in the input)
-   Allows external control (e.g., switching tabs via a separate button)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
	let myValue = $state("");
</script>

<PinInput.Root
	value={myValue}
	onValueChange={(v) => {
		myValue = v;
		// additional logic here.
	}}
>
	<!-- ... -->
</PinInput.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
	let myValue = $state("");
</script>

<PinInput.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</PinInput.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Paste Handling

The `onPaste` prop allows you to sanitize pasted text. This can be useful for cleaning up pasted text, like removing hyphens or other characters that should not make it into the input. This function should return the sanitized text.

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
</script>

<PinInput.Root onPaste={(text) => text.replace(/-/g, "")}>
	<!-- ... -->
</PinInput.Root>
```

## HTML Forms

The `PinInput.Root` component is designed to work seamlessly with HTML forms. Simply pass the `name` prop to the `PinInput.Root` component and the input will be submitted with the form.

### Submit On Complete

To submit the form when the input is complete, you can use the `onComplete` prop.

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
	let form = $state<HTMLFormElement>(null!);
</script>

<form method="POST" bind:this={form}>
	<PinInput.Root name="mfaCode" onComplete={() => form.submit()}>
		<!-- ... -->
	</PinInput.Root>
</form>
```

## Patterns

You can use the `pattern` prop to restrict the characters that can be entered or pasted into the input.

<Callout type="warning" title="Note!">
Client-side validation cannot replace server-side validation. Use this in addition to server-side validation for an improved user experience.
</Callout>

Bits UI exports a few common patterns that you can import and use in your application.

-   `REGEXP_ONLY_DIGITS` - Only allow digits to be entered.
-   `REGEXP_ONLY_CHARS` - Only allow characters to be entered.
-   `REGEXP_ONLY_DIGITS_AND_CHARS` - Only allow digits and characters to be entered.

```svelte
<script lang="ts">
	import { PinInput, REGEXP_ONLY_DIGITS } from "bits-ui";
</script>

<PinInput.Root pattern={REGEXP_ONLY_DIGITS}>
	<!-- ... -->
</PinInput.Root>
```

<APISection {schemas} />
