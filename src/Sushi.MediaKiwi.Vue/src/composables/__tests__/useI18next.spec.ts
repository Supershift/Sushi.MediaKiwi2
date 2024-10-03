import "reflect-metadata";
import { createApp, ref } from "vue";
import { useI18next } from "../useI18next";
import { describe, it, expect, vi, beforeEach } from "vitest";
import i18next from "i18next";
import { createTestingPinia } from "@pinia/testing";
import { PublicClientApplication } from "@azure/msal-browser";
import { identity } from "../../identity";
import { NavigationItem } from "../../models/navigation";
// mock libraries
vi.mock("i18next");
vi.mock("@azure/msal-browser");
vi.mock("vue-router");

describe("useI18next", () => {
  async function getComposable(ns?: string | NavigationItem): ReturnType<typeof useI18next> {
    let result: any = {};
    const app = createApp({
      setup() {
        result = useI18next(ns);
        // suppress missing template warning
        return () => {};
      },
    });
    app.provide("i18next", ref(i18next));
    app.provide("i18initPromise", Promise.resolve());
    app.provide("mediakiwi", {});
    app.use(createTestingPinia());
    app.mount(document.createElement("div"));
    identity.msalInstance = new PublicClientApplication({ auth: { clientId: "test" } });
    return await result;
  }
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("t", () => {
    it("Should call i18next.t with view's id", async () => {
      // arrange
      const spy = vi.spyOn(i18next, "getFixedT").mockImplementation(() => vi.fn());
      const composable = await getComposable({ id: "myView",children:[], name: 'view', section:{id : '3', name: '', items:[]} });

      // act
      composable.t.value("test");

      // assert
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(null, "myView");
    });
    it("Should call i18next.getFixedT with namespace", async () => {
      // arrange
      const spy = vi.spyOn(i18next, "getFixedT").mockImplementation(() => vi.fn());
      const composable = await getComposable("myNamespace");

      // act
      composable.t.value("test");

      // assert
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(null, "myNamespace");
    });
  });
  describe("defaultT", () => {
    it("Should call i18next.t", async () => {
      // arrange
      const spy = vi.spyOn(i18next, "t");
      const composable = await getComposable("myNamespace");

      // act
      composable.defaultT.value("test");

      // assert
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith("test");
    });
  });
  describe("dateTime", () => {
    it("Should parse Date object", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value(new Date(2021, 1, 1, 12, 0, 0));

      // assert
      expect(spy).toHaveBeenCalledWith(language, { dateStyle: "short", timeStyle: "short" });
      expect(result).not.toBeUndefined();
    });
    it("Should parse string", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value("2021-01-01T13:56:43Z");

      // assert
      expect(spy).toHaveBeenCalledWith(language, { dateStyle: "short", timeStyle: "short" });
      expect(result).not.toBeUndefined();
    });

    it("Should parse nullable Date object", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");
      const date: Date | undefined = undefined;

      // act
      const result = composable.formatDateTime.value(date);

      // assert
      expect(spy).not.toHaveBeenCalled();
      expect(result).toBe("");
    });
  });
  describe("date", () => {
    it("Should parse Date object", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDate.value(new Date(2021, 1, 1, 12, 0, 0));

      // assert
      expect(spy).toHaveBeenCalledWith(language, { dateStyle: "short" });
      expect(result).not.toBeUndefined();
    });
    it("Should parse string", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDate.value("2021-01-01T13:56:43Z");

      // assert
      expect(spy).toHaveBeenCalledWith(language, { dateStyle: "short" });
      expect(result).not.toBeUndefined();
    });

    it("Should parse nullable Date", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");
      const date: Date | undefined = undefined;

      // act
      const result = composable.formatDate.value(date);

      // assert
      expect(spy).not.toHaveBeenCalled();
      expect(result).toBe("");
    });
  });

  describe("time", () => {
    it("Should parse Date object", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatTime.value(new Date(2021, 1, 1, 12, 0, 0));

      // assert
      expect(spy).toHaveBeenCalledWith(language, { timeStyle: "short" });
      expect(result).not.toBeUndefined();
    });
    it("Should parse string", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatTime.value("2021-01-01T13:56:43Z");

      // assert
      expect(spy).toHaveBeenCalledWith(language, { timeStyle: "short" });
      expect(result).not.toBeUndefined();
    });

    it("Should parse nullable time", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");
      const date: Date | undefined = undefined;

      // act
      const result = composable.formatTime.value(date);

      // assert
      expect(spy).not.toHaveBeenCalled();
      expect(result).toBe("");
    });
  });

  describe("formatMonth", () => {
    it("Should parse Date object", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatMonth.value(new Date(2021, 1, 1, 12, 0, 0));

      // assert
      expect(spy).toHaveBeenCalledWith(language, { month: "long" });
      expect(result).not.toBeUndefined();
      expect(result).toBe("February");
    });

    it("Should parse string", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatMonth.value("2021-01-01T13:56:43Z");

      // assert
      expect(spy).toHaveBeenCalledWith(language, { month: "long" });
      expect(result).toBe("January");
      expect(result).not.toBeUndefined();
    });

    it("Should nullable Date", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "DateTimeFormat");
      const composable = await getComposable("myNamespace");
      const date: Date | undefined = undefined;

      // act
      const result = composable.formatMonth.value(date);

      // assert
      expect(spy).not.toHaveBeenCalled();
      expect(result).toBe("");
    });
  });

  describe("formatMoneyValue", () => {
    it("Should format money value", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const spy = vi.spyOn(Intl, "NumberFormat");
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatMoneyValue.value({ currency: "EUR", amount: 123.45 });

      // assert
      expect(spy).toHaveBeenCalledWith(language, { style: "currency", currency: "EUR" });
      expect(result).not.toBeUndefined();
    });
  });

  describe("formatBytes", () => {
    it("Should format bytes to KB", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatBytes.value(1024);

      // assert
      expect(result).toBe("1.02 KB");
    });

    it("Should format bytes to MB", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatBytes.value(1240000);

      // assert
      expect(result).toBe("1.24 MB");
    });

    it("Should format bytes to GB", async () => {
      // arrange
      const language = "en";
      i18next.resolvedLanguage = language;
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatBytes.value(1.24e9);

      // assert
      expect(result).toBe("1.24 GB");
    });
  });
});
