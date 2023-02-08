export interface INavigationItem {
  id: number;
  name: string | null;
  typeId: number;
  sectionId: number;
  parentNavigationItemId: number | null;
  screenId: number | null;
  path: string;
}
