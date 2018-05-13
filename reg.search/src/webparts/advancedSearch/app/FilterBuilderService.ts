import { template } from 'lodash';

export class FilterData {
    public name: string;
    public property: string;
    public operator: FilterOperator;
    public control: FilterControl;
    public type: PropertyValueType; 
    public options: FilterDataOptions;
    public value: string;
}

export class FilterDataOptions {
    choices: Array<String | Number | ISelectOption> = [];
}

export interface ISelectOption {
    name: any;
    value: any;
}

export enum FilterOperator {
    Equals = "equals",
    Between = "between",
    Like = "like",
    Freetext = "freetext"
}

export enum FilterControl {
    TextField = "TextField",
    SelectField = "SelectField",
    DateRangeField = "DateRange"
}

export class AdvancedSearchOptions {
    public fields: FilterData[];
    public results: ResultsData;
}

export class ResultsData {
    public properties: Array<ResultProperty>;
}

export class ResultProperty {
    public property: string;
    public label: string;
    public sortable: boolean;
    public type: ResultPropertyValueType;
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

export default class FilterBuilderService {

    public static $inject: string[] = ['$rootScope'];

    protected _grid(params: any): any {}
    protected _row(params: any): any {}
    protected _cell(params: any): any {}
    protected _textField(params: any): any {}
    protected _selectField(params: any): any {}
    protected _daterangeField(params: any): any {}

    constructor(public options: AdvancedSearchOptions) {
        this._grid = template('<div class="ms-Grid"><%= children %></div>');
        this._row = template('<div class="ms-Grid-row"><%= children %></div>');
        this._cell = template('<div class="ms-Grid-col ms-u-md6"><%= children %></div>');
        this._textField = template(`
            <uif-label class="reg-filter-label"><%= name %></uif-label>
            <uif-textfield placeholder="Type a value to filter on <%= name %>" ng-model="<%= model %>" />`);
        this._selectField = template(`
            <uif-label class="reg-filter-label"><%= name %></uif-label>
            <uif-dropdown ng-model="<%= model %>">
                <uif-dropdown-option value="" class="reg-placeholder" title="<%= name %>">Select a value to filter on <%= name %></uif-dropdown-option>
                <uif-dropdown-option value="{{option.value}}" ng-repeat="option in <%= choices %>" title="{{option.value}}">{{option.name}}</uif-dropdown-option>
            </uif-dropdown>`);
        this._daterangeField = template(`
            <uif-label class="reg-filter-label"><%= name %></uif-label>
            <div daterangeinput name="<%= name %>" property="<%= property %>" ng-model="<%= model %>"></div>`);
    }
    
    protected row(children: string[]): string {
        let cells = [];
        for(var i = 0; i < children.length; i++){
            cells.push(this.cell(children[i]));
        }
        return this._row({ children: cells.join('') });
    }

    protected grid(children: string): string {
        return this._grid({ children: children });
    }

    protected cell(children: string): string {
        return this._cell({ children: children });
    }

    protected textField(name: string, property: string, model: string): string {
        return this._textField({ name: name, property: property, model: model });
    }

    protected selectField(name: string, property: string, model: string, choices: string): string {
        return this._selectField({ name: name, property: property, model: model, choices: choices });
    }

    protected daterangeField(name: string, property: string, model: string): string {
        return this._daterangeField({ name: name, property: property, model: model });
    }

    private isEven(num: number): boolean {
        return num % 2 === 0;
    }

    public BuildFilterUI(): string {
        let ui = ''; 
        let row = '';
        let rows = [];
        let controls = [];
        let columns = 2;

        for(var i = 0; i < this.options.fields.length; i++){
            let field = this.options.fields[i];

            switch(field.type) {
                case PropertyValueType.Int32:
                case PropertyValueType.Int64:
                case PropertyValueType.Guid:
                case PropertyValueType.Double:
                case PropertyValueType.String:
                    if(field.options && field.options.choices && field.options.choices.length){
                        field.options.choices.forEach((item: any, idx: number) => {
                            if(!this._isSelectOption(item)){
                                field.options.choices[idx] = { name: item, value: item };
                            }
                        });
                        controls.push(this.selectField(field.name, field.property, 'fields[' + i + '].value', 'fields[' + i + '].options.choices'));
                    }
                    else {
                        controls.push(this.textField(field.name, field.property, 'fields[' + i + '].value'));
                    }
                    break;
                case PropertyValueType.Boolean:
                    if(!field.options){
                        field.options = new FilterDataOptions();
                    }
                    field.options.choices = [{ name: 'Yes', value: 'true' }, { name: 'No', value: 'false' }];
                    controls.push(this.selectField(field.name, field.property, 'fields[' + i + '].value', 'fields[' + i + '].options.choices'));
                    break;
                case PropertyValueType.DateTime:
                    controls.push(this.daterangeField(field.name, field.property, 'fields[' + i + '].value'));
                    break;
                default:
                    console.error('unknown property type: ' + field.type);
                    break;
            }

            if((i + 1) % columns === 0){
                rows.push(this.row(controls));
                controls = [];
            } 
            else {

            }

        }

        if(controls.length > 0){
            rows.push(this.row(controls));
        }

        return this.grid(rows.join(''));
    }

    private _isSelectOption(arg: any): arg is ISelectOption {
        return (arg as ISelectOption).name !== undefined || (arg as ISelectOption).value !== undefined;
    } 
}