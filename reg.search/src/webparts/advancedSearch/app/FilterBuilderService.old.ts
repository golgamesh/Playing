import { template } from 'lodash';

export class FilterData {
    public name: string;
    public property: string;
    public operator: FilterOperator;
    public control: FilterControl;
    public data: any;
    public value: string;
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
    public type: PropertyValueType;
}

export enum PropertyValueType {
    Boolean = "Edm.Boolean",
    DateTime = "Edm.DateTime",
    Double = "Edm.Double",
    Guid = "Edm.Guid",
    Int32 = "Edm.Int32",
    Int64 = "Edm.Int64",
    String = "Edm.String",
    Null = "Null"
}

export default class FilterBuilderService {

    public static $inject: string[] = ['$rootScope'];

    protected _row(params: any): any {}
    protected _cell(params: any): any {}
    protected _textField(params: any): any {}
    protected _selectField(params: any): any {}
    protected _daterangeField(params: any): any {}

    constructor(public options: AdvancedSearchOptions) {
        this._row = template('<div class="row"><%= children %></div>');
        this._cell = template('<div class="col-md-6"><%= children %></div>');
        this._textField =   template('<div textinput   name="<%= name %>" property="<%= property %>" ng-model="<%= model %>"></div>');
        this._selectField = template('<div selectinput name="<%= name %>" property="<%= property %>" ng-model="<%= model %>" choices="<%= choices %>"></div>');
        this._daterangeField = template('<div daterangeinput name="<%= name %>" property="<%= property %>" ng-model="<%= model %>"></div>');
    }
    
    protected row(children: string[]): string {
        let cells = [];
        for(var i = 0; i < children.length; i++){
            cells.push(this.cell(children[i]));
        }
        return this._row({ children: cells.join('') });
    }

    protected cell(children: string): string {
        return this._cell({ children: children }) as string;
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

    private buildChoices(options: string[], label: string): any {
        let choices = [];
        let head = {
            label: "Choose " + label,
            value: "",
            disabled: true,
            selected: true
        };

        choices.push(head);

        options.forEach((value) => {
            let option = {
                label: value,
                value: value,
                disabled: false,
                selected: false
            };
            choices.push(option);
        });

        return choices;

    }

    public BuildFilterUI(): string {
        let ui = ''; 
        let row = '';
        let rows = [];
        let controls = [];
        let columns = 2;

        for(var i = 0; i < this.options.fields.length; i++){
            let field = this.options.fields[i];

            switch(field.control) {
                case FilterControl.TextField:
                    controls.push(this.textField(field.name, field.property, 'fields[' + i + '].value'));
                    break;
                case FilterControl.SelectField:
                    field['choices'] = this.buildChoices(field.data, field.name);
                    controls.push(this.selectField(field.name, field.property, 'fields[' + i + '].value', 'fields[' + i + '].choices'));
                    break;
                case FilterControl.DateRangeField:
                    controls.push(this.daterangeField(field.name, field.property, 'fields[' + i + '].value'));
                    break;
                default:
                    console.error('unknown control: ' + field.control);
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

        return rows.join('');
    }
}