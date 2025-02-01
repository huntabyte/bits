---
title: Introduction
description: The headless components for Svelte.
---

Bits UI is a collection of headless component primitives for Svelte that prioritizes developer experience, accessibility, and flexibility. Our vision is to empower developers to build high-quality, accessible user interfaces without sacrificing creative control or performance.

## Why Bits UI?

### Bring Your Own Styles

Most components ship with zero styling. Minimal styles are included only when absolutely necessary for core functionality. You maintain complete control over the visual design, applying your own styles through standard Svelte class props or targeting components via data attributes. See our [styling guide](/docs/styling) for implementation details.

### Empowering DX

Every component is designed with developer experience in mind:

-   Extensive TypeScript support
-   Predictable behavior and consistent APIs
-   Comprehensive documentation and examples
-   Flexible event override system for custom behavior
-   Sensible defaults

### Built for Production

-   Strives to follow [W3C ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.2/)
-   Built-in keyboard navigation
-   Screen reader optimization
-   Focus management

### Composable Architecture

Components are designed to work independently or together, featuring:

-   [Render Delegation](/docs/child-snippet) for maximum flexibility
-   Chainable events and callbacks
-   Override-friendly defaults
-   Minimal dependencies

## Community

Bits UI is an open-source project built and maintained by [Hunter Johnston](https://x.com/huntabyte) with design support from [Pavel Stianko](https://x.com/pavel_stianko) and his team at [Bitworks Studio](https://bitworks.cz). We always welcome contributions and feedback from the community.

Found an accessibility issue or have a suggestion? [Open an issue](https://github.com/huntabyte/bits-ui/issues/new).

## Acknowledgments

Built on the shoulders of giants:

-   [Melt UI](https://melt-ui.com) - Inspired our internal architecture and powered the first version of Bits UI
-   [Radix UI](https://radix-ui.com) - Reference for component API design
-   [React Spectrum](https://react-spectrum.adobe.com) - Inspiration for date/time components
