## TODOs

These are outstanding tasks that need to be completed or addressed before the project is ready for release.

-   [x] Make the component which receives the `name` prop consistent across the `DateField` and `DateRangeField`, `DatePicker` and `DateRangePicker` components.
-   [ ] Determine how to handle validation for the various date and time components. Ideally in a way that those using libraries like `sveltekit-superforms` and those that aren't can both benefit from.
-   [ ] Determine the ideal approach for managing the `data-<component>` attributes.
-   [ ] Expose the various `open` states via snippet props for all compoents with the `forceMount` prop for controlled transitions and animations. Thinking more about this, we don't need to pass it via `children`, only via the `child` snippet.
-   [ ] Handle the `invalid` state for the `DateRangeField` component.
-   [ ] Determine how we can give users the ability to opt-out of Floating UI styles.
-   [ ] Now that `Select` is more similar to a native `<select>` element, we need to come up with a solution/component for `MultiSelect` or just `Select` without the underlying `<select>` element and behavior. I want to have a separate `Listbox` component that doesn't have to be within a "popover-like" component and can just be static on the page, so Listbox isn't a fitting component name.
-   [ ] Select deselection of items

## API Reference Audit

-   [ ] Accordion
-   [ ] AlertDialog
-   [ ] AspectRatio
-   [ ] Avatar
-   [ ] Button
-   [ ] Calendar
-   [ ] Checkbox
-   [ ] Collapsible
-   [ ] Combobox
-   [ ] Command
-   [ ] ContextMenu
-   [ ] DateField
-   [ ] DatePicker
-   [ ] DateRangeField
-   [ ] DateRangePicker
-   [ ] Dialog
-   [ ] DropdownMenu
-   [ ] Label
-   [ ] LinkPreview
-   [ ] Listbox
-   [ ] Menubar
-   [ ] NavigationMenu
-   [ ] Pagination
-   [ ] PinInput
-   [ ] Popover
-   [ ] Progress
-   [ ] RadioGroup
-   [ ] RangeCalendar
-   [ ] ScrollArea
-   [ ] Select
-   [ ] Separator
-   [ ] Slider
-   [ ] Switch
-   [ ] Tabs
-   [ ] Toggle
-   [ ] ToggleGroup
-   [ ] Toolbar
-   [ ] Tooltip
