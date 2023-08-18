---
title: Context Menu
description: Displays a menu at the pointer's position when the trigger is right-clicked or long-pressed.
---

## Structure

```svelte
<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger />

	<ContextMenu.Content>
		<ContextMenu.Label />
		<ContextMenu.Item />

		<ContextMenu.Group>
			<ContextMenu.Item />
		</ContextMenu.Group>

		<ContextMenu.CheckboxItem>
			<ContextMenu.CheckboxIndicator />
		</ContextMenu.CheckboxItem>

		<ContextMenu.RadioGroup>
			<ContextMenu.RadioItem>
				<ContextMenu.RadioIndicator />
			</ContextMenu.RadioItem>
		</ContextMenu.RadioGroup>

		<ContextMenu.Sub>
			<ContextMenu.SubTrigger />
			<ContextMenu.SubContent />
		</ContextMenu.Sub>

		<ContextMenu.Separator />
		<ContextMenu.Arrow />
	</ContextMenu.Content>
</ContextMenu.Root>
```

🚧 **UNDER CONSTRUCTION** 🚧
