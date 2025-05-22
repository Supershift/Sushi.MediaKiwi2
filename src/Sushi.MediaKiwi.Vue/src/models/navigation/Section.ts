import { NavigationItem } from "./NavigationItem";

export class Section {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly icon?: string | null,
    readonly roles: string[] = [],
    /** The Navigation items in this section. */
    public items: NavigationItem[] = [],
    /** Tooltip text */
    public tooltip?: string,
    /** Visibility state of the section, leacvy  */
    public displayState?: SectionDisplayState
  ) {}

  public setDisplayState(displayState: SectionDisplayState, tooltip?: string) {
    this.displayState = displayState;
    this.tooltip = tooltip;
  }
}

/**
 * The visibility state of a section
 * - `disabled` - The section is disabled
 * - `hidden` - The section is hidden
 * - `undefined` - The section is visible
 */
export type SectionDisplayState = "disabled" | "hidden" | undefined;
