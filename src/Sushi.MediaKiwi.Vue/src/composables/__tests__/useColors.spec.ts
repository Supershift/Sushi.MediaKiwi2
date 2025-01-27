import "reflect-metadata";
import { useColors } from "@/composables/useColors";
import { describe, it, expect } from "vitest";

const style = document.createElement("style");
style.textContent = `
:root {
  --v-primary: #123456;
  --v-secondary: #654321;
}`;
document.head.appendChild(style);

const hoisted = vi.hoisted(() => {
  return {
    theme: {
      global: {
        current: {
          value: {
            colors: {
              primary: "#123456",
              secondary: "#654321",
              "on-primary": "#abcdef",
              "on-secondary": "#fedcba",
            },
            variables: {
              primary: undefined,
              secondary: undefined,
            },
          },
        },
      },
    },
  };
});

vi.mock("vuetify/lib/framework.mjs", async () => {
  return {
    useTheme: () => {
      return hoisted.theme;
    },
  };
});

describe("useColors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return colors without on- prefix", () => {
    const { colors } = useColors();

    expect(colors.value).toEqual([
      { key: "primary", value: "#123456", onKey: "on-primary", onValue: "#abcdef" },
      { key: "secondary", value: "#654321", onKey: "on-secondary", onValue: "#fedcba" },
    ]);
  });

  it("should return css variables", () => {
    const { cssVariables } = useColors();

    expect(cssVariables.value).toHaveProperty("primary", "#123456");
    expect(cssVariables.value).toHaveProperty("secondary", "#654321");
  });

  it("should return color background classes", () => {
    const { getColorBackgroundClasses } = useColors();
    expect(getColorBackgroundClasses("primary")).toBe("bg-primary");
    expect(getColorBackgroundClasses("on-primary")).toBe("mk-bg-on-primary");
  });

  it("should return true if color is css color", () => {
    const { isCssColor } = useColors();

    expect(isCssColor("#fff")).toBe(true);
    expect(isCssColor("rgba(0,0,0,0)")).toBe(true);
    // expect(isCssColor("primary")).toBe(false);
  });
});
