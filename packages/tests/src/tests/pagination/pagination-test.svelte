<script lang="ts" module>
	import { Pagination, type WithoutChildrenOrChild } from "bits-ui";
	export type PaginationTestProps = WithoutChildrenOrChild<Pagination.RootProps>;
</script>

<script lang="ts">
	let { count = 100, perPage = 10, ...restProps }: PaginationTestProps = $props();
</script>

<main>
	<Pagination.Root data-testid="root" {count} {perPage} {...restProps}>
		{#snippet children({ pages, range, currentPage: _currentPage })}
			<p data-testid="range">Showing items {range.start} - {range.end}</p>
			<div>
				<Pagination.PrevButton data-testid="prev-button">
					<span>&LeftArrow;</span>
				</Pagination.PrevButton>
				{#each pages as page (page.key)}
					{#if page.type === "ellipsis"}
						<span>...</span>
					{:else if page.type === "page"}
						<Pagination.Page {page} data-testid="page-{page.value}">
							{page.value}
						</Pagination.Page>
					{/if}
				{/each}
				<Pagination.NextButton data-testid="next-button">
					<span>&RightArrow;;</span>
				</Pagination.NextButton>
			</div>
		{/snippet}
	</Pagination.Root>
</main>
