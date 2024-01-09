/** properties for the scrolling */
export interface Scrolling {
  /** Defines the height of the table for infinite scrolling */
  height?: number;
  /** Defines the text to display when there is nothing left to load  */
  emptyText?: string;
  /** Defines the text to display when there is more to load (manually)  */
  loadText?: string;
  /** Defines the scroll mode */
  mode?: "manual" | "intersect" | undefined;
  /** Specifies where the side content should appear (both is center) */
  side?: "start" | "end" | "both";
}
