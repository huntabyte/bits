<script lang="ts">
	import { page } from "$app/stores";
	import { buttonVariants } from "$lib/styles/buttonVariants.js";

	$: message = $page.status === 404 ? "Not Found" : "Something went wrong";
</script>

<section class="flex h-[calc(100vh_-_71px_-_8rem)] flex-col items-center justify-center gap-3">
	<h1 class="text-6xl font-bold tracking-wider text-foreground">
		{$page.status}
	</h1>
	<p class="text-foreground">{message}</p>
	<a href="/docs" class={buttonVariants({ size: "lg" })}>Back to docs</a>
</section>
