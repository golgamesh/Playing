import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import ListFormDialogHeler from '../helpers/ListFormDialogHelper';
import { 
    Panel, 
    PanelType,
    IPanelProps
} from 'office-ui-fabric-react/lib/Panel';

export interface IItemPropertiesPanelProps extends IPanelProps {
    SPWebUrlLocal: string;
    SPWebUrl: string;
    ListID: string;
    ListItemID: number;
    ContentTypeId: string;
}


export interface IItemPropertiesPanelState {

}

export default class ItemPropertiesPanel extends React.Component<IItemPropertiesPanelProps> {
    constructor(props: IItemPropertiesPanelProps) {
        super(props);

    }

    public render(): React.ReactElement<IItemPropertiesPanelProps> {
        return (
            <div>

            </div>
        );
    }

    public componentWillReceiveProps(nextProps: IItemPropertiesPanelProps): void {

    }
}
