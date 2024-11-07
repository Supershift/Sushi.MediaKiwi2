import "reflect-metadata";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { container } from "tsyringe";
import { VuetifyOptions } from "vuetify/lib/framework.mjs";
import { useMediakiwiStore } from "../mediakiwi";
import { ObjectNavigationProvider, SimpleSection } from "@/navigation";
import { Api } from "@/services/api";

vi.mock(import("@/services/api"), () => {
  const SomeClass = vi.fn()
  SomeClass.prototype.someMethod = vi.fn()
  return { SomeClass }
})

describe("Mediakiwi Store", () => {
  container.register("MediaKiwiApi", { useValue: new Api<any>() });

  // All the sections
  const sections: SimpleSection[] = [
    {
      id: "ControlCenter",
      name: "ControlCenter",
      items: [
        {
          id: "ControlCenter",
          name: "Control Center",
          componentKey: "./views/control-center/ControlCenter.vue",
        },
      ],
    },
  ];
  const provider = new ObjectNavigationProvider();
  provider.SetTree(sections);

  container.registerInstance("INavigationProvider", provider);

  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());
  });

  it("should have a state that implements the MediaKiwiState", () => {
    const mediakiwiStore = useMediakiwiStore();

    expect(mediakiwiStore).toBeDefined();
    expect(mediakiwiStore.$state).toBeDefined();
    expect(mediakiwiStore.$id).toBe("mediaKiwiStore");
    expect(mediakiwiStore.$state).toHaveProperty("navigationTree");
    expect(mediakiwiStore.$state).toHaveProperty("roles");
    expect(mediakiwiStore.$state).toHaveProperty("isLocal");
    expect(mediakiwiStore.$state).toHaveProperty("drawer");
    expect(mediakiwiStore.$state).toHaveProperty("externalIcons");
  });

  describe("actions", () => {
    it("should initialize the store", async () => {
      const mediakiwiStore = useMediakiwiStore();
      const loadFromSourcesSpy = vi.spyOn(mediakiwiStore, "loadFromSources");

      await mediakiwiStore.init();

      expect(loadFromSourcesSpy).toHaveBeenCalled();
    });

    it("should load roles from sources", async () => {
      const mediakiwiStore = useMediakiwiStore();
      const getRolesSpy = vi.spyOn(mediakiwiStore, "getRoles");

      await mediakiwiStore.loadFromSources();

      expect(getRolesSpy).toHaveBeenCalled();
    });

    it("should toggle the drawer", () => {
      const mediakiwiStore = useMediakiwiStore();
      expect(mediakiwiStore.drawer).toBe(true);

      mediakiwiStore.toggleDrawer();

      expect(mediakiwiStore.drawer).toBe(false);
    });

    it("should set roles", () => {
      const mediakiwiStore = useMediakiwiStore();
      const roles = { result: [{ id: "Admin" }] };
      mediakiwiStore.setRoles(roles);

      expect(mediakiwiStore.roles).toHaveLength(1);
      expect(mediakiwiStore.roles[0].id).toBe("Admin");
    });

    it("should register icons", () => {
      const mediakiwiStore = useMediakiwiStore();
      const options = <VuetifyOptions>{
        icons: {
          iconfont: "mdi",
        },
      };
      expect(mediakiwiStore.externalIcons).toBe(false);

      mediakiwiStore.registerIcons(options);

      expect(mediakiwiStore.externalIcons).toBe(true);
    });
  });
});
