import "reflect-metadata";
import { describe, it, beforeEach, vi, expect, assertType } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { IMediakiwiServiceRegistrations } from "@/models";
import { container } from "tsyringe";
import { registerServices } from "@/helpers/registerServices";
import { MockedNavigationConnector, MockedRolesConnector } from "../__mocks__/mediakiwi";
import { VuetifyOptions } from "vuetify/lib/framework.mjs";
import { MediaKiwiState, useMediakiwiStore } from "../mediakiwi";
import axios from "axios";
import { ApiNavigationProvider, ObjectNavigationProvider, SimpleSection } from "@/navigation";

vi.mock("axios");

describe("Mediakiwi Store", () => {
  container.register("MediakiwiAxiosInstance", { useValue: axios });

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
  container.registerInstance("IRoleConnector", new MockedRolesConnector());

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
