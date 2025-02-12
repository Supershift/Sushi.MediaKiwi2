import "reflect-metadata";
import { createApp, ref } from "vue";
import { useI18next } from "../useI18next";
import { describe, it, expect, vi, beforeEach } from "vitest";
import i18next, { TFunction } from "i18next";
import { createTestingPinia } from "@pinia/testing";
import { PublicClientApplication } from "@azure/msal-browser";
import { identity } from "../../identity";
import { NavigationItem } from "../../models/navigation";
import { DateTime, Settings } from "luxon";
// mock libraries
vi.mock("i18next");
vi.mock("@azure/msal-browser");
vi.mock("vue-router");
vi.mock("@composable/useTimeZones");

vi.mock("@/composables/useTimeZones", () => ({
  useTimeZones: () => ({
    currentTimeZone: ref<string>("America/Caracas"),
  }),
}));
Settings.defaultZone = "America/Caracas";

describe("useI18next", () => {
  async function getComposable(ns?: string | NavigationItem): ReturnType<typeof useI18next> {
    let result: any = {};
    const app = createApp({
      setup() {
        result = useI18next(ns);
        // suppress missing template warning
        return () => { };
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
      const spy = vi.spyOn(i18next, "getFixedT").mockImplementation(() => vi.fn() as unknown as TFunction);
      const composable = await getComposable({ id: "myView", children: [], name: "view", section: { id: "3", name: "", items: [] } });

      // act
      composable.t.value("test");

      // assert
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(null, "myView");
    });

    it("Should call i18next.getFixedT with namespace", async () => {
      // arrange
      const spy = vi.spyOn(i18next, "getFixedT").mockImplementation(() => vi.fn() as unknown as TFunction);
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
    it("Should parse (UTC) Date object", async () => {
      // arrange
      i18next.resolvedLanguage = "nl";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value(new Date(Date.UTC(2021, 1, 11, 7, 40, 0)));

      // assert
      expect(result).toBe("11-2-2021, 03:40");
    });

    it("Should parse (UTC) DateTime object", async () => {
      // arrange
      i18next.resolvedLanguage = "nl";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value(DateTime.utc(2021, 2, 11, 7, 40, 0));

      // assert
      expect(result).toBe("11-2-2021, 03:40");
    });

    it("Should parse (local) Date object", async () => {
      // arrange
      i18next.resolvedLanguage = "nl";
      const composable = await getComposable("myNamespace");

      // act
      // NOTE: this is the local time of the browser, not the local time of M:C
      //       doing this will internally set an incorrect UTC time
      //       To workaround this issue, use `useTimezones().forceDateIntoTimeZone(date)`
      const date = new Date("2021-02-11T08:40:00+01:00");
      const result = composable.formatDateTime.value(date);

      vi.resetAllMocks();

      // assert
      expect(result).toBe("11-2-2021, 03:40");
    });

    it("Should parse (local) DateTime object", async () => {
      // arrange
      i18next.resolvedLanguage = "nl";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value(DateTime.local(2021, 2, 11, 3, 40, 0));

      // assert
      expect(result).toBe("11-2-2021, 03:40");
    });

    it("Should correctly show UTC time in local timezone", async () => {
      // arrange
      i18next.resolvedLanguage = "nl";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value(new Date(Date.UTC(2021, 1, 11, 15, 53, 0)));

      // assert
      expect(result).toBe("11-2-2021, 11:53");
    });

    it("Should parse Date object in alternative timezone", async () => {
      // arrange
      i18next.resolvedLanguage = "nl";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value(new Date(Date.UTC(2025, 1, 11, 16, 3, 0)), { timeZone: "America/Adak" });

      // assert
      expect(result).toBe("11-2-2025, 06:03");
    });

    it("Should parse string", async () => {
      // arrange
      i18next.resolvedLanguage = "fr";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value("2021-01-11T13:56:43Z");

      // assert
      expect(result).toBe("11/01/2021 09:56");
    });

    it("Should format correctly in local format", async () => {
      // arrange
      i18next.resolvedLanguage = "en-US";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value("2021-01-11T13:56:43Z", DateTime.DATETIME_FULL);

      // assert
      expect(result).toBe("January 11, 2021 at 9:56 AM GMT-4");
    });

    it("Should parse nullable Date object", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDateTime.value(undefined);

      // assert
      expect(result).toBe("");
    });
  });

  describe("date", () => {
    it("Should parse Date object", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDate.value(new Date(Date.UTC(2021, 1, 1, 12, 0, 0)));

      // assert
      expect(result).toBe("2/1/2021");
    });

    it("Should parse string", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDate.value("2021-01-11T13:56:43Z");

      // assert
      expect(result).toBe("1/11/2021");
    });

    it("Should parse nullable Date", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatDate.value(undefined);

      // assert
      expect(result).toBe("");
    });
  });

  describe("time", () => {
    it("Should parse Date object", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatTime.value(new Date(Date.UTC(2021, 1, 1, 12, 0, 0)));

      // assert
      expect(result).toBe("8:00 AM");
    });

    it("Should format correctly in local format", async () => {
      // arrange
      i18next.resolvedLanguage = "nl";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatTime.value(new Date(Date.UTC(2021, 1, 1, 12, 0, 0)), DateTime.TIME_24_WITH_LONG_OFFSET);

      // assert
      expect(result).toBe("8:00:00 Venezolaanse tijd");
    });


    it("Should parse string", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatTime.value("2021-01-01T13:56:43Z");

      // assert
      expect(result).toBe("9:56 AM");
    });

    it("Should parse nullable time", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatTime.value(undefined);

      // assert
      expect(result).toBe("");
    });
  });

  describe("formatMonth", () => {
    it("Should parse Date object", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatMonth.value(DateTime.utc(2021, 2, 1, 12, 0, 0));

      // assert
      expect(result).toBe("February");
    });

    it("Should parse string", async () => {
      // arrange
      i18next.resolvedLanguage = "nl";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatMonth.value("2021-01-01T13:56:43Z");

      // assert
      expect(result).toBe("januari");
    });

    it("Should nullable Date", async () => {
      // arrange
      i18next.resolvedLanguage = "en";
      const composable = await getComposable("myNamespace");

      // act
      const result = composable.formatMonth.value(undefined);

      // assert
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
