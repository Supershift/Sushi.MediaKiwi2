import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTableDisplayOptions } from "../useTableDisplayOptions";
import { setActivePinia, createPinia } from "pinia";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { mockRouteMeta, mockRoutes } from "../__mocks__/navigation";
import { TableColumn } from "@/models";

// Mock any external dependencies and mocks here
const mockTableDisplayStore = {
  state: {
    tableDisplayOptions: {
      columns: [],
    },
  },
  setDisplayOptions: vi.fn().mockImplementation(() => {
    localStorage.setItem("test", JSON.stringify("test"));
  }),
  getDisplayOptions: vi.fn().mockImplementation(() => {
    JSON.parse(localStorage.getItem("test") || "{}");
  }),
};
let routes: RouteRecordRaw[] = mockRoutes;

let router = createRouter({
  history: createWebHistory(),
  routes,
});

describe("useTableDisplayOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());
    // Mock the store
    vi.mock("@/stores/tableDisplay", () => ({
      useTableDisplayStore: vi.fn(() => mockTableDisplayStore),
    }));
    // Mock current router navigationItem
    vi.mock("@/router", () => ({
      useRoute: vi.fn(() => mockRouteMeta),
      useRouter: vi.fn(() => router),
    }));
  });

  describe("getTextNode", () => {
    const { getTextNode } = useTableDisplayOptions();
    it("finds a text node directly within the given node", () => {
      const node = document.createTextNode("Valid Text");
      expect(getTextNode(node)).toBe(node);
    });

    it("finds a text node within child nodes", () => {
      const parent = document.createElement("div");
      const child = document.createElement("span");
      const textNode = document.createTextNode("Valid Text");
      child.appendChild(textNode);
      parent.appendChild(child);

      expect(getTextNode(parent)).toBe(textNode);
    });

    it("does not return nodes with underscores in their text", () => {
      const node = document.createTextNode("Invalid_Text");
      expect(getTextNode(node)).toBeNull();
    });

    it("returns null when no suitable text node is found", () => {
      const parent = document.createElement("div");
      const child = document.createElement("span");
      parent.appendChild(child); // No text node added

      expect(getTextNode(parent)).toBeNull();
    });
  });

  describe("getHeaderNodes", () => {
    const { getHeaderNodes } = useTableDisplayOptions();
    it("returns an object with header nodes and their indexes", () => {
      document.body.innerHTML = `
        <table class="mk-table-display-options">
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
        </table>
      `;

      const headerNodes = getHeaderNodes();
      expect(headerNodes).toEqual({
        0: document.querySelector("th:nth-child(1)"),
        1: document.querySelector("th:nth-child(2)"),
      });
    });
  });

  describe("registerBodyElements", () => {
    const { registerBodyElements } = useTableDisplayOptions();
    it("registers body elements to columns", () => {
      // arrange
      document.body.innerHTML = `
        <table class="mk-table-display-options">
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row 1 Column 1</td>
              <td>Row 1 Column 2</td>
            </tr>
            <tr>
              <td>Row 2 Column 1</td>
              <td>Row 2 Column 2</td>
            </tr>
          </tbody>
        </table>
      `;

      const columns: TableColumn[] = [
        { id: "test-1", index: 0, name: "Header 1", visible: true },
        { id: "test-2", index: 1, name: "Header 2", visible: true },
      ];

      // act
      registerBodyElements(columns);

      // assert
      const rows = document.querySelectorAll(".mk-table-display-options tbody tr");
      rows.forEach((row, index) => {
        const tds = row.querySelectorAll("td");
        tds.forEach((td, i) => {
          expect(td.getAttribute("data-display-options-id")).toContain(columns[i].id);
        });
      });
    });
  });

  describe("registerHeaderElements", () => {
    const { registerHeaderElements } = useTableDisplayOptions();
    it("registers header elements to columns", () => {
      // arrange
      document.body.innerHTML = `
        <table class="mk-table-display-options">
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
        </table>
      `;

      const columns: TableColumn[] = [
        { id: "test-1", index: 0, name: "Header 1", visible: true },
        { id: "test-2", index: 1, name: "Header 2", visible: true },
      ];

      // act
      registerHeaderElements(columns);

      // assert
      const ths = document.querySelectorAll(".mk-table-display-options thead th");
      ths.forEach((th, index) => {
        expect(th.getAttribute("data-display-options-id")).toContain(columns[index].id);
      });
    });
  });

  describe("generateDisplayColumns", () => {
    const { generateDisplayColumns } = useTableDisplayOptions();
    it("generates display columns based on table headers", () => {
      // arrange
      document.body.innerHTML = `
        <table class="mk-table-display-options">
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row 1 Column 1</td>
              <td>Row 1 Column 2</td>
            </tr>
            <tr>
              <td>Row 2 Column 1</td>
              <td>Row 2 Column 2</td>
            </tr>
          </tbody>
        </table>
      `;

      // act
      const columns = generateDisplayColumns("TestRef");

      // assert
      expect(columns.length).toBe(2);
      expect(columns[0].name).toBe("Header 1");
      expect(columns[1].name).toBe("Header 2");
    });
  });

  describe("createTableColumns", () => {
    const { createTableColumns } = useTableDisplayOptions();
    it("creates table columns based on the given headers", () => {
      // arrange
      const tableRef = "testRef";

      // act
      const columns = createTableColumns(tableRef);

      // assert
      expect(columns.length).toBe(2);
      expect(columns[0].name).toBe("Header 1");
      expect(columns[1].name).toBe("Header 2");
    });
  });

  describe("setColumnVisibility", () => {
    const { setColumnVisibility } = useTableDisplayOptions();
    it("sets the visibility of a column", () => {
      // arrange
      const columns: TableColumn[] = [
        { id: "test-1", index: 0, name: "Header 1", visible: false },
        { id: "test-2", index: 1, name: "Header 2", visible: true },
      ];
      const column = columns[0];
      const tableRef = "testRef";

      // act
      setColumnVisibility(columns, column, tableRef);

      // assert
      expect(columns[0].visible).toBe(false);
    });
  });
  describe("initTableDisplayOptions", () => {
    const { initTableDisplayOptions } = useTableDisplayOptions();
    it("initializes table display options", () => {
      // arrange
      const tableRef = "testRef";

      // act
      initTableDisplayOptions(tableRef);

      // assert
      expect(mockTableDisplayStore.getDisplayOptions).toHaveBeenCalled();
      expect(mockTableDisplayStore.setDisplayOptions).not.toHaveBeenCalled();
    });
  });
  describe("saveTableColumns", () => {
    const { saveTableColumns } = useTableDisplayOptions();
    it("saves the columns to the tableDisplayStore", () => {
      // arrange
      const columns: TableColumn[] = [
        { id: "test-1", index: 0, name: "Header 1", visible: true },
        { id: "test-2", index: 1, name: "Header 2", visible: true },
      ];
      const tableRef = "testRef";

      // act
      saveTableColumns(columns, tableRef);

      // assert
      expect(mockTableDisplayStore.setDisplayOptions).toHaveBeenCalled();
    });
  });
});
