---
title: Pagination
description: Facilitates navigation between pages.
---

<script>
	import { APISection, ComponentPreviewV2, PaginationDemo, Callout } from '$lib/components/index.js'
	export let schemas
</script>

<ComponentPreviewV2 name="pagination-demo" comp="Pagination">

{#snippet preview()}
<PaginationDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Pagination } from "bits-ui";
</script>

<Pagination.Root let:pages>
	<Pagination.PrevButton />
	{#each pages as page (page.key)}
		<Pagination.Page {page} />
	{/each}
	<Pagination.NextButton />
</Pagination.Root>
```

## Managing Page State

Bits UI offers several approaches to manage and synchronize the Pagination's page state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:page` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { Pagination } from "bits-ui";
	let myPage = $state(1);
</script>

<button onclick={() => (myPage = 2)}> Go to page 2 </button>

<Pagination.Root bind:pressed={myPage}>
	<!-- ...-->
</Pagination.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myPage` when the internal state changes (e.g., via clicking on a page button)
-   Allows external control (e.g., changing the page via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onPageChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { Pagination } from "bits-ui";
	let myPage = $state(1);
</script>

<Pagination.Root
	checked={myPage}
	onPressedChange={(p) => {
		myPage = p;
		// additional logic here.
	}}
>
	<!-- ... -->
</Pagination.Root>
```

#### Use Cases

-   Implementing custom behaviors on page change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
	import { Pagination } from "bits-ui";
	let myPage = $state(1);
</script>

<Pagination.Root bind:page={() => myPage, (newPage) => (myPage = newPage)}>
	<!-- ... -->
</Pagination.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Ellipsis

The `pages` snippet prop consists of two types of items: `'page'` and `'ellipsis'`. The `'page'` type represents an actual page number, while the `'ellipsis'` type represents a placeholder for rendering an ellipsis between pages.

<APISection {schemas} />
