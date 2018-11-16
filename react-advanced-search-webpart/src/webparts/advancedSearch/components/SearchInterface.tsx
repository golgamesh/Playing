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
import DropdownResettable, { IDropdownResettableOption } from './DropdownResettable';

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
                        
                    controls.push(<DropdownResettable
                            placeHolder={field.name}
                            label={field.name}
                            options={field.options.choices as IDropdownResettableOption[]}
                            selectedKey={field.options.choicesSelectedKey as any}
                            //onChange={e => this.ctrl_change(e, field)}
                            onChanged={e => this.ctrl_changed(e, field)}
                            data-index={i}
                            key={key++} 
                        />);

                    }
                    else {

                        controls.push(<TextField
                            spellCheck={false}
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

                    controls.push(<DropdownResettable 
                            placeHolder={field.name}
                            label={field.name} 
                            //onChange={e => this.ctrl_change(e, field)}
                            onChanged={e => this.ctrl_changed(e, field)}
                            options={field.options.choices as IDropdownResettableOption[]}
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
                <div>
                    <DropdownResettable label={"Test"}
                        placeHolder={"Placeholder"}
                        options={[
                            { key: `test-1`, text: 'Yes', value: '1' }, 
                            { key: `test-2`, text: 'No', value: '0' }
                        ]}
                        onChanged={e => this.resettableChanged(e)}
                    />
                </div>

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
            }
        });

        this.setState({
            ...this.state,
            searchModel: newOptions
        } as ISearchInterfaceState);
    }

    protected ctrl_change(val: React.FormEvent<HTMLDivElement>, field: Model.ISearchProperty): void {

        console.log('change', val);


    }

    protected ctrl_changed(val: any, field: Model.ISearchProperty): void {
        
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

        }

/*         this.setState({
            searchModel: newOptions
        } as ISearchInterfaceState); */
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
                   // { key: `${field.property}-0`, text: '', value: '', disabled: true, selected: true },
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
