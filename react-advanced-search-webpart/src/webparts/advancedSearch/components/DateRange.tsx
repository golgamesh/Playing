import * as React from 'react';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { 
    Dropdown, 
    IDropdown, 
    DropdownMenuItemType, 
    IDropdownOption 
} from 'office-ui-fabric-react/lib/Dropdown';
import styles from './AdvancedSearch.module.scss';

export interface IDateRangeProps {
    value?: IDateRangeValue;
    placeHolder?: string;
    label?: string;
    onChanged?: Function;
}

export interface IDateRangeState {
    classNameDateEnd: string;
    value: IDateRangeValue;
}

export enum DateRangeOperator {
    After = "after",
    Before = "before",
    Between = "between",
    On = "equals"
}

export interface IDateRangeValue {
    operator: DateRangeOperator;
    date: Date;
    dateEnd?: Date;
}

export default class DateRange extends React.Component<IDateRangeProps, {}> {
    constructor(props: IDateRangeProps) {
        super(props);

        if(!props.value) {
            props.value = DateRange.emptyValue;
        }

        this.state = {
            classNameDateEnd: styles.dateEndHidden,
            value: props.value
        } as IDateRangeState;
        
        this._populateOptions();
    /*     
        if(props.value && props.value.operator) {
            this._onOperator_changed(props.value.operator);
        }
 */
        
    }

    
    public static get emptyValue(): IDateRangeValue {
        return {
            operator: DateRangeOperator.After,
            date: null
        };
    }

    public state: IDateRangeState;
    
    public componentWillReceiveProps(nextProps: IDateRangeProps): void {

        let val = nextProps.value;
        if(!val) {
            nextProps.value = DateRange.emptyValue;
        }

        this._onOperator_changed(nextProps.value.operator);

/* 
        this.setState({
            ...this.state,
            value: val
        } as IDateRangeState); */

    }

    private _options: IDropdownOption[] = [];
    
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
    
        isOutOfBoundsErrorMessage: `End range date must be greater than the previous date.`
    };

    public render(): React.ReactElement<IDateRangeProps> {

        return (
            <div className={styles.dateRange}>
                <Dropdown
                    label={this.props.label}
                    options={this._options} 
                    className={styles.dateOperator}
                    onChange={(e) => this._onOperator_change(e)}
                    onChanged={(e) => this._onOperator_changed(e)}
                    selectedKey={DateRangeOperator[this.props.value.operator]}
                />

                <DatePicker 
                    label={this.props.label}
                    placeholder={this.props.label} 
                    value={this.state.value.date}
                    onSelectDate={date => this._onSelectDate(date)} 
                    formatDate={this._onFormatDate}
                    strings={this.dateRangeStrings}
                />

                <DatePicker 
                    label={this.props.label}
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
        );
    }

    protected _changed() {
        let value = this.state.value;
        console.log(value);
        if(this.props.onChanged) {
            this.props.onChanged(value);
        }
    }

    protected _onSelectDate(date: Date | null | undefined): void {
        console.log('start', date);
        this.setState({
            ...this.state,
            value: {
                ...this.state.value,
                date: date
            }
        }, () => this._changed());

/*         let val = {
            ...this.props.value,
            date: date
        } as IDateRangeValue; */

        //this._changed(this.state.value);
    }
    
    protected _onSelectDate_end(date: Date | null | undefined): void {
        console.log('end', date);
        this.setState({
            ...this.state,
            value: {
                ...this.state.value,
                dateEnd: date
            }
        }, () => this._changed());

/*         let val = {
            ...this.props.value,
            dateEnd: date
        } as IDateRangeValue; */

        //this._changed(this.state.value);
    }

    protected _onOperator_change(e: React.FormEvent<HTMLDivElement>): void {
        console.log('formelement: ', e);
    }

    protected _onOperator_changed(optionOrValue: string): void;
    protected _onOperator_changed(optionOrValue: IDropdownOption): void;
    protected _onOperator_changed(optionOrValue: IDropdownOption | string): void {

        let op = '';
        let className = '';

        if((optionOrValue as IDropdownOption).data) {
            op = (optionOrValue as IDropdownOption).data.value;
        }

        switch(op) {
            case DateRangeOperator.Between:
                className = styles.dateEnd;
                break;
            default:
                className = `${styles.dateEndHidden} ${styles.dateEndHidden}`;
                break;
        }

        let val = {
            ...this.state.value,
            operator: op
        } as IDateRangeValue;
        
        let newState = {
            ...this.state,
            classNameDateEnd: className,
            value: val
        };

        this.setState(newState, 
            () => this._changed());
        

        //this._changed(this.state.value);
    }

    protected _populateOptions(): void {
        for (let op in DateRangeOperator) {
            console.log( op );
            this._options.push({
                text: op,
                key: DateRangeOperator[op],
                data: {
                    value: DateRangeOperator[op]
                },
                selected: (DateRangeOperator[op] == this.props.value.operator) ? true : undefined
            } as IDropdownOption);
        }

        console.log(this._options);
    }
    
    private _onFormatDate (date: Date): string {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getFullYear() % 100);
    }
}