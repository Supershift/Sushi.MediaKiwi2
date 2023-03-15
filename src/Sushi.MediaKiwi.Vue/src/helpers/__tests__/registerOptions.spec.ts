import "reflect-metadata";
import { describe, it, expect, beforeEach } from "vitest";
import { container } from "tsyringe";
import { registerOptions } from "../registerOptions";
import { IMediakiwiVueOptions } from "../../models/options";

describe("registerOptions", () => {
  beforeEach(() => {
    container.reset();
  });
  it("Should register all options", () => {
    const expectedMediakiwiOptions = <IMediakiwiVueOptions>{};
    registerOptions(container, expectedMediakiwiOptions);

    var mediakiwiOptions = container.resolve("MediakiwiOptions");

    expect(mediakiwiOptions).toBe(expectedMediakiwiOptions);
  });
});
