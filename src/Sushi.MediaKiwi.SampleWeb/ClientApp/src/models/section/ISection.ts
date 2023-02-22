export default interface ISection {
  id: number;
  name: string;
  sortOrder: number;
  //---- missing from BE <<<<
  icon?: string;
}
