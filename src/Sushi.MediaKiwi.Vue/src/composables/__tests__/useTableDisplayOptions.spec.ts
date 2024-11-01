import "reflect-metadata";
import { describe, it, expect, vi } from "vitest";
import { useTableDisplayOptions } from "../useTableDisplayOptions";
import { TableColumn } from "@/models/table/TableColumn";
import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { mockRouteMeta, mockRoutes } from "../__mocks__/navigation";

const hoists = vi.hoisted(() => {
  return {
    getDisplayOptions: vi.fn().mockImplementation(() => {
      JSON.parse(localStorage.getItem("test") || "{}");
    }),
    setDisplayOptions: vi.fn().mockImplementation(() => {
      localStorage.setItem("test", JSON.stringify("test"));
    }),
  };
});

// Mock any external dependencies and mocks here
const mockTableDisplayStore = {
  state: {
    tableDisplayOptions: {
      columns: [],
    },
  },
  setDisplayOptions: hoists.setDisplayOptions,
  getDisplayOptions: hoists.getDisplayOptions,
};
let routes: RouteRecordRaw[] = mockRoutes;

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Mock the store
vi.mock("@/stores/tableDisplay", () => ({
  useTableDisplayStore: vi.fn(() => mockTableDisplayStore),
}));

// Mock current router navigationItem
vi.mock("@/router", () => ({
  useRoute: vi.fn(() => mockRouteMeta),
  useRouter: vi.fn(() => router),
}));

describe("useTableDisplayOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());
  });

  const {
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
  } = useTableDisplayOptions();

  describe("Generate ID", () => {
    it("should generate unique id correctly", () => {
      const id = generateUniqueId("Test Column Name");
      expect(id).toBe("testColumnName");
    });
  });

  describe("Header Nodes", () => {
    it("should get text node correctly", () => {
      const node = document.createTextNode("Test Node");
      const result = getTextNode(node);
      expect(result).toBe(node);
    });

    it("should get header nodes correctly", () => {
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
      expect(Object.keys(headerNodes).length).toBe(2);
    });

    it("should register header elements correctly", () => {
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
        { index: 0, id: "header1", visible: true, name: "Header 1" },
        { index: 1, id: "header2", visible: true, name: "Header 2" },
      ];
      registerHeaderElements(columns);
      const headerNodes = getHeaderNodes();
      expect(headerNodes[0].getAttribute("data-display-options-id")).toBe("header1");
      expect(headerNodes[1].getAttribute("data-display-options-id")).toBe("header2");
    });

    it("should register body elements correctly", () => {
      document.body.innerHTML = `
      <table class="mk-table-display-options">
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;
      const columns: TableColumn[] = [
        { index: 0, id: "cell1", visible: true, name: "Cell 1" },
        { index: 1, id: "cell2", visible: true, name: "Cell 2" },
      ];

      registerBodyElements(columns);
      const rows = document.querySelectorAll(".mk-table-display-options tbody tr");
      expect(rows[0].querySelector("td")?.getAttribute("data-display-options-id")).toBe("cell1");
    });
  });

  describe("generate display columns", () => {
    it("should generate display columns correctly", () => {
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
      const columns = generateDisplayColumns();
      expect(columns.length).toBe(2);
      expect(columns[0].name).toBe("Header 1");
      expect(columns[1].name).toBe("Header 2");
    });

    it("should generate display columns correctly", () => {
      document.body.innerHTML = `
      <table class="mk-table-display-options">
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
      </table>
    `;
      const columns = generateDisplayColumns();
      expect(columns.length).toBe(0);
    });

    it("should generate display columns correctly", () => {
      document.body.innerHTML = `
        <table class="mk-table-display-options">
          <thead>
            <tr>
              <th data-mk="header1"></th>
              <th data-mk="header2"></th>
            </tr>
          </thead>
        </table>
      `;
      const columns = generateDisplayColumns();
      expect(columns.length).toBe(2);
      expect(columns[0].id).toBe("header1");
      expect(columns[1].id).toBe("header2");
    });
  });

  describe("Create table columns", () => {
    it("should initialize table display options correctly", () => {
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
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;
      const columns = initTableDisplayOptions();
      expect(columns.length).toBe(2);
      expect(columns[0].name).toBe("Header 1");
      expect(columns[1].name).toBe("Header 2");
    });

    // Create test with display options parameter in the initTableDisplayOptions
    it("should initialize table display options correctly", () => {
      document.body.innerHTML = `
      <table class="mk-table-display-options">
        <thead>
          <tr>
            <th data-mk="header1">Header 1</th>
            <th data-mk-"header2">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;

      // Create display options
      const hiddenColumns = ["header1"];
      const displayOptions = <TableDisplayOptions>{
        columns: [...hiddenColumns.map((id) => ({ id, visible: false }))],
      };

      const columns = initTableDisplayOptions(undefined, displayOptions);
      expect(columns.length).toBe(2);
      expect(columns[0].visible).toBe(false);
      expect(columns[1].visible).toBe(true);
    });

    it("should initialize table display options correctly", () => {
      document.body.innerHTML = `
      <table class="mk-table-display-options">
        <thead>
          <tr>
            <th data-mk="header1">Header 1</th>
            <th data-mk-"header2">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;

      // Mock the localStorage data
      hoists.getDisplayOptions.mockImplementationOnce(() => {
        return <TableDisplayOptions>{
          columns: [
            {
              id: "header1",
              visible: false,
              index: 0,
              name: "Header 1",
            },
            {
              id: "header2",
              visible: false,
              index: 1,
              name: "Header 2",
            },
          ],
        };
      });

      const columns = initTableDisplayOptions(undefined);

      expect(columns.length).toBe(2);
      expect(columns[0].visible).toBe(false);
      expect(columns[1].visible).toBe(false);
    });

    it("should initialize NEW table display options correctly", () => {
      document.body.innerHTML = `
      <table class="mk-table-display-options">
        <thead>
          <tr>
            <th data-mk="header1">Header 1</th>
            <th data-mk-"header2">Header 2</th>
            <th data-mk-"header3">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;

      // Mock the localStorage data
      hoists.getDisplayOptions.mockImplementationOnce(() => {
        return <TableDisplayOptions>{
          columns: [
            {
              id: "header1",
              visible: false,
              index: 0,
              name: "Header 1",
            },
            {
              id: "header2",
              visible: false,
              index: 1,
              name: "Header 2",
            },
          ],
        };
      });

      const columns = initTableDisplayOptions(undefined);

      expect(columns.length).toBe(3);
      expect(columns[0].visible).toBe(false);
      expect(columns[1].visible).toBe(false);
      expect(columns[2].visible).toBe(true);
    });
  });

  describe("Save table columns", () => {
    it("should set column visibility correctly", () => {
      document.body.innerHTML = `
      <table class="mk-table-display-options">
        <thead>
          <tr>
            <th data-display-options-id="header1">Header 1</th>
            <th data-display-options-id="header2">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-display-options-id="header1">Cell 1</td>
            <td data-display-options-id="header2">Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;
      const columns: TableColumn[] = [
        { index: 0, id: "header1", visible: false, name: "Header 1" },
        { index: 1, id: "header2", visible: true, name: "Header 2" },
      ];
      setColumnVisibility(columns, columns[0]);
      const header = document.querySelector('th[data-display-options-id="header1"]');
      expect(header?.getAttribute("mk-hidden")).toBe("");
    });

    it("should set column visibility correctly", () => {
      document.body.innerHTML = `
      <table class="mk-table-display-options">
        <thead>
          <tr>
            <th data-display-options-id="header1">Header 1</th>
            <th data-display-options-id="header2">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-display-options-id="header1">Cell 1</td>
            <td data-display-options-id="header2">Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;
      const columns: TableColumn[] = [
        { index: 0, id: "header1", visible: false, name: "Header 1" },
        { index: 1, id: "header2", visible: true, name: "Header 2" },
      ];

      // create spy for the setDisplayOptions
      const spy = vi.spyOn(mockTableDisplayStore, "setDisplayOptions");

      setColumnVisibility(columns, columns[0], undefined, true);
      const header = document.querySelector('th[data-display-options-id="header1"]');
      expect(header?.getAttribute("mk-hidden")).toBe("");
      expect(spy).toHaveBeenCalled();
    });

    // create test where columns are empty
    it("should set column visibility correctly", () => {
      document.body.innerHTML = `
      <table class="mk-table-display-options">
        <thead>
          <tr>
            <th data-display-options-id="header1">Header 1</th>
            <th data-display-options-id="header2">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-display-options-id="header1">Cell 1</td>
            <td data-display-options-id="header2">Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;
      const columns: TableColumn[] = [];

      // create spy for the setDisplayOptions
      const spy = vi.spyOn(mockTableDisplayStore, "setDisplayOptions");

      setColumnVisibility(columns, columns[0]);
      const header = document.querySelector('th[data-display-options-id="header1"]');
      expect(header?.getAttribute("mk-hidden")).toBe(null);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
