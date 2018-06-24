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
    value?: IDateRangeValue
}

export interface IDateRangeState {
    classNameDateEnd: string;
    value: IDateRangeValue;
}

export enum DateRangeOperator {
    After = "after",
    Before = "before",
    Between = "between",
    On = "on"
}

export interface IDateRangeValue {
    operator: DateRangeOperator;
    date: Date;
    dateEnd?: Date;
}

export default class DateRange extends React.Component<IDateRangeProps, {}> {
    constructor(props: IDateRangeProps) {
        super(props);


        this.state = {
            classNameDateEnd: styles.dateEndHidden,
            value: props.value
        } as IDateRangeState;
        
        if(props.value && props.value.operator) {
            this._onOperator_changed(props.value.operator);
        }

        this._populateOptions();
        
    }

    public state: IDateRangeState;

    public get value(): IDateRangeValue {
        return this.state.value;
    }

    public set value(value: IDateRangeValue) {
        this.setState({
            ...this.state,
            value: value
        } as IDateRangeState);
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

        DatePicker.defaultProps
        console.log('date: ', this.state.value.date);
        console.log('op: ', this.state.value.operator);

        return (
            <div className={styles.dateRange}>
                <Dropdown
                    options={this._options} 
                    className={styles.dateOperator}
                    onChanged={(e) => this._onOperator_changed(e)}
                />

                <DatePicker 
                    placeholder="Date" 
                    value={this.state.value.date}
                    onSelectDate={date => this._onSelectDate(date)} 
                    formatDate={this._onFormatDate}
                    strings={this.dateRangeStrings}
                />

                <DatePicker 
                    placeholder="Date" 
                    value={this.state.value.dateEnd}
                    onSelectDate={date => this._onSelectDate_end(date)} 
                    formatDate={this._onFormatDate}
                    className={this.state.classNameDateEnd}
                    minDate={this.state.value.date}
                    strings={this.dateRangeStrings}
                    isRequired={this.state.value.date !== null && this.state.value.operator === DateRangeOperator.Between}
                />
            </div>
        );
    }

    protected _onSelectDate(date: Date | null | undefined): void {
        console.log('start', date);
        this.setState({
            ...this.state,
            value: {
                ...this.state.value,
                date: date
            }
        });
    }
    
    protected _onSelectDate_end(date: Date | null | undefined): void {
        console.log('end', date);
        this.setState({
            ...this.state,
            value: {
                ...this.state.value,
                dateEnd: date
            }
        });
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

        this.setState({
            ...this.state,
            classNameDateEnd: className,
            value: {
                ...this.state.value,
                operator: op
            }
        } as IDateRangeState);

    }

    protected _populateOptions(): void {
        for (let op in DateRangeOperator) {
            console.log( op );
            this._options.push({
                text: op,
                data: {
                    value: DateRangeOperator[op]
                },
                selected: (DateRangeOperator[op] == this.state.value.operator) ? true : undefined
            } as IDropdownOption);
        }

        console.log(this._options);
    }
    
    private _onFormatDate = (date: Date): string => {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getFullYear() % 100);
    };
}