export interface INavigationItem {
  id: number;
  name: string;
  typeId: number;
  sectionId: number;
  parentNavigationItemId?: number;
  screenId?: number;
  path: string;
  isItem: boolean;
  itemParamName?: string;
}
