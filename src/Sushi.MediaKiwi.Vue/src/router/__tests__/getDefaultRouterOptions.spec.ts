import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "tsyringe";
import { defineComponent } from "vue";
import { getDefaultRouterOptions } from "../getDefaultRouterOptions";

// mock libraries
vi.mock("vue-router");

describe("RouteGenerator", () => {
  beforeEach(() => {
    container.reset();
    vi.clearAllMocks();
  });
  it("Should return custom routes items", () => {
    // arrange
    const routerOptions = getDefaultRouterOptions([
      {
        path: "/Test",
        name: "Test",
        component: defineComponent({ template: "<div>Test</div>" }),
      },
    ]);

    // assert
    expect(routerOptions.routes).toHaveLength(4); // signin, loginRedirect, root, Test
    expect(routerOptions.routes.find((route) => route.path === "/Test")).toBeDefined();
  });
  it("Should return parsed query", () => {
    // arrange
    const routerOptions = getDefaultRouterOptions(
      [
        {
          path: "/Test",
          name: "Test",
          component: defineComponent({ template: "<div>Test</div>" }),
        },
      ],
      true
    );

    const res = routerOptions.parseQuery!("test[]=1");
    const res2 = routerOptions.parseQuery!("test[]=1&test[]=2");

    // assert
    expect(res).toBeDefined(); // signin, loginRedirect, root, Test
    expect(res.test!.length).toBe(1); // test should be an array with 1 item
    expect(res2).toBeDefined();
    expect(res2!.test!.length).toBe(2); // test should be an array with 2 items
  });
});
