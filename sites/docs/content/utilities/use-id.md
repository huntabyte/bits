---
title: useId
description: A utility function to generate unique IDs.
---

The `useId` function is a utility function that can be used to generate unique IDs. This function is used internally by all Bits UI components and is exposed for your convenience.

## Usage

```svelte
<script lang="ts">
	import { useId } from "bits-ui";

	const id = useId();
</script>

<label for={id}>Label here</label>
<input {id} />
```
