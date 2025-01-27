import { NavigationItem } from "./NavigationItem";

export type Section = {
  id: string;
  name: string;
  icon?: string | null;
  /** If not empty, access to this screen is restricted to these roles. */
  roles?: string[];
  /** Tooltip text */
  tooltip?: string;
  /** Visibility state of the section, leacvy  */
  displayState?: SectionDisplayState;

  items: NavigationItem[];
}

/**
 * The visibility state of a section
 * - `disabled` - The section is disabled
 * - `hidden` - The section is hidden
 * - `undefined` - The section is visible
 */
export type SectionDisplayState = "disabled" | "hidden" | undefined;
