/* eslint-disable no-unused-labels */
import "reflect-metadata";
import MkMoneyValueComponent from "../MkMoneyValue.vue";
import { describe, expect, vi, beforeEach } from "vitest";
import { container } from "tsyringe";
import { mountAsync } from "@tests/helpers/mount";

// mock libraries
vi.mock("@azure/msal-browser");
vi.mock("i18next");
vi.mock("vue-router");
vi.mock("vuetify");

describe("MkMoneyValue", () => {
  // Declare the props to be used in all tests
  const props = {
    label: "SRP",
    modelValue: {
      currency: "EUR",
      amount: 12.5,
    },
  };

  beforeEach(() => {
    container.reset();
    vi.clearAllMocks();
  });

  it("Should be rendered", async () => {
    // Mount the component in a suspense wrapper
    const wrapper = await mountAsync(MkMoneyValueComponent, props);

    // Check that the component is rendered and contains a v-input
    const outputHtml = wrapper.html();
    expect(outputHtml).not.toBeNull();
    expect(outputHtml).not.toBeUndefined();
    expect(outputHtml).not.toEqual("");
    expect(outputHtml).toContain("v-input");
  });

  describe("Props", async () => {
    it("Label is set", async () => {
      // Mount the component in a suspense wrapper
      const wrapper = await mountAsync(MkMoneyValueComponent, props);

      // Check that the label is rendered
      expect(wrapper.find(".v-input__control").text()).toContain("SRP");
    });

    it("Currency is set", async () => {
      // Mount the component in a suspense wrapper
      const wrapper = await mountAsync(MkMoneyValueComponent, props);

      // Get the element that should hold the currency value
      const element = wrapper.find(".v-autocomplete__selection .v-autocomplete__selection-text");

      // Check that the element is rendered and contains the currency
      expect(element).toBeDefined();
      expect(element.text()).toContain("EUR");
    });

    it("Input value is set", async () => {
      // Mount the component in a suspense wrapper
      const wrapper = await mountAsync(MkMoneyValueComponent, props);

      // Get the input element and cast it to HTMLInputElement to access the value
      const inputElement = wrapper.find(".v-field__field input[type='number'].v-field__input").element as HTMLInputElement;

      // Check that the element is rendered and contains the currency
      expect(inputElement).toBeDefined();
      expect(inputElement.value).toContain("12.5");
    });
  });
});
