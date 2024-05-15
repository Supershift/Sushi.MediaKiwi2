export type DisableSectionRule = {
  sectionIds: string[];
  callback: () => Promise<boolean>;
  tooltip?: string;
};
