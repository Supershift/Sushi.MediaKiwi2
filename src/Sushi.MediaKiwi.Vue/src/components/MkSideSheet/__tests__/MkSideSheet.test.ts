/* eslint-disable no-unused-labels */
import "reflect-metadata";
import MkSideSheet from "../MkSideSheet.vue";
import { describe, expect, vi, beforeEach } from "vitest";
import { mountAsync } from "@test/utils";

// props
const props = {
  role: "test",
  idName: "test",
  modelValue: true,
  width: "100px",
  height: "500px",
  sheetColor: "red",
  hasClose: true,
};
describe("MkSideSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  // TODO: Add more tests and fix this test (after discussing with team)
  it.skip("Should be rendered", async () => {
    // Mount the component in a suspense wrapper
    const wrapper = await mountAsync(MkSideSheet, props);

    // Check that the component is rendered and contains an icon
    const outputHtml = wrapper.html();
    expect(outputHtml).not.toBeNull();
    expect(outputHtml).not.toBeUndefined();
    expect(outputHtml).not.toEqual("");
    console.log(outputHtml);
    expect(outputHtml).toContain("side-sheet");
  });
});
