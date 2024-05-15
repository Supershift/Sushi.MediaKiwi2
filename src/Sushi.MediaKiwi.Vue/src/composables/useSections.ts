import { Section } from "@/models";
import { DisableSectionRule } from "@/models/sections/DisableSectionRule";
import { useMediakiwiStore } from "@/stores";
import { ref } from "vue";

export function useSections() {
  // Inject depecency
  const mediakiwiStore = useMediakiwiStore();

  // Define variables
  const rules = ref<DisableSectionRule[]>([]);

  /**
   *  Adds a rule for the section(s) to be disabled
   * @param sectionIds The section id(s) to apply the rule to
   * @param callback The callback function to determine if the section should be disabled
   * @param tooltip The tooltip to show when the section is disabled
   */
  function addDisableSectionRule(sectionIds: string[], callback: () => Promise<boolean>, tooltip?: string) {
    // Add the rule to the list
    rules.value.push(<DisableSectionRule>{ sectionIds, callback, tooltip });

    // Validate the rules
    validateRules();
  }

  /**
   * Validate the section agains the rule
   * @param section The section to validate
   * @param rule The rule to apply
   */
  async function validateDisableSectionRule(section: Section, rule: DisableSectionRule) {
    // Check if the section is in the rule
    section.disabled = await rule.callback();

    // Set the tooltip
    section.tooltip = rule.tooltip;
  }

  /** Validate all rules agains all sections */
  function validateRules() {
    if (mediakiwiStore.sections && rules.value && rules.value.length) {
      // Loop through all rules and apply them to the sections
      rules.value.forEach((rule) => {
        mediakiwiStore.sections.filter((section) => rule.sectionIds.includes(section.id))?.forEach((section) => validateDisableSectionRule(section, rule));
      });
    }
  }

  // Watch for changes in the sections
  mediakiwiStore.onSectionsLoaded(validateRules);

  return {
    addDisableSectionRule,
  };
}
