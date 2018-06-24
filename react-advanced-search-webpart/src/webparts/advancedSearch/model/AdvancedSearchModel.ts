
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';

export interface ISearchProperty {
    name: string;
    property: string;
    operator: SearchOperator;
    type: PropertyValueType;
    control?: SearchControlType;
    options?: ISearchPropertyOptions;
    value?: string | number | undefined;
    propIndex?: number;
}

export interface ISearchPropertyOptions {
    //selectedItem?: ISelectOption;
    choices: Array<String | Number | ISelectOption>;
}

export interface ISelectOption {
    key: string | number | undefined;
    text: any;
}

export interface IResultPropertyDef {
    Key: string;
    Value: string;
    ValueType: ResultPropertyValueType;
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

export interface IAdvancedSearchConfig {
    properties: Array<ISearchProperty>;
}

export interface IResultsConfig {
    columns: Array<IResultProperty>;
}

export interface IResultProperty extends IColumn {
    fieldName: string;
    name: string;
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
