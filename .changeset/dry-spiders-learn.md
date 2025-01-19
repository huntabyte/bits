---
"bits-ui": patch
---

breaking: `Slider.Root` now requires a `type` prop to specify whether the slider should be a `"single"` or `"multiple"` slider, which determines whether the value and change function arguments should be of type `number` or `number[]`
