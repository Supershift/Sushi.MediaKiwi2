export interface ITableMapItem<Type> {
    (arg: Type): Type;
    HeaderTitle: string,
    Value: (entity: Type) => string | number | boolean | object
}