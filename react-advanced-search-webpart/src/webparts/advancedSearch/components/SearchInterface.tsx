import { TextField, Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption, divProperties } from '@microsoft/office-ui-fabric-react-bundle';
import * as React from 'react';
import { ISearchTextFieldProps } from '../helpers/ControlProperties';
import { IAdvancedSearchWebPartProps } from '../AdvancedSearchWebPart';
import * as Model from '../model/AdvancedSearchModel';

export interface ISearchInterfaceProps {
    initialOptions: Model.IAdvancedSearchOptions;
    changeHandler: Function;
}

export default class SearchInterface extends React.Component<ISearchInterfaceProps, {}> {

    constructor(props) {
        super();

        this.state = {
            options: {
                ...props.initialOptions
            }
        };

    }

    public state: any;

    private readonly columns: number = 3;

    public render(): React.ReactElement<ISearchTextFieldProps> {

        let controls: JSX.Element[] = [];
        let rows: JSX.Element[] = [];
        let key: number = 1;
        
        this.state.options.fields.forEach((field: Model.ISearchPropertyData, i: number) => {

            switch(field.type) {
                case Model.PropertyValueType.Int32:
                case Model.PropertyValueType.Int64:
                case Model.PropertyValueType.Guid:
                case Model.PropertyValueType.Double:
                case Model.PropertyValueType.String:
                    if(field.options && field.options.choices && field.options.choices.length) {
                        field.options.choices.forEach((item: any, idx: number) => {
                            if(!this._isSelectOption(item)) {
                                field.options.choices[idx] = { key: item, text: item };
                            }
                        });
                        controls.push(<Dropdown
                            placeHolder={field.name}
                            options={field.options.choices}
                            selectedKey={field.value}
                            onChanged={(e, b) => this.ctrl_change(e, field)}
                            data-index={i}
                            key={key++} />);
                    }
                    else {
                        controls.push(<TextField 
                            placeholder={field.name} 
                            onChanged={(e) => this.ctrl_change(e, field)}
                            data-index={i}
                            value={field.value}
                            key={key++} />);
                    }
                    break;
                case Model.PropertyValueType.Boolean:
                    if(!field.options){
                        field.options = {} as any;
                    }
                    field.options.choices = [{ key: 'Yes', text: 'true' }, { key: 'No', text: 'false' }];
                    controls.push(<Dropdown 
                        placeHolder={field.name} 
                        onChanged={(e) => this.ctrl_change(e, field)} 
                        options={field.options.choices}
                        selectedKey={field.value}
                        data-index={i} 
                        key={key++} />);
                    break;
                case Model.PropertyValueType.DateTime:
                    //controls.push(this.daterangeField(field.name, field.property, 'fields[' + i + '].value'));
                    break;
                default:
                    console.error('unknown property type: ' + field.type);
                    break;
            }

            if((i + 1) % this.columns === 0) {
                let r = this._row(controls, key);
                key = r.key as number;
                key++;
                rows.push(r);
                controls = [];
            }

        });

        if(controls.length > 0) {
            let r = this._row(controls, key);
            key = r.key as number;
            key++;
            rows.push(r);
        }

        return (
            <div className="ms-Grid" key="0">
                {rows}
            </div>
        );

    }

    public formChange(): void {
        console.log('form change');
    }

    public buildInterface(options: Model.IAdvancedSearchOptions): Array<JSX.Element> {
        return null;
        
    }

    protected ctrl_change(val: any, field: Model.ISearchPropertyData): void {
        
        console.log(val, field);

        let newOptions = { ...this.state.options } as Model.IAdvancedSearchOptions;

        newOptions.fields[field.propIndex].value = val.key ? val.key.toString() : val;

        this.setState({
            options: newOptions
        });
    }

    private _container(rows: JSX.Element[], key: number): JSX.Element {
        return (
            <div className="ms-Grid" key={key++}>{rows}</div>
        );
    }

    private _row(controls: JSX.Element[], key: number): JSX.Element {

        let cells: JSX.Element[] = [];

        controls.forEach((control: JSX.Element, i: number) => {
            cells.push(
                <div className="ms-Grid-col ms-sm12 ms-xl6 ms-xxl4" key={key++}>{control}</div>
            );
        });
        return (
            <div className="ms-Grid-row" key={key++}>
                {cells}
            </div>
        );
    }
    
    private _isSelectOption(arg: any): arg is Model.ISelectOption {
        return (arg as Model.ISelectOption).key !== undefined || (arg as Model.ISelectOption).text !== undefined;
    } 

}


function change() {
    console.log('yup');
}