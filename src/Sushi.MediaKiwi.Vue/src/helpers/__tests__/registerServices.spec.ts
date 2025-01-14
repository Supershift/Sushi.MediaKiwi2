import "reflect-metadata";
import { describe, it, expect, beforeEach } from "vitest";
import { container } from "tsyringe";
import { registerServices } from "../registerServices";

describe("registerServices", () => {
  beforeEach(() => {
    container.reset();
  });
  it("Should register helpers", () => {
    registerServices(container, undefined);

    var isRegistered = container.isRegistered("RouterManager");

    expect(isRegistered);
  });
});
