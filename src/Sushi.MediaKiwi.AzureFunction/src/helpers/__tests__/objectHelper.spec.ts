import { describe, it, expect } from "vitest";
import { formatKey, getTypedValue, parseToNestedObject, mergeDeep } from "../objectHelper";

describe("ObjectHelper", () => {
  describe("formatKey", () => {
    it("Should format key to camelCase", () => {
      const value = "MediaKiwi";
      const result = formatKey(value);
      expect(result).toMatch("mediaKiwi");
    });
  });

  describe("getTypedValue", () => {
    it("Should parse string to boolean", () => {
      const value = "true";
      const result = getTypedValue(value);

      expect(result);
      expect(typeof result).toBe("boolean");
    });

    it("Should parse string to number", () => {
      const value = "100";
      const result = getTypedValue(value);
      expect(result);
      expect(typeof result).toBe("number");
    });

    it("Should parse empty string to undefined", () => {
      const value = "";
      const result = getTypedValue(value);
      expect(result).toBe(undefined);
    });
  });

  describe("parseToNestedObject", () => {
    it("Should parse nested object", () => {
      // set the keys
      const key = "MediaKiwi.msalConfig.auth.redirectUri";
      const value = "/loginRedirect";

      const result = parseToNestedObject(key, value);

      expect(result).not.toBeUndefined();
      expect(result).toEqual({
        mediaKiwi: {
          msalConfig: {
            auth: {
              redirectUri: "/loginRedirect",
            },
          },
        },
      });
    });

    it("Should handle wrong nested object", () => {
      // set the keys
      const key = "MediaKiwi..msalConfig.auth.redirectUri";
      const value = "/loginRedirect";

      const result = parseToNestedObject(key, value);

      expect(result).not.toBeUndefined();
      expect(result).toEqual({
        mediaKiwi: {
          msalConfig: {
            auth: {
              redirectUri: "/loginRedirect",
            },
          },
        },
      });
    });

    it("Should return empty object when missing key", () => {
      // set the keys
      const value = "/loginRedirect";

      const result = parseToNestedObject("", value);

      expect(result).not.toBeUndefined();
      expect(result).toEqual({});
    });
  });

  describe("mergeDeep", () => {
    it("Should merge two nested objects", () => {
      const target = parseToNestedObject("MediaKiwi.msalConfig.auth.redirectUri", "/loginRedirect");
      const source = parseToNestedObject("MediaKiwi.msalConfig.clientId", "testId");

      const result = mergeDeep(target, source);

      expect(result).not.toBeUndefined();
      expect(result).toEqual({
        mediaKiwi: {
          msalConfig: {
            auth: {
              redirectUri: "/loginRedirect",
            },
            clientId: "testId",
          },
        },
      });
    });

    it("Should merge two nested objects when one is undefined", () => {
      const object = parseToNestedObject("MediaKiwi.msalConfig.auth.redirectUri", "/loginRedirect");

      const result = mergeDeep(object, undefined);

      expect(result).not.toBeUndefined();
      expect(result).toEqual({
        mediaKiwi: {
          msalConfig: {
            auth: {
              redirectUri: "/loginRedirect",
            },
          },
        },
      });
    });

    it("Should handle faulty objects", () => {
      const target = "";
      const source = "";

      const result = mergeDeep(target, source);

      expect(result).toBe(target);
    });

    it("Should handle faulty source", () => {
      const target = "";
      const source = parseToNestedObject("MediaKiwi.msalConfig.clientId", "testId");

      const result = mergeDeep(target, source);

      expect(result).toBe(target);
    });

    it("Should handle faulty target", () => {
      const target = parseToNestedObject("MediaKiwi.msalConfig.clientId", "testId");
      const source = "";

      const result = mergeDeep(target, source);

      expect(result).toBe(target);
    });
  });
});
