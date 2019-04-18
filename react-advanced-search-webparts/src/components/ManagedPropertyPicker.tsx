import * as React from 'react';
import { ComboBox, Fabric, IComboBoxProps, IComboBoxOption, mergeStyles, SelectableOptionMenuItemType, Toggle, IComboBox } from 'office-ui-fabric-react/lib/index';
import SearchSchemaHelper from '../helpers/SearchSchemaHelper';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IManagedPropertyPickerProps extends IComboBoxProps {
    context: WebPartContext;
}


export interface IManagedPropertyPickerState {
    options: Array<IComboBoxOption>;
}

export default class ManagedPropertyPicker extends React.Component<IManagedPropertyPickerProps, IManagedPropertyPickerState> {

    constructor(props: IManagedPropertyPickerProps) {
        super(props);

        this.schema = new SearchSchemaHelper(
            document.location.origin,
            this.props.context.pageContext.web.serverRelativeUrl, 
            this.props.context.spHttpClient);

        this.state = {
            options: this.props.options
        };
    }

    public state: IManagedPropertyPickerState;

    public schema: SearchSchemaHelper;

    /**
     * React component's render method
     */
    public render(): React.ReactElement<IManagedPropertyPickerProps> {
        return(
            <ComboBox {...this.props } 
                onKeyUp={this.combobox_keyup} 
                options={this.state.options}
            />
        );
    }

    protected combobox_keyup = (e: React.KeyboardEvent<IComboBox>): void => {
        let val = (e.target as HTMLInputElement).value;
        console.log(val);

        this.fetchMatchingManagedProperties(val).then((options: Array<IComboBoxOption>) => {
            this.setState({
                ...this.state,
                options: options
            });
        });
    }

    private fetchMatchingManagedProperties(key: string): Promise<Array<any>> {
        return this.schema.fetchManagedPropertyMatches(key).then(managedProps => {
            let options = managedProps.map(mp => {
                return {
                    text: mp.RefinementName,
                    key: mp.RefinementToken
                } as IComboBoxOption;
            });
            return options;
        });
    }

}