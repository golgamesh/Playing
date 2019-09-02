import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
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
import DateRange, { 
    IDateRangeProps, 
    IDateRangeValue, 
    DateRangeOperator 
} from '../../../components/DateRange';
import NumberRange, {
    INumberRangeProps, INumberRangeValue
} from '../../../components/NumberRange';
import PeoplePicker from '../../../components/PeoplePicker';
import * as Model from '../../../model/AdvancedSearchModel';
import styles from './AdvancedSearch.module.scss';
import DropdownResettable, { IDropdownResettableOption } from '../../../components/DropdownResettable';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';

const AdvancedMinimized: string = `${styles.pnlAdvanced} ${styles.pnlAdvancedMinimized}`;
const AdvancedExpanded: string = styles.pnlAdvanced;

export interface ISearchInterfaceProps {
    config: Array<Model.ISearchProperty>;
    searchHandler: (keywordSearch: string, searchModel: Array<Model.ISearchProperty>, additionalCriteria: string) => void;
    includeKeywordSearch: boolean;
    parentElement: HTMLElement;
    startMinimized: boolean;
    additionalCriteria: string;
}

export interface ISearchInterfaceState {
    keywordSearch: string;
    config: Array<Model.ISearchProperty>;
    resettableKey: string | number;
    classNameAdvanced: string;
    showAdvanced: boolean;
}

export default class SearchInterface extends React.Component<ISearchInterfaceProps, ISearchInterfaceState> {

    constructor(props: ISearchInterfaceProps) {
        super(props);
        console.log('Interfaceprops: ', props);

        this._conformPropertyChoices(props.config);
        this.state = {
            keywordSearch: '',
            config: props.config,
            resettableKey: 'test-1',
            classNameAdvanced: props.startMinimized && props.includeKeywordSearch ? AdvancedMinimized : AdvancedExpanded,
            showAdvanced: !(props.startMinimized && props.includeKeywordSearch)
        } as ISearchInterfaceState;

    }

    public state: ISearchInterfaceState;
    private readonly columns: number = 2;
    private readonly fieldHeight: number = 61;
    private readonly buttonRowHeight: number = 62;

    public componentWillMount(): void {

    }

    public componentWillReceiveProps(nextProps: ISearchInterfaceProps): void {
        const config =  [ ...nextProps.config ];

        this._conformPropertyChoices(config);
        
        this.setState({
          ...this.state,
          config,
          classNameAdvanced: nextProps.startMinimized && nextProps.includeKeywordSearch ? AdvancedMinimized : AdvancedExpanded,
          showAdvanced: !(nextProps.startMinimized && nextProps.includeKeywordSearch)
        } as ISearchInterfaceState);
    }
    
    public render(): React.ReactElement<ISearchInterfaceProps> {

        let controls: JSX.Element[] = [];
        let rows: JSX.Element[] = [];
        let key: number = 1;

        const { config: searchModel } = this.state;

        searchModel.forEach((field: Model.ISearchProperty, i: number) => {

            switch(field.type) {
                case Model.PropertyValueType.Int32:
                case Model.PropertyValueType.Int64:
                case Model.PropertyValueType.Guid:
                case Model.PropertyValueType.Double:
                case Model.PropertyValueType.Numeric:
                case Model.PropertyValueType.String:
                    if(field.operator === Model.SearchOperator.NumberRange) {

                        controls.push(<NumberRange 
                            label={field.name}
                            onChanged={e => this.ctrl_changed(e, field)}
                            data-index={i}
                            key={key++}
                        />);

                    } else {
                        
                        if(this._hasChoices(field)) {
                            
                        controls.push(<DropdownResettable
                                placeHolder={field.operator}
                                label={field.name}
                                options={field.propertyChoices as IDropdownResettableOption[]}
                                selectedKey={field.choicesSelectedKey as any}
                                //onChange={e => this.ctrl_change(e, field)}
                                onChanged={e => this.ctrl_changed(e, field)}
                                data-index={i}
                                key={key++} 
                            />);

                        }
                        else {

                            controls.push(<TextField
                                spellCheck={false}
                                placeholder={field.operator}
                                label={field.name} 
                                onChanged={(e) => this.ctrl_changed(e, field)}
                                data-index={i}
                                type={"numeric"}
                                value={field.value ? field.value.toString() : ''}
                                key={key++} 
                            />);

                        }
                    }
                    break;
                case Model.PropertyValueType.Person:
                    controls.push(<PeoplePicker
                            onResolveSuggestions={null}
                            onChanged={e => this.ctrl_changed(e, field)}
                            label={field.name}
                            placeholder={field.operator}
                            data-index={i}
                            key={key++} 
                        />);
                    break;
                case Model.PropertyValueType.Boolean:

                    controls.push(<DropdownResettable 
                            placeHolder={field.operator}
                            label={field.name} 
                            //onChange={e => this.ctrl_change(e, field)}
                            onChanged={e => this.ctrl_changed(e, field)}
                            options={field.propertyChoices as IDropdownResettableOption[]}
                            selectedKey={field.choicesSelectedKey as any}
                            data-index={i} 
                            key={key++} 
                        />);
                        
                    break;
                case Model.PropertyValueType.DateTime:
                    //field.options = field.options || {} as Model.ISearchPropertyOptions;
                    field.data = field.data || {} as any;
                    field.data.value = field.data.value || DateRange.emptyValue; 

                    controls.push(<DateRange
                            placeHolder={field.name} 
                            label={field.name}
                            onChanged={e => this.ctrl_changed(e, field)}
                            value={field.data.value as any}
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
                <div>
                    {this.keywordSearch()}
                </div>
                <div 
                    className={this.state.classNameAdvanced}
                    style={{
                        maxHeight: this.state.config.length * this.fieldHeight + this.buttonRowHeight
                    }}
                >
                    <div className="ms-Grid" key="0">
                        {rows}
                    </div>
                    <div className={styles.buttonRow}>
                        <DefaultButton
                            primary={true}
                            data-automation-id="test"
                            text="Search"
                            onClick={this.btnSearch_click}
                        />
                        <DefaultButton
                            primary={true}
                            data-automation-id="test"
                            text="Reset"
                            onClick={this.btnReset_click}
                        />
                    </div>
                </div>
            </div>
        );

    }

    protected keywordSearch(): React.ReactElement<HTMLDivElement> {
        if(this.props.includeKeywordSearch) {
            return (
                <div className={styles.keywordSearch}>
                    <TextField
                        placeholder="Search"
                        value={this.state.keywordSearch}
                        onChanged={this.keywordSearch_changed}
                        autoFocus={true}
                        onRenderPrefix={(props: ITextFieldProps): JSX.Element => {
                            return (
                                <DefaultButton
                                    iconProps={{
                                        iconName: 'Search'
                                    }}
                                    onClick={this.btnSearch_click}
                                    className="btnKeywordSearch"
                                />
                            );
                        }}
                        suffix={this.props.startMinimized ? "Advanced" : ""}
                        onRenderSuffix={(props: ITextFieldProps): JSX.Element => {
                            const { suffix } = props;
                            if(this.props.startMinimized) {
                                return (
                                    <DefaultButton 
                                        text={suffix}
                                        onClick={this.btnAdvanced_click}
                                        className="btnAdvanced"
                                        checked={this.state.showAdvanced}
                                    />
                                );
                            } else {
                                return null;
                            }
                        }}
                    />
                </div>
            );
        } else {
            return null;
        }
    }

    protected keywordSearch_changed = (keywordSearch: string): void => {
        console.log('keywordSearch: ', keywordSearch);
         this.setState({
            ...this.state,
            keywordSearch
         } as ISearchInterfaceState);
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

    protected btnAdvanced_click = (e: React.MouseEvent<any>): void => {
        console.log('click');
        let { showAdvanced } = this.state;

        showAdvanced = !showAdvanced;
        
        this.setState({
            ...this.state,
            showAdvanced,
            classNameAdvanced: showAdvanced ? AdvancedExpanded : AdvancedMinimized
        });

    }

    protected btnSearch_click = (e: React.MouseEvent<any>): void => {
        this.props.searchHandler(this.state.keywordSearch, this.state.config, this.props.additionalCriteria);
    }

    protected btnReset_click = (e: React.MouseEvent<any>): void => {

        let keywordSearch = "";

        let config = [ ...this.state.config ] as Array<Model.ISearchProperty>;

        config.forEach((field: Model.ISearchProperty) => {

            if(field.type == Model.PropertyValueType.DateTime) {
                field.data.value = null;
            } else if(field.type === Model.PropertyValueType.Numeric) {
                field.value = null;
            } else if(this._hasChoices(field) || field.type === Model.PropertyValueType.Boolean) {

                field.choicesSelectedKey = null;
                field.value = null;

            } else {
                field.value = '';
            }
        });

        this.setState({
            ...this.state,
            config,
            keywordSearch
        } as ISearchInterfaceState);
    }

    protected ctrl_change(val: React.FormEvent<HTMLDivElement>, field: Model.ISearchProperty): void {

        console.log('change', val);


    }

    protected ctrl_changed(val: any, field: Model.ISearchProperty): void {
        
        let newOptions = { ...this.state.config } as Array<Model.ISearchProperty>;
        let newProp = newOptions[field.propIndex];
        newProp.value = (!!val && val.value !== undefined) ? val.value : val;

        if(field.type === Model.PropertyValueType.DateTime) {
            let drVal = val as IDateRangeValue;
/* 
            newProp.data.value = drVal;
            newProp.operator = drVal.operator as any;

            if(drVal.date) {
                newProp.value = drVal.date.toISOString();
            }

            if(drVal.operator === DateRangeOperator.Between && drVal.dateEnd) {
                newProp.value += ';' + drVal.dateEnd;
            } */

            //newProp.operator = drVal.operator.internal as any;
            newProp.value = drVal;

        }

        if(field.type === Model.PropertyValueType.Numeric) {
            let numVal = val as INumberRangeValue;
            //newProp.operator = numVal.operator.internal as any;
            newProp.value = numVal;
        }

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
        return field.choices && field.choices.length > 0;
    }
    
    private _isSearchPropertyChoice(choice: any): choice is Model.ISearchPropertyChoice {
        return choice && typeof choice !== 'string' && typeof choice !== 'number';
    }

    private _conformPropertyChoices(config: Array<Model.ISearchProperty>): void {
        const delim = "|";

        config.forEach(field => {
            if(field.type == Model.PropertyValueType.Boolean) {
                field.data = field.data || DateRange.emptyValue;

                field.propertyChoices = [
                    { key: `${field.property}-1`, text: 'Yes', value: 'true' }, 
                    { key: `${field.property}-2`, text: 'No', value: 'false' }
                ];

            }
            if(this._hasChoices(field)) {

                field.propertyChoices = [];

                field.choices.split("\n").forEach((text, idx) => {
                    let value = text;
                    let key = `${field.property}-${idx}`;

                    if(text.indexOf(delim) !== -1) {
                        let arr = text.split(delim);
                        text = arr[0];
                        value = arr[1];
                    }
                    
                    field.propertyChoices.push({
                        key,
                        text,
                        value
                    } as Model.ISearchPropertyChoice);
                });

            }

        });
    }
}
