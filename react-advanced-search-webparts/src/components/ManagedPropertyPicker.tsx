import * as React from 'react';
import * as AutoComplete from 'React-AutoComplete';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import SearchSchemaHelper from '../helpers/SearchSchemaHelper';

export interface IManagedPropertyPickerProps extends AutoComplete.Props {
    context: WebPartContext;
    value: string;
    onChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IManagedPropertyPickerState {
    items: Array<string>;
}

export default class ManagedPropertyPicker extends React.Component<IManagedPropertyPickerProps, IManagedPropertyPickerState> {
    constructor(props) {
        super(props);

        this.schema = new SearchSchemaHelper(
            document.location.origin,
            this.props.context.pageContext.web.serverRelativeUrl, 
            this.props.context.spHttpClient);

        this.state = {
            items: []
        };

    }

    public schema: SearchSchemaHelper;
    public state: IManagedPropertyPickerState;

    /**
     * React component's render method
     */
    public render(): React.ReactElement<IManagedPropertyPickerProps> {
        return(
            <AutoComplete 
                { ...this.props }
                getItemValue={(item) => item}
                items={this.state.items}
                onChange={this.onChange}
                selectOnBlur={true}
                renderItem={(item, isHighlighted) =>
                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                      {item}
                    </div>
                  }
            />
        );
    }

    protected onSelect = (val: string): void => {
        
        if(typeof this.props.onChanged == 'function') {
            this.props.onChanged.call(null, val);
        }

    }

    protected onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log('onChange');
        let key = e.target.value;
        this.fetchMatchingManagedProperties(key).then(items => {
            this.setState({
                ...this.state,
                items: items
            });
        });
        if(typeof this.props.onChanged == 'function') {
            this.props.onChanged.call(null, e);
        }
    }

    private fetchMatchingManagedProperties(key: string): Promise<Array<any>> {
        return this.schema.fetchManagedPropertyMatches(key).then(managedProps => {
            let options = managedProps.map(mp => {
                return mp.RefinementName;
            });
            return options;
        });
    }
}