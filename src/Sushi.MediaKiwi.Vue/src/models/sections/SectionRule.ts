import { SectionRuleType } from "./SectionRuleType";

/**
 * Client Side Section Rule
 */
export type SectionRule = {
  sectionIds: string[];
  callback: () => Promise<boolean>;
  tooltip?: string;
  type?: SectionRuleType;
};
