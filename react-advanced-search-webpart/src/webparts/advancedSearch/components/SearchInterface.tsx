import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { 
    Dropdown, 
    IDropdown, 
    DropdownMenuItemType, 
    IDropdownOption 
} from 'office-ui-fabric-react/lib/Dropdown';
import * as React from 'react';
import { IAdvancedSearchWebPartProps } from '../AdvancedSearchWebPart';
import DateRange, { IDateRangeProps } from './DateRange';
import * as Model from '../model/AdvancedSearchModel';
import styles from './AdvancedSearch.module.scss';


export interface ISearchInterfaceProps {
    initialConfig: Model.IAdvancedSearchConfig;
    searchHandler: Function;
}

export default class SearchInterface extends React.Component<ISearchInterfaceProps, {}> {

    constructor(props) {
        super();
        console.log('Interfaceprops: ', props);
        this.state = {
            searchModel: {
                ...props.initialConfig
            }
        };

    }

    public state: any;
    private readonly columns: number = 3;

    public render(): React.ReactElement<ISearchInterfaceProps> {

        let controls: JSX.Element[] = [];
        let rows: JSX.Element[] = [];
        let key: number = 1;

        this.state.searchModel.properties.forEach((field: Model.ISearchProperty, i: number) => {

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
                            label={field.name}
                            options={field.options.choices}
                            selectedKey={field.value}
                            onChanged={(e) => this.ctrl_change(e, field)}
                            data-index={i}
                            key={key++} 
                            />);
                    }
                    else {
                        controls.push(<TextField 
                            placeholder={field.name}
                            label={field.name} 
                            onChanged={(e) => this.ctrl_change(e, field)}
                            data-index={i}
                            value={field.value ? field.value.toString() : ''}
                            key={key++} />);
                    }
                    break;
                case Model.PropertyValueType.Boolean:
                    if(!field.options){
                        field.options = {} as any;
                    }
                    field.options.choices = [
                        { key: 'true', text: 'Yes' }, 
                        { key: 'false', text: 'No' }];
                    controls.push(<Dropdown 
                        placeHolder={field.name}
                        label={field.name} 
                        onChanged={(e) => this.ctrl_change(e, field)} 
                        options={field.options.choices}
                        selectedKey={field.value}
                        data-index={i} 
                        key={key++} 
                        />);
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
            <div className={styles.searchInterface}>
                <div className="ms-Grid" key="0">
                    {rows}          
                </div>
                <div className={styles.buttonRow}>
                    <DefaultButton
                        primary={true}
                        data-automation-id="test"
                        text="Search"
                        onClick={e => this.btnSearch_click(e)}
                    />
                    <DefaultButton
                        primary={true}
                        data-automation-id="test"
                        text="Reset"
                        onClick={e => this.btnReset_click(e)}
                    />
                </div>
                
                <DateRange />
            </div>
        );

    }

    public formChange(): void {
        console.log('form change');
    }

    protected btnSearch_click(e): void {
        this.props.searchHandler(this.state.searchModel);
    }

    protected btnReset_click(e): void {
        console.log('reset');
        let newOptions = {
            ...this.state.searchModel
        } as Model.IAdvancedSearchConfig;

        newOptions.properties.forEach((field: Model.ISearchProperty) => {
            field.value = '';
        });

        this.setState({
            options: {
                ...newOptions
            }
        });
    }

    protected ctrl_change(val: any, prop: Model.ISearchProperty): void {
        
        console.log(val, prop);

        let newOptions = { ...this.state.searchModel } as Model.IAdvancedSearchConfig;

        newOptions.properties[prop.propIndex].value = val.key != undefined ? val.key : val;

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
