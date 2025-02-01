---
title: mergeProps
description: A utility function to merge props objects.
---

## Overview

`mergeProps` is a utility function designed to merge multiple props objects. It's particularly useful for composing components with different prop sets or extending the functionality of existing components.

It is used internally by Bits UI components to merge the custom `restProps` you pass to a component with the props that Bits UI provides to the component.

## Key Features

-   Merges multiple props objects
-   Chains event handlers with cancellation support
-   Combines class names
-   Merges style objects and strings
-   Chains non-event handler functions

## Detailed Behavior

### Event Handlers

Event handlers are chained in the order they're passed. If a handler calls `event.preventDefault()`, subsequent handlers in the chain are not executed.

```ts
const props1 = { onclick: (e: MouseEvent) => console.log("First click") };
const props2 = { onclick: (e: MouseEvent) => console.log("Second click") };

const mergedProps = mergeProps(props1, props2);
mergedProps.onclick(new MouseEvent("click")); // Logs: "First click" then "Second click"
```

If `preventDefault()` is called:

```ts
const props1 = { onclick: (e: MouseEvent) => console.log("First click") };
const props2 = {
	onclick: (e: MouseEvent) => {
		console.log("Second click");
		e.preventDefault();
	},
};
const props3 = { onclick: (e: MouseEvent) => console.log("Third click") };

const mergedProps = mergeProps(props1, props2, props3);
mergedProps.onclick(new MouseEvent("click")); // Logs: "First click" then "Second click" only
```

Since `props2` called `event.preventDefault()`, `props3`'s `onclick` handler will not be called.

### Non-Event Handler Functions

Non-event handler functions are also chained, but without the ability to prevent subsequent functions from executing:

```ts
const props1 = { doSomething: () => console.log("Action 1") };
const props2 = { doSomething: () => console.log("Action 2") };

const mergedProps = mergeProps(props1, props2);
mergedProps.doSomething(); // Logs: "Action 1" then "Action 2"
```

### Classes

Class names are merged using [`clsx`](https://www.npmjs.com/package/clsx):

```ts
const props1 = { class: "text-lg font-bold" };
const props2 = { class: ["bg-blue-500", "hover:bg-blue-600"] };

const mergedProps = mergeProps(props1, props2);
console.log(mergedProps.class); // "text-lg font-bold bg-blue-500 hover:bg-blue-600"
```

### Styles

Style objects and strings are merged, with later properties overriding earlier ones:

```ts
const props1 = { style: { color: "red", fontSize: "16px" } };
const props2 = { style: "background-color: blue; font-weight: bold;" };

const mergedProps = mergeProps(props1, props2);
console.log(mergedProps.style);
// "color: red; font-size: 16px; background-color: blue; font-weight: bold;"
```

```ts
import { mergeProps } from "bits-ui";

const props1 = { style: "--foo: red" };
const props2 = { style: { "--foo": "green", color: "blue" } };

const mergedProps = mergeProps(props1, props2);

console.log(mergedProps.style); // "--foo: green; color: blue;"
```
