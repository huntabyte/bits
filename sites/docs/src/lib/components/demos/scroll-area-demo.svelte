<script lang="ts">
	import { ScrollArea } from "bits-ui";
</script>

<ScrollArea.Root
	class="relative overflow-hidden rounded-[10px] border border-dark-10 bg-background-alt px-4 py-4 shadow-card"
>
	<ScrollArea.Viewport class="h-full max-h-[200px] w-full max-w-[200px]">
		<h4 class="mb-4 mt-2 text-xl font-semibold leading-none tracking-[-0.01em] text-foreground">
			Scroll Area
		</h4>
		<p class="text-wrap text-sm leading-5 text-foreground-alt">
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos impedit rem,
			repellat deserunt ducimus quasi nisi voluptatem cumque aliquid esse ea deleniti eveniet
			incidunt! Deserunt minus laborum accusamus iusto dolorum. Lorem ipsum dolor sit, amet
			consectetur adipisicing elit. Blanditiis officiis error minima eos fugit voluptate
			excepturi eveniet dolore et, ratione impedit consequuntur dolorem hic quae corrupti
			autem? Dolorem, sit voluptatum.
		</p>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="vertical"
		class="flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent bg-muted p-px transition-all duration-200 hover:w-3 hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0"
	>
		<ScrollArea.Thumb class="flex-1 rounded-full bg-muted-foreground" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar
		orientation="horizontal"
		class="flex h-2.5 touch-none select-none rounded-full border-t border-t-transparent bg-muted p-px transition-all duration-200 hover:h-3 hover:bg-dark-10 "
	>
		<ScrollArea.Thumb class="rounded-full bg-muted-foreground" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
