import { TableColumn } from "@/models/table/TableColumn";
import { useTableDisplayStore } from "@/stores/tableDisplay";
import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";
import { displayOptionsColumnIdAttr, displayOptionsColumnNameAttr } from "@/constants";

export function useTableDisplayOptions() {
  const tableDisplayStore = useTableDisplayStore();

  /**
   * Finds all the column texts in the table headers based on the text nodes
   * @param node Currenct node  to search for text nodes
   * @returns Node | null, the text node found or not
   */
  function getTextNode(node: Node): Node | null {
    if (node.nodeType === node.TEXT_NODE && node.nodeValue && !node.nodeValue.includes("_")) {
      return node;
    }

    if (node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const result = getTextNode(node.childNodes[i]);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  /**
   * Generates a unique id based on the value
   */
  function generateUniqueId(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase()); // capitalize after non-alphanumeric characters
  }

  /**
   * Gets the header nodes from the table
   * @returns Record<number, Element> a record of header nodes with their index as the key
   */
  function getHeaderNodes() {
    const headerNodes = document.querySelectorAll(".mk-table-display-options thead th");
    // Convert the NodeList to an array
    return Array.from(headerNodes).reduce((acc: Record<number, Element>, node, index) => {
      acc[index] = node;
      return acc;
    }, {});
  }

  /**
   * Registers the body elements to the columns
   * @param columns Columns being used to register the body elements
   */
  function registerBodyElements(columns: TableColumn[], tableRef?: string) {
    const rows = document.querySelectorAll(".mk-table-display-options tbody tr");

    // Loop through each row and set the data-display-options attribute
    rows.forEach((row) => {
      // Loop through each td and set the data-display-options attribute
      row.querySelectorAll("td").forEach((td, index) => {
        const column = columns.find((c) => c.index === index);

        if (column) {
          td.setAttribute("data-display-options-id", column.id);

          // Set the inital visibility
          setColumnVisibility(columns, column, tableRef);
        }
      });
    });
  }

  /**
   * Registers the header elements to the columns
   * This is used for the initial setup of the table display options
   * @param columns Columns being used to register the header elements
   */
  function registerHeaderElements(columns: TableColumn[], tableRef?: string) {
    const headerNodes = getHeaderNodes();

    // Add an attribute to the head element
    columns.forEach((column) => {
      const element = headerNodes[column.index!];
      if (element) {
        element.setAttribute("data-display-options-id", column.id);
      }
    });
  }

  /**
   * Generates the display columns based on the table headers
   * @returns Array<TableColumn> an array of table columns generated from the table headers
   */
  function generateDisplayColumns(tableRef?: string): Array<TableColumn> {
    // collect the headers
    const headerNodes = getHeaderNodes();

    // Filter out the entries that don't have an id or name
    const entries = Object.entries(headerNodes).filter(([_, element]) => {
      const attrId = element?.getAttribute(displayOptionsColumnIdAttr);
      const attrName = element?.getAttribute(displayOptionsColumnNameAttr);
      const name = getTextNode(element)?.nodeValue || "";
      return attrId || attrName || name;
    });

    return entries.map(([key, element]) => {
      const id = element?.getAttribute(displayOptionsColumnIdAttr);
      const attrName = element?.getAttribute(displayOptionsColumnNameAttr);
      const name = getTextNode(element)?.nodeValue || "";

      const tableColumn = <TableColumn>{
        index: parseInt(key),
        id: id ?? generateUniqueId(name),
        visible: true,
        name: attrName || name,
        tableRef: tableRef,
      };

      return tableColumn;
    });
  }

  /**
   * Initializes the table display options by generating new ones or using the current ones in localstorage
   */
  function initTableDisplayOptions(tableRef?: string, displayOptions?: boolean | TableDisplayOptions) {
    // Assign the columns based on the availability of the local storage, otherwise generate new columns
    const columns = createTableColumns(tableRef, displayOptions);

    // Find header elements and add the data-display-options attribute
    registerHeaderElements(columns, tableRef);

    // Find body elements and add the data-display-options attribute
    registerBodyElements(columns, tableRef);

    return columns;
  }

  function createTableColumns(tableRef?: string, displayOptions?: boolean | TableDisplayOptions) {
    // Get the columns from the local storage
    const storedColumns = loadTableColumns(tableRef);

    // Generated columns based on the table headers
    const generatedColumns = generateDisplayColumns(tableRef);

    // Merge the stored columns with the generated columns
    return mergeColumns(storedColumns, generatedColumns, displayOptions);
  }

  // Function that merges the storedColumns with the generated columns
  function mergeColumns(storedColumns: TableColumn[], generatedColumns: TableColumn[], displayOptions?: boolean | TableDisplayOptions): TableColumn[] {
    // Filters the stored column based on the ID's of the generated columns
    // If the stored column is not found in the generated columns, it should be removed
    storedColumns = storedColumns.filter((storedCol) => generatedColumns.some((genCol) => genCol.id === storedCol.id));

    // set the prelseected columns to the stored columns
    let preselection = storedColumns;

    // If the displayOptions is an object and has columns, set the preselection to the columns
    if (!storedColumns?.length && displayOptions && typeof displayOptions !== "boolean" && displayOptions?.columns) {
      preselection = displayOptions.columns;
    }

    // Bind the data from the stored columns to the generated columns
    // if a stored column is not found in the generated columns, it should be removed
    let localColumns = generatedColumns.map((genCol) => {
      const storedCol = preselection.find((col) => col.id === genCol.id);
      if (storedCol) {
        // Assign the visibility from the stored column
        genCol.visible = storedCol.visible;
      }
      return genCol;
    });

    return localColumns;
  }

  /**
   * Gets the table columns from the tableDisplayStore
   * @returns TableColumn[] an Array of table columns retrieved from the local storage
   */
  function loadTableColumns(tableRef?: string): TableColumn[] {
    const tableDisplayOptions = tableDisplayStore.getDisplayOptions(tableRef);

    // Check the table data
    if (!tableDisplayOptions) {
      return [];
    }

    // get cols basef on reference table
    const cols = tableDisplayOptions.columns || [];

    // Check the columns for the current table data
    if (!cols || !checkTypeTableColumns(cols)) {
      return [];
    }

    return cols as TableColumn[];
  }

  /**
   * Sets the table columns to the tableDisplayStore
   * @param newCols generated columns to replace existing columns configuration
   */
  function saveTableColumns(newCols: TableColumn[], tableRef?: string) {
    const tableDisplayOptions = <TableDisplayOptions>{};

    if (newCols) {
      tableDisplayOptions.columns = [...newCols];
    }
    // Save the columns to the tableDisplayStore
    tableDisplayStore.setDisplayOptions(tableDisplayOptions, tableRef);
  }

  /**
   * Checks if the candidate is a valid array of table columns
   * @param candidate potential array of table columns
   * @returns boolean indicating if it's the correct type
   */
  function checkTypeTableColumns(candidate: Array<any>): boolean {
    if (!candidate || !candidate.length || !Array.isArray(candidate)) {
      return false;
    }
    if (
      candidate.length &&
      candidate.every((col) => col.hasOwnProperty("index") && col.hasOwnProperty("visible") && col.hasOwnProperty("name") && col.hasOwnProperty("id"))
    ) {
      return true;
    }
    return false;
  }

  /**
   * Sets the visibility of the column
   * @param columns
   * @param column
   */
  function setColumnVisibility(columns: TableColumn[], column: TableColumn, tableRef?: string, saveToStorage = false) {
    const col = columns.find((c) => c.id === column.id);
    if (!col) {
      return;
    }

    // TODO: Try to use the table reference for multiple tables on one view ex. document.querySelector([data-table-ref="<tableRef>"])
    const headers = document.querySelectorAll(`.mk-table-display-options thead th[data-display-options-id="${column.id}"]`);
    headers?.forEach((th) => {
      if (th) {
        if (col.visible) {
          th.removeAttribute("mk-hidden");
        } else {
          th.setAttribute("mk-hidden", "");
        }
      }
    });

    const rows = document.querySelectorAll(`.mk-table-display-options tbody tr`);
    rows?.forEach((row) => {
      row.querySelectorAll(`td[data-display-options-id="${col.id}"]`).forEach((td) => {
        if (col.visible) {
          td.removeAttribute("mk-hidden");
        } else {
          td.setAttribute("mk-hidden", "");
        }
      });
    });

    // Save the columns to the tableDisplayStore
    if (saveToStorage) {
      saveTableColumns(columns, tableRef);
    }
  }

  return {
    generateUniqueId,
    initTableDisplayOptions,
    setColumnVisibility,
    createTableColumns,
    getHeaderNodes,
    getTextNode,
    generateDisplayColumns,
    registerHeaderElements,
    registerBodyElements,
    saveTableColumns,
  };
}
