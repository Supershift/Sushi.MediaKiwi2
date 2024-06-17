import { Section } from "@/models";
import { SectionRule } from "@/models/sections/SectionRule";
import { SectionRuleType } from "@/models/sections/SectionRuleType";
import { useMediakiwiStore } from "@/stores";
import { watch } from "vue";

export function useSections() {
  // Inject depecency
  const mediakiwiStore = useMediakiwiStore();

  /**
   *  Adds a rule for the section(s) to be disabled
   * @param sectionIds The section id(s) to apply the rule to
   * @param callback The callback function to determine if the section should be disabled
   * @param tooltip The tooltip to show when the section is disabled
   */
  function addSectionRule(sectionIds: string[], callback: () => Promise<boolean>, type = SectionRuleType.Disable, tooltip?: string) {
    // Create the Rule
    const rule = <SectionRule>{
      sectionIds,
      callback,
      tooltip,
      type,
    };

    // Add the rule to the list
    mediakiwiStore.addSectionRules(rule);

    // Validate the rules
    validateSectionRules();
  }

  /**
   * Validate the section agains the rule
   * @param section The section to validate
   * @param rule The rule to apply
   */
  async function validateSectionRule(section: Section, rule: SectionRule) {
    if (rule.type === SectionRuleType.Disable) {
      // Check if the section is in the rule
      section.disabled = await rule.callback();

      // Set the tooltip
      section.tooltip = rule.tooltip;
    }
  }

  async function waitOnSectionsLoaded(resolve: (sections: Section[]) => void, reject?: (error: any) => void) {
    try {
      // If the sections are already loaded, call the callback immediately
      if (mediakiwiStore.sections?.length) {
        resolve(mediakiwiStore.sections);
        return;
      }

      // Create a watcher to call the callback when the sections are loaded
      const sectionsWatcher = watch(
        () => mediakiwiStore.sections,
        (sections) => {
          if (sections?.length) {
            // Stop watching the sections
            sectionsWatcher();

            // call the resolve callback
            resolve(sections);
          }
        }
      );
    } catch (error) {
      if (reject) {
        reject(error);
      }
    }
  }

  function validateSectionRules() {
    // Watch for changes in the sections
    waitOnSectionsLoaded(() => {
      if (mediakiwiStore.sections?.length && mediakiwiStore.sectionRules && mediakiwiStore.sectionRules.length) {
        // Loop through all rules and apply them to the sections
        mediakiwiStore.sectionRules.forEach((rule) => {
          mediakiwiStore.sections
            .filter((section) => rule.sectionIds.includes(section.id))
            ?.forEach((section) => {
              if (rule.type === SectionRuleType.Disable) {
                validateSectionRule(section, rule);
              }
            });
        });
      }
    });
  }

  return {
    addSectionRule,
    validateSectionRules,
  };
}
