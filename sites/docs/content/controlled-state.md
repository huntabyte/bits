---
title: Controlled State
description: Learn how to use controlled state in Bits UI components.
---

<script>
	import { Callout } from '$lib/components'
</script>

Bits UI components offer flexibility in state management, allowing you to choose between uncontrolled and controlled states. This guide will help you understand when and how to use controlled state effectively.

## Understanding State Management

### Uncontrolled State (Default)

By default, Bits UI components operate in an uncontrolled state. In this mode:

-   The component internally manages its own state.
-   You can `bind:` to the state for reference.
-   The component decides when and how to update its state.
-   You can update the state of the component yourself from the outside, but you can't prevent the component from updating it.

Here's an example of an uncontrolled Accordion:

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
	let myValue = $state("");
</script>

<Accordion.Root bind:value={myValue} type="single">
	<!-- Accordion content -->
</Accordion.Root>
```

In this example, the `Accordion.Root` component manages its value state internally. When a user interacts with the accordion, the component updates the value automatically. The local `myValue` is synced with the component's internal `value` state in both directions.

<Callout>

When state is uncontrolled, the `onValueChange` prop is called _after_ the state changes, so you can use it to perform additional logic/side effects after the state updates.

</Callout>

### Controlled State

Controlled state puts you in charge of the component's state management. Use this approach when:

-   You need to meet specific conditions before state updates.
-   You want to synchronize the component's state with other parts of your application.
-   You require custom logic for state updates.

To implement controlled state, use [Function Bindings](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the state externally. This approach allows you to control the state updates and perform additional logic as needed.

Here's an example of how you might use controlled state with the `Accordion` component:

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
	let myValue = $state("");
</script>

<Accordion.Root type="single" bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Accordion.Root>
```

## Best Practices

-   **Choose wisely**: Use controlled state only when necessary. Uncontrolled state is simpler and sufficient for most use cases.
-   **Consistent control**: If you opt for controlled state, ensure you handle all related state updates to maintain consistency.
-   **Performance consideration**: Be mindful of potential performance impacts when using controlled state, especially with frequently updating components.

## Common Controlled State Scenarios

-   Form validation before state updates
-   Syncing component state with external data sources
-   Implementing undo/redo functionality
-   Creating interdependent component behaviors
