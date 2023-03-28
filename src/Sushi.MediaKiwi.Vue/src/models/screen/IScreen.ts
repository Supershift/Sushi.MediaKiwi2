export interface IScreen {
  id: number;
  name: string;
  /** Unique key for the screen's component. Will be used to find a match in the modules provided when installing MediaKiwi */
  componentKey: string;
  sectionId: number;
  roles: string[];
}
