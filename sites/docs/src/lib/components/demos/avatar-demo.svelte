<script lang="ts">
	import { Avatar } from "bits-ui";

	let loadingStatus = $state<Avatar.RootProps["loadingStatus"]>("loading");
</script>

<Avatar.Root
	bind:loadingStatus
	class="h-12 w-12 rounded-full border {loadingStatus === 'loaded'
		? 'border-foreground'
		: 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground"
>
	<div
		class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
	>
		<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
		<Avatar.Fallback class="border border-muted">HB</Avatar.Fallback>
	</div>
</Avatar.Root>
