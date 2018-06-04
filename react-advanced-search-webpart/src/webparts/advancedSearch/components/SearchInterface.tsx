import { TextField, Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption, divProperties } from '@microsoft/office-ui-fabric-react-bundle';
import * as React from 'react';
import { ISearchTextFieldProps } from '../helpers/ControlProperties';
import { IAdvancedSearchWebPartProps } from '../AdvancedSearchWebPart';
import * as Model from '../model/AdvancedSearchModel';

export interface ISearchInterfaceProps {
    options: Model.IAdvancedSearchOptions;
    changeHandler: Function;
}

export default class SearchInterface extends React.Component<ISearchInterfaceProps, {}> {

    private readonly columns: number = 3;

    public render(): React.ReactElement<ISearchTextFieldProps> {
        return this.buildInterface(this.props.options);
    }

    public buildInterface(options: Model.IAdvancedSearchOptions) {
        let controls: JSX.Element[] = [];
        let rows: JSX.Element[] = [];
        let key: number = 0;
        
        options.fields.forEach((field: Model.ISearchPropertyData, i: number) => {

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
                        //controls.push(this.selectField(field.name, field.property, 'fields[' + i + '].value', 'fields[' + i + '].options.choices'));
                        controls.push(<Dropdown
                            placeHolder={field.name}
                            options={ field.options.choices }
                            onChange={e => this.props.changeHandler(e)}
                            key={key++} />);
                    }
                    else {
                        //controls.push(this.textField(field.name, field.property, 'fields[' + i + '].value'));
                        controls.push(<TextField placeholder={field.name} onChange={e => this.props.changeHandler(e)} key={key++} />)
                    }
                    break;
                case Model.PropertyValueType.Boolean:
                    if(!field.options){
                        field.options = {} as any;
                    }
                    field.options.choices = [{ key: 'Yes', text: 'true' }, { key: 'No', text: 'false' }];
                    //controls.push(this.selectField(field.name, field.property, 'fields[' + i + '].value', 'fields[' + i + '].options.choices'));
                    controls.push(<Dropdown placeHolder={field.name} options={field.options.choices} onChange={e => this.props.changeHandler(e)} key={key++} />);
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

        let container = this._container(rows, key);

        //let it = this._iterate(container as any);

        return container;
        
    }

/*     private _iterate(el: Element, iterator: number = 0): number {
        for(let i = 0; i < el.children.length; i++) {
            iterator = this._iterate(el.children[i], iterator);
        }
        el['key'] = iterator++;
        return iterator;
    } */

    private _container(rows: JSX.Element[], key: number): JSX.Element {
        return (
            <div className="container" key={key++}>{rows}</div>
        );
    }

    private _row(controls: JSX.Element[], key: number): JSX.Element {

        let cells: JSX.Element[] = [];

        controls.forEach((control: JSX.Element, i: number) => {
            cells.push(
                <div className="col-4 col-6-lg col-12-sm" key={key++}>{control}</div>
            );
        });
        return (
            <div className="row" key={key++}>
                {cells}
            </div>
        );
    }
    
    private _isSelectOption(arg: any): arg is Model.ISelectOption {
        return (arg as Model.ISelectOption).key !== undefined || (arg as Model.ISelectOption).text !== undefined;
    } 
}