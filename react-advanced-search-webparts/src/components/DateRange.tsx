import * as React from 'react';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import {
    Dropdown, 
    IDropdown, 
    DropdownMenuItemType, 
    IDropdownOption 
} from 'office-ui-fabric-react/lib/Dropdown';
import { Label } from 'office-ui-fabric-react/lib/Label';
import styles from './DateRange.module.scss';

/**
 * This Component's Properties
 */
export interface IDateRangeProps {
    value?: IDateRangeValue;
    placeHolder?: string;
    label?: string;
    onChanged?: Function;
}

/**
 * This Component's State Interface
 */
export interface IDateRangeState {
    classNameDateEnd: string;
    value: IDateRangeValue;
}

/**
 * All Possible Selectable Date Range operators
 */
export enum DateRangeOperator {
    After = "after",
    Before = "before",
    Between = "between",
    On = "equals"
}

/**
 * Composite value of date range properties
 */
export interface IDateRangeValue {
    operator: DateRangeOperator;
    date: Date;
    dateEnd?: Date;
}

/**
 * React Component Control for selecting a range of dates
 */
export default class DateRange extends React.Component<IDateRangeProps, {}> {
    constructor(props: IDateRangeProps) {
        super(props);

        if(!props.value) {                                                  // If initial value is not set
            props.value = DateRange.emptyValue;                             // Default to empty date range value
        }

        let dateEndClass = props.value.operator === DateRangeOperator.Between ? '' : styles.dateEndHidden;

        this.state = {                                                      // Initialize State Object
            classNameDateEnd: dateEndClass,                                 // Set CSS class for revealing 2nd date control
            value: props.value                                              // Set initial date range value
        } as IDateRangeState;
        
        this._populateOptions();                                            // Populate drop down control
        
    }

    /**
     * Instantiates a new empty value upon get
     */
    public static get emptyValue(): IDateRangeValue {
        return {
            operator: DateRangeOperator.After,
            date: null
        };
    }

    /**
     * State Object
     */
    public state: IDateRangeState;

    /**
     * Dropdown control options for date range operator
     */
    private _options: IDropdownOption[] = [];
    
    /**
     * Datepicker strings
     */
    private dateRangeStrings: IDatePickerStrings = {
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
    
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    
        shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    
        goToToday: 'Go to today',
        prevMonthAriaLabel: 'Go to previous month',
        nextMonthAriaLabel: 'Go to next month',
        prevYearAriaLabel: 'Go to previous year',
        nextYearAriaLabel: 'Go to next year',
    
        isRequiredErrorMessage: 'Field is required.',
    
        invalidInputErrorMessage: 'Invalid date format.',
    
        isOutOfBoundsErrorMessage: 'End range date must be greater than the previous date.'
    };

    /**
     * Webpart render method
     */
    public render(): React.ReactElement<IDateRangeProps> {

        return (
            <div className={styles.dateRange}>
                <Label>{this.props.label}</Label>
                <div className={styles.pickerRow}>
                    <Dropdown
                        options={this._options} 
                        className={styles.dateOperator}
                        onChanged={(e) => this._onOperator_changed(e)}
                        selectedKey={this.state.value.operator}
                    />
                    <DatePicker 
                        placeholder={this.props.label} 
                        value={this.state.value.date}
                        onSelectDate={date => this._onSelectDate(date)} 
                        formatDate={this._onFormatDate}
                        strings={this.dateRangeStrings}
                    />
                    <DatePicker 
                        placeholder={this.props.label}
                        value={this.state.value.dateEnd}
                        onSelectDate={date => this._onSelectDate_end(date)} 
                        formatDate={this._onFormatDate}
                        className={this.state.classNameDateEnd}
                        minDate={this.props.value.date}
                        strings={this.dateRangeStrings}
                        isRequired={this.props.value.date !== null && this.props.value.operator === DateRangeOperator.Between}
                    />
                </div>
            </div>
        );
    }
    
    /**
     * Life cycle event handler
     * @param nextProps new incoming props
     */
    public componentWillReceiveProps(nextProps: IDateRangeProps): void {

        let val = nextProps.value || DateRange.emptyValue;

        this.setState({                                                     // Update state with new properites
            ...this.state,
            value: val
        } as IDateRangeState,
        () => this._onOperator_changed(val.operator));          // Call operator change handler in case new operator was provided
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

    /**
     * Date select event handler
     * @param date 
     */
    protected _onSelectDate(date: Date | null | undefined): void {
        this.setState({                                                     // Record new date in state
            ...this.state,
            value: {
                ...this.state.value,
                date: date
            }
        }, () => this._changed());                                          // Next, Call changed event handler

    }
    
    /**
     * End date select event handler
     * @param date 
     */
    protected _onSelectDate_end(date: Date | null | undefined): void {
        this.setState({                                                     // Record new end date in state
            ...this.state,
            value: {
                ...this.state.value,
                dateEnd: date
            }
        }, () => this._changed());                                          // Next, Call changed event handler
    }
    
    /**
     * 
     * @param optionOrValue 
     */
    protected _onOperator_changed(optionOrValue: DateRangeOperator): void;
    protected _onOperator_changed(optionOrValue: IDropdownOption): void;
    protected _onOperator_changed(optionOrValue: IDropdownOption | DateRangeOperator): void {

        let op: DateRangeOperator;                                          // Operator value
        let className = '';                                                 // CSS Class for end date

        if((optionOrValue as IDropdownOption).data) {                       // If optionOrValue is an IDropdownOption
            op = (optionOrValue as IDropdownOption)
                    .data.value as DateRangeOperator;                       // Get the IDropdownOption's value as the op
        } else {
            op = optionOrValue as DateRangeOperator;                        // Otherwise, optionOrValue is itself the op
        }

        switch(op) {
            case DateRangeOperator.Between:                                 // If Op is between
                className = styles.dateEnd;                                 // Reveal the end date
                break;
            default:
                className = `${styles.dateEnd} ${styles.dateEndHidden}`;    // Otherwise hide the end date
                break;
        }

        this.setState({                                                     // Record operator and CSS class to the state
            ...this.state,
            classNameDateEnd: className,
            value: {
                ...this.state.value,
                operator: op
            }
        }, 
        () => this._changed());                                             // Then, call the changed event handler
    }

    /**
     * Generator options for the date range operator dropdown menu
     */
    protected _populateOptions(): void {
        for (let op in DateRangeOperator) {                                 // Loop through DateRangeOperator values
            this._options.push({                                            // Create a new option for each operator
                text: op,
                key: DateRangeOperator[op],
                data: {
                    value: DateRangeOperator[op]
                },
                selected: (DateRangeOperator[op] ===
                        this.props.value.operator) ? true : undefined       // Mark the correct one as selected
            } as IDropdownOption);
        }
    }
    
    /**
     * Returns a formated date string
     * @param date 
     */
    private _onFormatDate (date: Date): string {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getFullYear() % 100);
    }
}