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
    
}

export interface IDateRangeState {
    classNameDateEnd: string;
}

export enum DateRangeOperator {
    After = "after",
    Before = "before",
    Between = "between",
    On = "on"
}

export interface DateRangeValue {
    operator: DateRangeOperator;
    date: Date;
    dateEnd: Date;
}

export default class DateRange extends React.Component<IDateRangeProps, {}> {
    constructor(props) {
        super(props);

        this._populateOptions();

        this.state = {
            classNameDateEnd: styles.dateEndHidden
        } as IDateRangeState;
        
    }

    public state: IDateRangeState;

    private _options: IDropdownOption[] = [
        {
            key: 0,
            text: 'After',
            data: {
                value: 'after'
            }
        }
    ]

    public render(): React.ReactElement<IDateRangeProps> {

        return (
            <div className={styles.dateRange}>
                <Dropdown
                    options={this._options} 
                    className={styles.dateOperator}
                    onChanged={(e) => this._onOperator_changed(e)}
                />

                <DatePicker 
                    placeholder="Date" 
                    onSelectDate={this._onSelectDate} 
                    formatDate={this._onFormatDate}
                />

                <DatePicker 
                    placeholder="Date" 
                    onSelectDate={this._onSelectDate_end} 
                    formatDate={this._onFormatDate}
                    className={this.state.classNameDateEnd}
                />
            </div>
        );
    }

    protected _onSelectDate(date: Date | null | undefined): void {
        console.log('start', date)
    }
    
    protected _onSelectDate_end(date: Date | null | undefined): void {
        console.log('end', date)
    }

    protected _onOperator_changed(e: IDropdownOption): void {
    
        console.log(e);
        let className = '';
        switch(e.data.value) {
            case DateRangeOperator.Between:
                break;
            default:
                className = styles.dateEndHidden;
                break;
        }

        this.setState({
            ...this.state,
            classNameDateEnd: className
        } as IDateRangeState);

    }

    protected _populateOptions(): void {
        
        for (let op in DateRangeOperator) {
            console.log( op );
            this._options.push({
                text: op,
                data: {
                    value: DateRangeOperator[op]
                }
            } as IDropdownOption);
        }

        console.log(this._options);
    }
    
    private _onFormatDate = (date: Date): string => {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getFullYear() % 100);
    };
}