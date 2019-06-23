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
import * as Model from '../../../model/AdvancedSearchModel';
import styles from './AdvancedSearch.module.scss';
import SearchQueryBuilder from '../../../helpers/SearchQueryBuilder';
import { divProperties } from '@uifabric/utilities/lib';
import DropdownResettable, { IDropdownResettableOption } from '../../../components/DropdownResettable';
import { SearchBox, Icon, IconType } from 'office-ui-fabric-react/lib';
import { IRenderFunction } from '@uifabric/utilities';

const AdvancedMinimized: string = `${styles.pnlAdvanced} ${styles.pnlAdvancedMinimized}`;
const AdvancedExpanded: string = styles.pnlAdvanced;

export interface ISearchInterfaceProps {
    config: Model.IAdvancedSearchConfig;
    searchHandler: Function;
    includeKeywordSearch: boolean;
    parentElement: HTMLElement;
    startMinimized: boolean;
}

export interface ISearchInterfaceState {
    config: Model.IAdvancedSearchConfig;
    resettableKey: string | number;
    classNameAdvanced: string;
    showAdvanced: boolean;
    keywordSearchValue?: string;
}

export default class SearchInterface extends React.Component<ISearchInterfaceProps, ISearchInterfaceState> {

    constructor(props: ISearchInterfaceProps) {
        super(props);
        console.log('Interfaceprops: ', props);
        let config: Model.IAdvancedSearchConfig = {
            ...props.config
        };
        this._conformPropertyChoices(config);
        this.state = {
            config,
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
        const config = {
            ...nextProps.config
        };

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
                <div>
                    {this.keywordSearch()}
                </div>
                <div 
                    className={this.state.classNameAdvanced}
                    style={{
                        maxHeight: this.state.config.properties.length * this.fieldHeight + this.buttonRowHeight
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
                        value={this.state.keywordSearchValue}
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
                                        //toggled={true}
                                        /* iconProps={{
                                            iconName: "DoubleChevronDown8"
                                        }} */
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
        this.props.searchHandler(this.state.config);
    }

    protected btnReset_click = (e: React.MouseEvent<any>): void => {
        console.log('reset');

        let config = {
            ...this.state.config
        } as Model.IAdvancedSearchConfig;

        config.properties.forEach((field: Model.ISearchProperty) => {
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
            config,
            keywordSearchValue: ""
        } as ISearchInterfaceState);
    }

    protected ctrl_change(val: React.FormEvent<HTMLDivElement>, field: Model.ISearchProperty): void {

        console.log('change', val);


    }

    protected ctrl_changed(val: any, field: Model.ISearchProperty): void {
        
        let newOptions = { ...this.state.config } as Model.IAdvancedSearchConfig;
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
