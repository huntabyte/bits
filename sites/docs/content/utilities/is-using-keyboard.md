---
title: IsUsingKeyboard
description: A utility to track whether the user is actively using the keyboard or not.
---

## Overview

`IsUsingKeyboard` is a utility component that tracks whether the user is actively using the keyboard or not. This component is used internally by Bits UI components to provide keyboard accessibility features.

It provides global state that is shared across all instances of the class to prevent duplicate event listener registration.

## Usage

```svelte
<script lang="ts">
	import { IsUsingKeyboard } from "bits-ui";

	const shouldShowMenu = $derived(isUsingKeyboard.current);
</script>
```
