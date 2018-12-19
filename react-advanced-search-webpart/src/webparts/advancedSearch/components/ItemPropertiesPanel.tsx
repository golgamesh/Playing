import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import ListFormDialogHeler from '../helpers/ListFormDialogHelper';
import { 
    Panel, 
    PanelType,
    IPanelProps
} from 'office-ui-fabric-react/lib/Panel';
import styles from './ItemPropertiesPanel.module.scss';

export interface IItemPropertiesPanelProps extends IPanelProps {
    SPWebUrlLocal: string;
    SPWebUrl?: string;
    ListID?: string;
    ListItemID?: string;
    ContentTypeId?: string;
    PageType: PageType;
}

export interface IItemPropertiesPanelState {
    isOpen: boolean;
    viewPanelUrl: string;
    loadingPanelHideClass: string;
}

export enum PageType {
    ListView = 0,
    ViewForm = 4,
    EditForm = 6,
    NewForm = 8
}

export default class ItemPropertiesPanel extends React.Component<IItemPropertiesPanelProps> {
    constructor(props: IItemPropertiesPanelProps) {
        super(props);
        this._listenForClosePanelEvent();
        this._closePanelRedirectUrl = `${this.props.SPWebUrlLocal}/siteassets/advanced-search-webpart-close-panel.aspx`;
        this.state = {
            isOpen: this.props.isOpen,
            viewPanelUrl: '',
            loadingPanelHideClass: styles.frmPropsLoading
        };
    }

    public state: IItemPropertiesPanelState;
    private _closePanelRedirectUrl: string;

    public render(): React.ReactElement<IItemPropertiesPanelProps> {
        return (
            <div className={ styles.ItemPropertiesPanel }>
                <Panel {...this.props }
                    isOpen={this.state.isOpen}
                    type={PanelType.medium}
                    isLightDismiss={true}
                    onDismiss={() => this.viewPanel_dismiss()}>
                    <div className={styles.frmPropsAnchor} style={
                        {
                            
                        }}>
                        <div className={this.state.loadingPanelHideClass}>
                            <Spinner size={SpinnerSize.large} />
                        </div>
                        <iframe 
                            src={this.state.viewPanelUrl} 
                            className={`${styles.frmViewPanel} mg-results-form-dialog`}
                            frameBorder={0}
                            onLoad={e => this.panelFrame_load(e)} 
                        />
                    </div>
                </Panel>
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: IItemPropertiesPanelProps): void {
        const newState: IItemPropertiesPanelState = {
            ...this.state,
            viewPanelUrl: this._listFormUrl(nextProps),
            isOpen: nextProps.isOpen
        };

        if(newState.isOpen !== this.state.isOpen === true) {
            newState.loadingPanelHideClass = styles.frmPropsLoading;
        }

        this.setState(newState);
    }

    protected panelFrame_load(e: React.SyntheticEvent<HTMLIFrameElement>): void {
        let frm = e.currentTarget;
        console.log('Frame loaded at: ', frm.src);
        if(this._ensureDialogFriendlyPage(frm)) {
            this._showLoadingPanel(false);
        }
    }

    protected viewPanel_dismiss(): void {
        console.log('Frame state reset');
        /* this._showLoadingPanel(true).then(_ => {
        }); */
        this.props.onDismiss();
    }

    private _listFormUrl(props: IItemPropertiesPanelProps): string {
        let { SPWebUrl, PageType, ListID, ListItemID, ContentTypeId, isOpen } = props;

        if(isOpen) {
            return `${SPWebUrl}/_layouts/15/listform.aspx?PageType=${PageType}&ListID=${ListID}&ID=${ListItemID}&ContentTypeId=${ContentTypeId}&source=${encodeURIComponent(this._closePanelRedirectUrl)}`;
        } else {
            return '';
        }

    }

    private _showLoadingPanel(val: boolean): Promise<void> {
        const newState: IItemPropertiesPanelState = {
            ...this.state,
            loadingPanelHideClass: styles.frmPropsLoading
        };
        if(!val) {
            newState.loadingPanelHideClass = styles.frmPropsLoadingHidden;
        }
        return new Promise((resolve, reject) => {
            this.setState(newState, resolve);
        });
    }

    private _listenForClosePanelEvent(): void {
        window.addEventListener('mg-announce-close-panel', (e: any) => {
            if(e.detail.closePanel) {
                this.viewPanel_dismiss();
            }
        }, false);
    }

    private _ensureDialogFriendlyPage(frame: HTMLIFrameElement): boolean {
        let loc = frame.getAttribute('src');
        if(loc && this._isPageClassic(frame) && loc.toLowerCase().indexOf('&isdlg=1') === -1) {
            frame.setAttribute('src', loc + '&isDlg=1');
            return false;
        } else {
            return true;
        }
    }

    private _isPageClassic(frame: HTMLIFrameElement): boolean {
        const frameDoc = frame.contentDocument;
        return frameDoc.getElementById('s4-workspace') !== null;
    }

}
