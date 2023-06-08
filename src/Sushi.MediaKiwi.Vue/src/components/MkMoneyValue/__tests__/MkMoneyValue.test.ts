import "reflect-metadata";
import { RenderOptions, render } from "@testing-library/vue";
import MkMoneyValue from "../MkMoneyValue.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import i18next from "i18next";
import { defineComponent } from "vue";
import { h, Suspense } from "vue";

// mock libraries
vi.mock("i18next");

const renderAsync = async (component: any, options?: RenderOptions | undefined) => {
  const wrapper = render(
    defineComponent({
      render() {
        return h(Suspense, null, {
          default: h(component, options?.props),
          fallback: h("div", "fallback"),
        });
      },
    }),
    options
  );

  // await flushPromises();
  return wrapper;
};

describe("MkMoneyValue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Render", () => {
    test("it should work", async () => {
      const { getByText } = await renderAsync(MkMoneyValue, {
        props: {
          label: "SRP",
          value: {
            currency: "USD",
            amount: 100,
          },
        },
        global: {
          provide: {
            i18next,
            i18initPromise: i18next, //createInstance().init(),
          },
          mocks: {
            $t: (key: string) => key,
          },
        },
      });

      // assert output
      const element = getByText("SRP");
      expect(element).not.toBeNull();
    });
  });
});
