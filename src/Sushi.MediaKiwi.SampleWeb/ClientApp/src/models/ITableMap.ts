import { ITableMapItem } from "./ITableMapItem";

export interface ITableMap<Type> {
    (arg: Type): Type;
    Items: ITableMapItem<Type>[]
}