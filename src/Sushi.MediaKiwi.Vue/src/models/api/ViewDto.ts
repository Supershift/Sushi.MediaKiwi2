export interface ViewDto {
  /** Human-readable unique ID. */
  id: string;
  /** Name for this screen, can be used for display purposes. */
  name: string;
  /** Unique key for the screen's component. Will be used to find a match in the modules provided when installing MediaKiwi */
  componentKey: string;
  /** If not empty, access to this screen is restricted to these roles. */
  roles: string[];
  /** Name of the URL parameter required by this view, e.g. userId, itemId */
  parameterName?: string | null;
}
