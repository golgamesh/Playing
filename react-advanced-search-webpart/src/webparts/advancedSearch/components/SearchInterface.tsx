import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { 
    Dropdown,
    IDropdown,
    DropdownMenuItemType, 
    IDropdownOption,
    IDropdownProps
} from 'office-ui-fabric-react/lib/Dropdown';
import { ISelectableDroppableTextProps } from 'office-ui-fabric-react/lib/SelectableOption';
import * as React from 'react';
import { IAdvancedSearchWebPartProps } from '../AdvancedSearchWebPart';
import DateRange, { IDateRangeProps, IDateRangeValue, DateRangeOperator } from './DateRange';
import * as Model from '../model/AdvancedSearchModel';
import styles from './AdvancedSearch.module.scss';
import SearchQueryBuilder from '../helpers/SearchQueryBuilder';
import { divProperties } from '@uifabric/utilities/lib';
import DropdownResettable from './DropdownResettable';

export interface ISearchInterfaceProps {
    initialConfig: Model.IAdvancedSearchConfig;
    searchHandler: Function;
}

export interface ISearchInterfaceState {
    searchModel: Model.IAdvancedSearchConfig;
    resettableKey: string | number;
}

export default class SearchInterface extends React.Component<ISearchInterfaceProps, {}> {

    constructor(props) {
        super();
        console.log('Interfaceprops: ', props);
        let initialState: Model.IAdvancedSearchConfig = {
            ...props.initialConfig
        };
        this._conformPropertyChoices(initialState);
        this.state = {
            searchModel: {
                ...initialState
            },
            resettableKey: 'test-1'
        };

    }

    public state: ISearchInterfaceState;
    private readonly columns: number = 2;

    public render(): React.ReactElement<ISearchInterfaceProps> {

        let controls: JSX.Element[] = [];
        let rows: JSX.Element[] = [];
        let key: number = 1;

        const { searchModel } = this.state;

        searchModel.properties.forEach((field: Model.ISearchProperty, i: number) => {

            switch(field.type) {
                case Model.PropertyValueType.Int32:
                case Model.PropertyValueType.Int64:
                case Model.PropertyValueType.Guid:
                case Model.PropertyValueType.Double:
                case Model.PropertyValueType.String:
                    if(this._hasChoices(field)) {
                        
                    controls.push(<Dropdown
                            placeHolder={field.name}
                            label={field.name}
                            options={field.options.choices}
                            selectedKey={field.options.choicesSelectedKey as any}
                            //onChange={e => this.ctrl_change(e, field)}
                            onChanged={e => this.ctrl_changed(e, field)}
                            data-index={i}
                            key={key++} 
                        />);

                    }
                    else {

                        controls.push(<TextField 
                            placeholder={field.name}
                            label={field.name} 
                            onChanged={(e) => this.ctrl_changed(e, field)}
                            data-index={i}
                            value={field.value ? field.value.toString() : ''}
                            key={key++} 
                        />);

                    }
                    break;
                case Model.PropertyValueType.Boolean:

                    controls.push(<Dropdown 
                            placeHolder={field.name}
                            label={field.name} 
                            //onChange={e => this.ctrl_change(e, field)}
                            onChanged={e => this.ctrl_changed(e, field)}
                            //onRenderList={(props: IDropdownProps, render: Function) => this.dropdown_renderList(props, render, field)} 
                            options={field.options.choices}
                            selectedKey={field.options.choicesSelectedKey as any}
                            data-index={i} 
                            key={key++} 
                        />);
                        
                    break;
                case Model.PropertyValueType.DateTime:
                    field.options = field.options || {} as Model.ISearchPropertyOptions;
                    field.options.data = field.options.data || {} as any;
                    field.options.data.value = field.options.data.value || DateRange.emptyValue; 

                    controls.push(<DateRange
                            placeHolder={field.name} 
                            label={field.name}
                            onChanged={e => this.ctrl_changed(e, field)}
                            value={field.options.data.value as any}
                            data-index={i}
                            key={key++}
                        />);

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
                <DropdownResettable options={[
                        { key: `test-1`, text: 'Yes', value: 'true' }, 
                        { key: `test-2`, text: 'No', value: 'false' }
                    ]}
                    selectedKey={this.state.resettableKey} 
                    onChanged={selected => this.resettableChanged(selected)} />

            </div>
        );

    }

    protected resettableChanged(selected: IDropdownOption): void {
        console.log('resettable changed');

        this.setState({
            ...this.state,
            resettableKey: selected.key
        });
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

            if(field.type == Model.PropertyValueType.DateTime) {
                field.options.data.value = DateRange.emptyValue;
            } else if(this._hasChoices(field)) {
                field.options.choicesSelectedKey = null;
                field.value = null;
                field.options.choices = this._includeResetDropdownChoice(field, false);
            }
        });

        this.setState({
            searchModel: {
                ...newOptions
            }
        } as ISearchInterfaceState);
    }
//ISelectableDroppableTextProps<HTMLDivElement>
    protected dropdown_renderList(props: IDropdownProps, render: Function, field: Model.ISearchProperty): any  {
        console.log('render list: ', render);
/* 
        if(field.value) {
            props.options = this._includeResetDropdownChoice(field, true);
        } */

        //newProp.options.choicesSelectedKey = choice.key;

        return render(props);

    }

    protected ctrl_change(val: React.FormEvent<HTMLDivElement>, field: Model.ISearchProperty): void {

        console.log('change', val);


    }

    protected ctrl_changed(val: any, field: Model.ISearchProperty): void {
        
        console.log('changed');

        let newOptions = { ...this.state.searchModel } as Model.IAdvancedSearchConfig;
        let newProp = newOptions.properties[field.propIndex];
        newProp.value = val.value !== undefined ? val.value : val;

        if(field.type === Model.PropertyValueType.DateTime) {

            let drVal = val as IDateRangeValue;
            newProp.options.data.value = drVal;
            newProp.operator = drVal.operator as any;

            if(drVal.date) {
                newProp.value = drVal.date.toISOString();
            }

            if(drVal.operator === DateRangeOperator.Between && drVal.dateEnd) {
                newProp.value += ';' + drVal.dateEnd;
            }

        } else if(this._hasChoices(field)){

            let choice = (val as Model.ISearchPropertyChoice);

            if(choice.value === null) {
                newProp.options.choices = this._includeResetDropdownChoice(field, false);
            } else {
                newProp.options.choices = this._includeResetDropdownChoice(field, true);
            }
            
            newProp.options.choicesSelectedKey = choice.key;
        }

        this.setState({
            searchModel: newOptions
        } as ISearchInterfaceState);
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

    private _includeResetDropdownChoice(field: Model.ISearchProperty, include: boolean): Array<Model.ISearchPropertyChoice> {

        
        let choices = [...field.options.choices] as Array<Model.ISearchPropertyChoice>;

        if(include) {
            if(!this._hasDropdownResetChoice(field)) {
                const resetChoice: Model.ISearchPropertyChoice = {
                    key: `${field.property}-reset`,
                    text: '',
                    value: null
                };
                choices.unshift(resetChoice);
            }
        } else {
            if(this._hasDropdownResetChoice(field)) {
                choices.shift();
            }
        }

        return choices;
    }

    private _hasDropdownResetChoice(field: Model.ISearchProperty): boolean {
        return this._hasChoices(field) && 
            (field.options.choices[0] as Model.ISearchPropertyChoice).value === null;
    }

    private _hasChoices(field: Model.ISearchProperty): boolean {
        return field.options && field.options.choices && field.options.choices.length > 0;
    }
    
    private _isSearchPropertyChoice(choice: any): choice is Model.ISearchPropertyChoice {
        return choice && typeof choice !== 'string' && typeof choice !== 'number';
    }

    private _conformPropertyChoices(config: Model.IAdvancedSearchConfig): void {

        config.properties.forEach(field => {
            if(field.type == Model.PropertyValueType.Boolean) {
                field.options = field.options || {} as Model.ISearchPropertyOptions;
                field.options.data = field.options.data || DateRange.emptyValue;

                if(!field.options){
                    field.options = {} as Model.ISearchPropertyOptions;
                }
                field.options.choices = [
                    //{ key: `${field.property}-0`, text: field.name, value: '' }, 
                    { key: `${field.property}-1`, text: 'Yes', value: 'true' }, 
                    { key: `${field.property}-2`, text: 'No', value: 'false' }
                ] as Model.ISearchPropertyChoice[];

            }
            if(this._hasChoices(field)) {
                //field.options.choices.unshift('');
                field.options.choices.forEach((choice, idx) => {
                    let choiceKey = `${field.property}-${idx}`; 
                    if(this._isSearchPropertyChoice(choice)) {
                        (choice as Model.ISearchPropertyChoice).key = choiceKey;
                    } else {
                        field.options.choices[idx] = {
                            key: choiceKey,
                            text: choice,
                            value: choice
                        } as Model.ISearchPropertyChoice;
                    }
                });

            }

        });
    }
}
