import type { RouteLocationRaw } from "vue-router";

export type BreadcrumbItem = {
  id: number;
  href: string | undefined;
  replace: boolean | undefined;
  to: RouteLocationRaw | undefined;
  exact: boolean | undefined;
  text: string;
  disabled?: boolean;
};
