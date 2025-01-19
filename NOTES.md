Svelte 5 Related Notes:

-   Determine how we're going to handle the `name` prop for the date field & date range field. Currently, it's passed to the root of the date field, but to the individual inputs for the date range field. It should probably be consistent across both components, opting to pass it to the input.

---

Determine how to handle validation for the various date components. My initial thought is we'll have a `validate` prop that gets called each time the user changes the date value of the component. This gives the user maximum flexibility to handle validation, but we'll need to ensure it's done so in an accessible manner.

Perhaps we can provide a `Validation` component that can be used to display validation messages. Whatever is returned from the `validate` function could be rendered in the `Validation` component as a fallback, or the user can provide their own message within its children. With this approach, we also need to determine how to then handle the cases of `minValue`, `maxValue`, and `isDateUnavailable` being set. Something to think about.

We could have some sort of `Validation` object that gets passed to an `onInvalid` callback prop that is called when the date value is invalid. It could look something like this:

```ts
type InvalidResult = {
	type: "min" | "max" | "unavailable" | "custom";
	message?: string;
};
```

Then the user can handle this in their own way, such as displaying a validation message in a `Validation` component, or calling a function that does whatever they need to do to handle the validation. Need to think more on this one.

---

We need to determine the ideal approach for managing the `data-<component>` attributes. We've decided to use a `data-<component>-root` attribute for the root component, and `data-<component>-<part>` for each part.

Since other components depend on these attributes for selectors, we'll need to put them in a place where they can be easily accessed and if changed, those changes will propagate to everywhere the attribute is used.

They also need to be flexible enough to allow for reusing the same component while swapping the `data-component` prefix, for example, in the menus we have `data-menubar-*`, `data-dropdown-menu-*`, `data-context-menu-*`, etc. The easy button is of course to just consolidate these into just a single `data-menu` attribute, but that's not ideal and hinders the ability to apply different styles on a global level to the different components.

---

Should we embrace the [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) API? Something to think about.

---

We need to expose the different `open` states via snippet props for all the `forceMount`-able components to work with Svelte and other transition/animation libs.

---

We need to handle `invalid` state for the `DateRangeField` component.
