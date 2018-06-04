import { TextField } from '@microsoft/office-ui-fabric-react-bundle';
import * as React from 'react';
import { ISearchTextFieldProps } from '../helpers/ControlProperties';

export default class extends React.Component<ISearchTextFieldProps, {}> {
    public render(): React.ReactElement<ISearchTextFieldProps> {
        return(
            <TextField placeholder={this.props.placeholder}/>
        );
    }
}