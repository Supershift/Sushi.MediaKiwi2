import { createApp, ref, App } from "vue";
import { useI18next } from "../useI18next";
import { describe, it, expect, vi, beforeEach } from "vitest";
import i18next from "i18next";

// mock libraries
vi.mock("i18next");

describe("useI18next", () => {
  function getComposable(ns?: string): ReturnType<typeof useI18next> {
    let result;
    const app = createApp({
      setup() {
        result = useI18next(ns);
        // suppress missing template warning
        return () => {};
      },
    });
    app.provide("i18next", ref(i18next));
    app.mount(document.createElement("div"));

    return result;
  }
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("t", () => {
    it("Should call i18next.t without namespace", () => {
      // arrange
      const spy = vi.spyOn(i18next, "t");
      const composable = getComposable();

      // act
      composable.t.value("test");

      // assert
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith("test");
    });
    it("Should call i18next.getFixedT with namespace", () => {
      // arrange
      const spy = vi.spyOn(i18next, "getFixedT").mockImplementation(() => vi.fn());
      const composable = getComposable("myNamespace");

      // act
      composable.t.value("test");

      // assert
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(null, "myNamespace");
    });
  });
  describe("defaultT", () => {
    it("Should call i18next.t", () => {
      // arrange
      const spy = vi.spyOn(i18next, "t");
      const composable = getComposable("myNamespace");

      // act
      composable.defaultT.value("test");

      // assert
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith("test");
    });
  });
  describe("dateTime", () => {
    it("Should parse Date object", () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = getComposable("myNamespace");

      // act
      const result = composable.dateTime.value(new Date(2021, 1, 1, 12, 0, 0));

      // assert
      expect(spy).toHaveBeenCalledWith(language, { dateStyle: "short", timeStyle: "short" });
      expect(result).not.toBeUndefined();
    });
    it("Should parse string", () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = getComposable("myNamespace");

      // act
      const result = composable.dateTime.value("2021-01-01T13:56:43Z");

      // assert
      expect(spy).toHaveBeenCalledWith(language, { dateStyle: "short", timeStyle: "short" });
      expect(result).not.toBeUndefined();
    });
  });
  describe("date", () => {
    it("Should parse Date object", () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = getComposable("myNamespace");

      // act
      const result = composable.date.value(new Date(2021, 1, 1, 12, 0, 0));

      // assert
      expect(spy).toHaveBeenCalledWith(language, { dateStyle: "short" });
      expect(result).not.toBeUndefined();
    });
    it("Should parse string", () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = getComposable("myNamespace");

      // act
      const result = composable.date.value("2021-01-01T13:56:43Z");

      // assert
      expect(spy).toHaveBeenCalledWith(language, { dateStyle: "short" });
      expect(result).not.toBeUndefined();
    });
    describe("time", () => {
      it("Should parse Date object", () => {
        // arrange
        const language = "en";
        i18next.resolvedLanguage = language;
        const spy = vi.spyOn(Intl, "DateTimeFormat");
        const composable = getComposable("myNamespace");

        // act
        const result = composable.time.value(new Date(2021, 1, 1, 12, 0, 0));

        // assert
        expect(spy).toHaveBeenCalledWith(language, { timeStyle: "short" });
        expect(result).not.toBeUndefined();
      });
      it("Should parse string", () => {
        // arrange
        const language = "en";
        i18next.resolvedLanguage = language;
        const spy = vi.spyOn(Intl, "DateTimeFormat");
        const composable = getComposable("myNamespace");

        // act
        const result = composable.time.value("2021-01-01T13:56:43Z");

        // assert
        expect(spy).toHaveBeenCalledWith(language, { timeStyle: "short" });
        expect(result).not.toBeUndefined();
      });
    });
  });
});
