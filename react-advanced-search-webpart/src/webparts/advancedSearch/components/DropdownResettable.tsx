import * as React from 'react';
import { 
    Dropdown, 
    IDropdown, 
    DropdownMenuItemType, 
    IDropdownOption, 
    IDropdownProps
} from 'office-ui-fabric-react/lib/Dropdown';

export interface IDropdownResettableProps extends IDropdownProps {
    options: Array<IDropdownResettableOption>
}

export interface IDropdownResettableState {
    options: Array<IDropdownResettableOption>
    ,selectedKey?: number | string;
}

export interface IDropdownResettableOption extends IDropdownOption {
    value?: number | string;
}

export default class DropdownResettable extends React.Component<IDropdownResettableProps, {}> {
    constructor(props: IDropdownResettableProps) {
        super(props);

        this.state = {
            options: [...props.options],
            selectedKey: props.selectedKey
        };

        //this.options = [...props.options];
        //this.selectedKey = props.selectedKey;

    }

    public options: IDropdownResettableOption[];
    public selectedKey?: number | string;
    public state: IDropdownResettableState;

    public render(): React.ReactElement<IDropdownResettableProps> {
        return(
            <Dropdown {...this.props } 
                onChanged={(o, i) => this.ctrl_changed(o, i)} 
                options={this.state.options} 
                selectedKey={this.state.selectedKey}
            />
        );
    }

    public componentWillReceiveProps(nextProps: IDropdownResettableProps): void {
        if(this.state.selectedKey === nextProps.selectedKey) {
            return;
        }
        this.setState({
            selectedKey: nextProps.selectedKey
        } as IDropdownResettableState);
    }

    /* 
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
    } */
    
    protected ctrl_changed(selectedOption: IDropdownResettableOption, index: number): void {
        console.log(selectedOption, index);
        let newOptions = this._includeResetDropdownChoice(selectedOption.value !== null);

        this.setState({
            ...this.state,
            options: newOptions
        });

        if(this.props.onChanged) {
            this.props.onChanged(selectedOption);
        }

    }
    
    private _includeResetDropdownChoice(include: boolean): Array<IDropdownResettableOption> {

        let choices = [...this.state.options] as Array<IDropdownResettableOption>;

        if(include) {
            if(!this._hasDropdownResetChoice()) {
                const resetChoice: IDropdownResettableOption = {
                    key: `field-reset`,
                    text: '',
                    value: null
                };
                choices.unshift(resetChoice);
            }
        } else {
            if(this._hasDropdownResetChoice()) {
                choices.shift();
            }
        }

        return choices;
    }

    private _hasDropdownResetChoice(): boolean {
        return this._hasChoices() && 
            (this.state.options[0] as IDropdownResettableOption).value === null;
    }

    private _hasChoices(): boolean {
        return this.state.options && this.state.options.length > 0;
    } 

}