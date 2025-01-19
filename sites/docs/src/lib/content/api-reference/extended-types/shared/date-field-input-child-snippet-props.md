```ts
import type { SegmentPart } from "bits-ui";

type ChildSnippetProps = {
	props: Record<string, unknown>;
	segments: Array<{ part: SegmentPart; value: string }>;
};
```
