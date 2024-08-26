import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { parseIconValue } from "./../useIcons";
import { IconsLibrary } from "./../../models";

describe("useIcons", () => {
  it("Should parse string values into icons", () => {
    // check if the validity check works and that it returns the correct icon
    const assertedFailure = parseIconValue("arrowLeft");

    // if non is present we should get the mdiUnknown icon
    expect(assertedFailure).toContain(IconsLibrary.unknown);

    const assertedSuccess = parseIconValue(IconsLibrary.arrowLeft);
    expect(assertedSuccess).toBe("$arrowLeft");
  });
});
