
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { IDateRangeValue } from '../components/DateRange';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface ISearchProperty {
    name: string;
    property: string;
    operator: SearchOperator;
    type: PropertyValueType;
    control?: SearchControlType;
    //options?: ISearchPropertyOptions;
    value?: string | number | undefined | IDateRangeValue;
    propIndex?: number;
    choices?: String;
    propertyChoices?: Array<ISearchPropertyChoice>;
    choicesSelectedKey?: number | string;
    data?: any;
}

export interface ISearchPropertyOptions {
    //selectedItem?: ISelectOption;
    choicesSelectedKey?: number | string;
    choices?: Array<String | Number | ISearchPropertyChoice>;
    data?: any;
}

export interface ISearchPropertyChoice extends IDropdownOption {
    key: string | number | undefined;
    text: string;
    value: string | number | undefined;
}

export interface IResultPropertyDef {
    Key: string;
    Value: string;
    ValueType: ResultPropertyValueType;
}

export enum SearchOperator {
    Equals = "equals",
    Between = "between",
    Before = "before",
    After = "after",
    Contains = "contains",
    Freetext = "freetext",
    DateRange = "dateRange",
    NumberRange = "numberRange"
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
