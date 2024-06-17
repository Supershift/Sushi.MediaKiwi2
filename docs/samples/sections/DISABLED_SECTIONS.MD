## Disable Sections

To dynamically disable sections within the portal you can use the `addDisableSectionRule` function from the `useSections` composable. Here you can provide a collection of `sectionIds`, a callback to perform the check to determine the disabled state. Expecting a boolean promise return type, and a optional tooltip to display a reason for the section to be disabled.

```js
const { addSectionRule } = useSections();

addSectionRule(["TestSection"], HasAvailableHotels, SectionRuleType.Disable, "No hotels available. Please add a hotel to enable this section.");
```
