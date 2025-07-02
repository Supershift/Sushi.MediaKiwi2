import { GenericAbortSignal } from "axios";
import { IListResult, IPagingResult } from "../api";
import { MediakiwiPaginationMode } from "../pagination";
import { TableLoadDataEvent } from "./TableLoadDataEvent";
import { TableMap } from "./TableMap";
import { TablePagingMode } from "./TablePagingMode";
import { TableSortingMode } from "./TableSortingMode";

export type MkTableBaseProps<T> = {
  /** Defines mapping between data and the table. */
  tableMap?: TableMap<T>;
  /** Unique identifier for the item. */
  itemId?: (entity: T) => string | number;
  /** An array of objects used for automatically generating rows. */
  data?: T[];
  /** Id of the navigation item to which the user is pushed when clicking a row. */
  navigationItemId?: string;
  /** Make each row in the table selectable. */
  checkbox?: boolean;
  /** Defines the pagination mode */
  paginationMode?: MediakiwiPaginationMode;
  /** Callback to disable the selection checkbox for a row based on specific criteria */
  disableItemSelection?: (entity: T) => boolean;
  /** Callback to remove the selection checkbox for a row based on specific criteria   */
  removeItemSelection?: (entity: T) => boolean;
  /** Hide the table row action cell when a context menu is implemented */
  hideTableRowActions?: boolean;
  /**
   * Applies when {@link selection} is set.
   * Hides the checkbox in the selection column
   */
  hideSelectionCheckbox?: boolean;
  /**
   * Applies when {@link selection} is set.
   * When true, the row won't have a 'selected' effect when the checkbox is checked.
   */
  hideSelectedEffect?: boolean;
};

export type MkTableViewProps<T> = MkTableBaseProps<T> & {
  /** Defines if the table row has a hover effect */
  showHoverEffect: boolean;
};

export type MkTableProps<T> = MkTableBaseProps<T> &
  MkTableEmptyStateProps & {
    /** Sets data and paging properties based on the API's result. */
    apiResult?: IListResult<T>;
    /** When set, enables paging based on provided values. */
    paging?: IPagingResult;
    /** Who performs paging, MkTable or the caller. Defaults to 'Manual' */
    pagingMode?: TablePagingMode;
    /** Who performs sorting, MkTable or the caller. Defaults to 'Manual' */
    sortingMode?: TableSortingMode;
    /** Determines if the toolbar has a new button, default: false. */
    new?: boolean;
    /** Determines if we only want to emit instead of navigating to the given navigationItemId */
    newEmit?: boolean;
    /** Overrides the "new item" button title */
    newTitle?: string;
    /** Callback invoked when the component needs new data, i.e. a filter changes, the current page changes, etc. */
    onLoad?: (event: TableLoadDataEvent, abortSignal: GenericAbortSignal) => Promise<void>;
    /** Title specificly for the current table */
    title?: string;
    /** Hides the bulk action bar while keeing the checkboxes intact */
    hideBulkActionBar?: boolean;
    /** 'Tracks' the item the user viewed when changing pageSize, when true calculates this instead of resetting pageIndex to 0 */
    pageTracking?: boolean;
    /** Sets the toolbar as a sticky element when scrolling. Defaults to true on MkToolbar */
    stickyToolbar?: boolean;
    /** Shows a ErrorProblemDetails componenent on top of the MkTable when a error occurs in the load method, default: false */
    showErrors?: boolean;
  };

export type MkTableEmptyStateProps = {
  /** Hides the empty state component entirely */
  hideEmptyState?: boolean;
  /** Headline for the Empty State component */
  emptyStateHeadline?: string;
  /** Title for the Empty State component */
  emptyStateTitle?: string;
  /** Text for the Empty State component  */
  emptyStateText?: string;
  /** Path to the media file for the Empty State component. */
  emptyStateImage?: string;
  /** Path to the media file for the Empty State component. */
  emptyStateFilterImage?: string;
};

export type MkTableTableSlotProps<T> = {
  /** An array of objects used for automatically generating rows. */
  data?: T[];
  /** Unique identifier for the item. */
  itemId?: (entity: T) => string | number;
};

/** Base Props for the table row slots */
export type MkTableRowBaseSlotProps<T> = {
  dataItem: T;
};

/** Props for the table context menu slot */
export type MkTableContextMenuSlotProps<T> = MkTableRowBaseSlotProps<T> & {
  isBulkAction?: boolean;
};

/** Props for the table body slot */
export type MkTableBodySlotProps<T> = MkTableRowBaseSlotProps<T>;

/**
 * Props for the Bulk action bar slot
 */
export type MkTableBulkActionBarSlotProps = {
  confirm: (callback: () => void) => void;
};
