export interface View {
  id: number;
  /** Human-readable unique ID. */
  externalId?: string;
  /** Name for this screen, can be used for display purposes. */
  name?: string;
  /** Unique key for the screen's component. Will be used to find a match in the modules provided when installing MediaKiwi */
  componentKey?: string;
  sectionId?: number;
  /** If not empty, access to this screen is restricted to these roles. */
  roles?: string[];
}
