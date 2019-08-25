import * as React from 'react';
import {
    Dropdown, 
    IDropdown, 
    DropdownMenuItemType, 
    IDropdownOption 
} from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import styles from './NumberRange.module.scss';
import * as strings from 'AdvancedSearchWebPartStrings';

export interface INumberRangeProps {
    value?: INumberRangeValue;
    label?: string;
    onChanged?: Function;
}

export interface INumberRangeState {
    value: INumberRangeValue;
    classNameNumberEnd: string;
}


export interface INumberRangeOperatorDetails {
    name: string;
    symbol: string;
    placeholder1: string;
    placeholder2?: string;
}

/**
 * All Possible Selectable Number Range operators
 */
export class NumberRangeOperator {

    public static Equals: INumberRangeOperatorDetails = {
        name: strings.EqualsName,
        symbol: strings.EqualsName,
        placeholder1: strings.EqualsPlaceholder1
    };
    
    public static GreaterThan: INumberRangeOperatorDetails = {
        name: strings.GreaterThanName,
        symbol: '>',
        placeholder1: strings.GreaterThanEqualsPlaceholder1
    };

    public static GreaterThanEqual: INumberRangeOperatorDetails = {
        name: strings.GreaterThanEqualsName,
        symbol: '>=',
        placeholder1: strings.GreaterThanEqualsPlaceholder1
    };

    public static LessThan: INumberRangeOperatorDetails = {
        name: strings.LessThanName,
        symbol: '<',
        placeholder1: strings.LessThanPlaceholder1
    };

    public static LessThanEqual: INumberRangeOperatorDetails = {
        name: strings.LessThanEqualsName,
        symbol: '<=',
        placeholder1: strings.LessThanEqualsPlaceholder1
    };

    public static Between: INumberRangeOperatorDetails = {
        name: strings.BetweenName,
        symbol: strings.BetweenSymbol,
        placeholder1: strings.BetweenPlaceholder1,
        placeholder2: strings.BetweenPlaceholder2
    };

}

export interface INumberRangeValue {
    operator: INumberRangeOperatorDetails;
    number: number;
    numberEnd?: number;
}

export default class NumberRange extends React.Component<INumberRangeProps, INumberRangeState> {
    constructor(props: INumberRangeProps) {
        super(props);

        if(!props.value) {                                                  // If initial value is not set
            props.value = NumberRange.emptyValue;                             // Default to empty date range value
        }

        let numberEndClass = props.value.operator.name === NumberRangeOperator.Between.name ? '' : styles.numberEndHidden;

        this.state = {
            classNameNumberEnd: numberEndClass,
            value: props.value
        } as INumberRangeState;

        this._populateOptions();
    }

    public state: INumberRangeState;
    public static get emptyValue(): INumberRangeValue {
        return {
            operator: NumberRangeOperator.Equals,
            number: null
        };
    }

    private _options: Array<IDropdownOption> = [];

    public render(): React.ReactElement<INumberRangeProps> {
        return (
            <div className={styles.numberRange}>
                <Label>{this.props.label}</Label>
                <div className={styles.pickerRow}>
                    
                    <Dropdown
                        options={this._options} 
                        className={styles.numberOperator}
                        onChanged={(e) => this.onOperator_changed(e)}
                        selectedKey={this.state.value.operator.name}
                    />

                    <TextField
                        value={this.state.value.number as any}
                        onChanged={this.onNumber1_changed}
                        placeholder={this.state.value.operator.placeholder1}
                        type={"number"}
                    />

                    <TextField
                        value={this.state.value.numberEnd as any}
                        onChanged={this.onNumber2_changed} 
                        placeholder={this.state.value.operator.placeholder2}
                        className={this.state.classNameNumberEnd}
                        type={"number"}
                    />

                </div>
            </div>
        );
    }

    /**
     * Life cycle event handler
     * @param nextProps new incoming props
     */
    public componentWillReceiveProps(nextProps: INumberRangeProps): void {

        let val = nextProps.value || NumberRange.emptyValue;

        this.setState({                                                     // Update state with new properites
            ...this.state,
            value: val
        } as INumberRangeState,
        () => this.onOperator_changed(val.operator));          // Call operator change handler in case new operator was provided
    }

    protected onNumber1_changed = (newValue: string): void => {
        console.log(newValue);

        this.setState({
            ...this.state,
            value: {
                ...this.state.value,
                number: newValue ? parseInt(newValue) : null
            } as INumberRangeValue

        },
        () => this._changed());
    }

    protected onNumber2_changed = (newValue: string): void => {

        this.setState({
            ...this.state,
            value: {
                ...this.state.value,
                numberEnd: newValue ? parseInt(newValue) : null
            } as INumberRangeValue

        },
        () => this._changed());

    }

    protected onOperator_changed (optionOrValue: INumberRangeOperatorDetails): void;
    protected onOperator_changed (optionOrValue: IDropdownOption): void;
    protected onOperator_changed (optionOrValue: IDropdownOption | NumberRangeOperator): void {

        let operator: INumberRangeOperatorDetails;

        if((optionOrValue as IDropdownOption).data) {
            operator = (optionOrValue as IDropdownOption).data.value;
        } else {
            operator = (optionOrValue as INumberRangeOperatorDetails);
        }

        let classNameNumberEnd = operator.name === NumberRangeOperator.Between.name ? '' : styles.numberEndHidden;
        this.setState({
            ...this.state,
            classNameNumberEnd,
            value: {
                ...this.state.value,
                operator,
            } as INumberRangeValue
        } as INumberRangeState,
        () => this._changed());

    }

    /**
     * Generator options for the number range operator dropdown menu
     */
    protected _populateOptions(): void {
        for (let op in NumberRangeOperator) {                               // Loop through DateRangeOperator values
            this._options.push({                                            // Create a new option for each operator
                text: NumberRangeOperator[op]['symbol'],
                key: NumberRangeOperator[op]['name'],
                data: {
                    value: NumberRangeOperator[op]
                },
                selected: (NumberRangeOperator[op].Name ===
                        this.props.value.operator.name) ? true : undefined       // Mark the correct one as selected
            } as IDropdownOption);
        }
    }


    /**
     * On change, return current date range value to parent component
     */
    protected _changed() {
        let value = this.state.value;
        if(this.props.onChanged) {                                          // If change handler is provided in the properties
            this.props.onChanged(value);                                    // Pass new date range value to the change handler
        }
    }
}