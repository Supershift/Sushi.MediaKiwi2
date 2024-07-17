import { TableColumn } from "@/models";
import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";

export const testDisplayOptions = <TableDisplayOptions>{
  columns: <Array<TableColumn>>
    [
      <TableColumn>{ index: 0, id: 'name', name: 'Name', visible: true },
      <TableColumn>{ index: 1, id: 'model', name: 'Model', visible: true },
      <TableColumn>{ index: 2, id: 'year', name: 'year', visible: false },
    ]
};