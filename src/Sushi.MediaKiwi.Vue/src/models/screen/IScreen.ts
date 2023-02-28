import { type RouteComponent } from "vue-router";

export interface IScreen {
  id: number;
  name: string;
  componentFileName: string;
  sectionId: number;  
  component: RouteComponent;
}
