
export interface ISearchPropertyData {
    name: string;
    property: string;
    operator: SearchOperator;
    type: PropertyValueType;
    control?: SearchControlType;
    options?: ISearchPropertyOptions;
    value?: string;
}

export interface ISearchPropertyOptions {
    choices: Array<String | Number | ISelectOption>;
}

export interface ISelectOption {
    key: any;
    text: any;
}

export enum SearchOperator {
    Equals = "equals",
    Between = "between",
    Like = "like",
    Freetext = "freetext"
}

export enum SearchControlType {
    TextField = "TextField",
    SelectField = "SelectField",
    DateRangeField = "DateRange"
}

export interface IAdvancedSearchOptions {
    fields: Array<ISearchPropertyData>;
    results: IResultsData;
}

export interface IResultsData {
    properties: Array<IResultPropertyData>;
}

export interface IResultPropertyData {
    property: string;
    label: string;
    sortable: boolean;
    type: ResultPropertyValueType;
}

export enum ResultPropertyValueType {
    Boolean = "Edm.Boolean",
    DateTime = "Edm.DateTime",
    Double = "Edm.Double",
    Guid = "Edm.Guid",
    Int32 = "Edm.Int32",
    Int64 = "Edm.Int64",
    String = "Edm.String",
    Null = "Null"
}

export enum PropertyValueType {
    Boolean = "Boolean",
    DateTime = "DateTime",
    Double = "Double",
    Guid = "Guid",
    Int32 = "Int32",
    Int64 = "Int64",
    String = "String",
    Null = "Null"
}
