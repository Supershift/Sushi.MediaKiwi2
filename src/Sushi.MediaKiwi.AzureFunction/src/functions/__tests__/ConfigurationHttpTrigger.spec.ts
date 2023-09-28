import { vi, describe, it, expect, beforeEach } from "vitest";
import { ConfigurationHttpTrigger } from "../ConfigurationHttpTrigger";
import { Context } from "@azure/functions";

describe("ConfigurationHttpTrigger", () => {
  let context: Context;

  beforeEach(() => {
    context = { log: vi.fn() } as unknown as Context;
  });

  // Here our test will be written
  it("Should return a 200", async () => {
    // Action
    await ConfigurationHttpTrigger(context);

    console.log("context.res:", context.res);

    // Assertion
    expect(context.log).toBeCalledTimes(1);
    expect(context.res?.status).toEqual(200);
  });
});
