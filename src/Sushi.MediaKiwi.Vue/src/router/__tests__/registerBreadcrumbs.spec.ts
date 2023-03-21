import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRouter, createWebHistory, type RouteRecordRaw, type RouterOptions } from "vue-router";
import { container } from "tsyringe";
import  registerBreadcrumbs from "../breadcrumbs";
import { useNavigationStore } from "../../stores/navigation";
import { createPinia, setActivePinia, storeToRefs } from "pinia";
import { type Component } from "vue";

describe("Breadcrumbs", () => {
    beforeEach(() => {
      container.reset();
      setActivePinia(createPinia())
    });
    it("Should register breadcrumbs", () => {
      // arrange
      const navigationStore = useNavigationStore();
      const router = createRouter(<RouterOptions>{
        routes: <RouteRecordRaw[]>[{path: "/1", name: "1", component: <Component>{}}],
        history: createWebHistory(),
      });
      const { breadcrumbList } = storeToRefs(navigationStore)
      const routes = router.getRoutes();

      // act
      registerBreadcrumbs(router);

      // assert
      expect(routes.length).toBeGreaterThan(0);
      expect(breadcrumbList.value).not.toBeUndefined()
    });
})