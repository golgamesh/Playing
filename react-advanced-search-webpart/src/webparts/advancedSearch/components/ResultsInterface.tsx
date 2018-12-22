import * as React from 'react';
import styles from './AdvancedSearch.module.scss';
import {
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    SelectionMode,
    IColumn,
    IObjectWithKey
} from 'office-ui-fabric-react/lib/DetailsList';
import { 
    CommandBar, 
    ICommandBarProps,
    ICommandBarItemProps 
} from 'office-ui-fabric-react/lib/CommandBar';
import * as Model from '../model/AdvancedSearchModel';
import Pagination from 'office-ui-fabric-react-pagination';
import AdvancedSearchData, {
    IAdvancedSearchResult
} from '../model/AdvancedSearchData';
import DebugPanel from './DebugPanel';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SearchResults, SearchResult } from '@pnp/sp';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { getFileTypeIconProps, initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { uniq } from '@microsoft/sp-lodash-subset';
import { ThemeSettingName } from '@uifabric/styling/lib';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import ItemPropertiesPanel, {
    PageType
} from './ItemPropertiesPanel';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

export interface IResultsInterfaceProps {
    isDebug: boolean;
    config: Model.IResultsConfig;
    searchQuery: string;
    context: WebPartContext;
    rowLimit: number;
}

export interface IResultInterfaceState {
    config: Model.IResultsConfig;
    items: ICommandBarItemProps[];
    overflowItems: ICommandBarItemProps[];
    faritems: ICommandBarItemProps[];
    searchQuery: string;
    results: SearchResult[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
    columns: Model.IResultProperty[];
    spWebUrl: string;
    listID: string;
    listItemID: string;
    contentTypeId: string;
    itemPropPanelOpen: boolean;
    documentReaderOpen: boolean;
    documentReaderUrl: string;
}

const ColumnDefaults: any = {
    
};

const defaultColumns: Model.IResultProperty[] = [{
    key: 'column1',
    name: 'File Type',
    sortable: false,
    type: Model.ResultPropertyValueType.String,
    headerClassName: 'DetailsListExample-header--FileIcon',
    className: 'DetailsListExample-cell--FileIcon',
    iconClassName: 'DetailsListExample-Header-FileTypeIcon',
    iconName: 'Page',
    isIconOnly: true,
    fieldName: 'FileType',
    minWidth: 20,
    //maxWidth: 16,
    onColumnClick: this._onColumnClick,
    onRender: (item: IAdvancedSearchResult) => {
      return <Icon {...getFileTypeIconProps({extension: item.FileType, size: 20})} />;
    }
  }
];

export default class ResultsInterface extends React.Component<IResultsInterfaceProps> {
    constructor(props: IResultsInterfaceProps) {
        super(props);
        
        this.searchData = new AdvancedSearchData(props.context, props.config);
        this.searchData.rowLimit = props.rowLimit;
        initializeFileTypeIcons();
        //this._closePanelRedirectUrl = `${this.props.context.pageContext.web.absoluteUrl}/siteassets/advanced-search-webpart-close-panel.aspx`;
        let cols = uniq<Model.IResultProperty>([
            ...defaultColumns, 
            ...props.config.columns
        ]);

        console.log(cols);

        this.state = { 
            config: props.config,
            items:[],
            overflowItems:[],
            faritems:[],
            searchQuery: props.searchQuery,
            results: [],
            currentPage:0,
            totalPages:0,
            totalResults:0,
            columns: cols,
            spWebUrl: '',
            listID: '',
            listItemID: '',
            contentTypeId: '',
            itemPropPanelOpen: false,
            documentReaderOpen: false,
            documentReaderUrl: ''
        };

        this._selection = new Selection({
            onSelectionChanged: () => {
                let selected: IAdvancedSearchResult = this._getSelectionDetails();
                let items = this.commandbarButtons(selected);
                let overflowItems = this.commandbarOverflowButtons(selected);
                console.log(selected);
                this.setState({
                    ...this.state,
                    items,
                    overflowItems,
                    isOpen: false
                });
            }
          });

    }

    public searchData: AdvancedSearchData;
    public state: IResultInterfaceState;
    private _selection: Selection;
    //private _closePanelRedirectUrl: string;

    public componentWillReceiveProps(nextProps: IResultsInterfaceProps): void {

        this.searchData.search(nextProps.searchQuery).then((res: SearchResults) => {

            let totalPages = 0;
            let currentPage = 0;
            let totalRows = 0;
            let results: SearchResult[] = [];
            
            if( res && 
                res.RawSearchResults && 
                res.RawSearchResults.PrimaryQueryResult && 
                res.TotalRows !== 0) {
                    totalRows = res.TotalRows; 
                    totalPages = Math.ceil(res.TotalRows / this.props.rowLimit);
                    results = res.PrimarySearchResults;
            }

            console.log('totalrows: ', totalRows);
            console.log('rowlimit: ', this.props.rowLimit);
            console.log('currpage: ', this.searchData.page);
            console.log('totpages: ', totalPages);
            console.log('assets: ', this.props.context.manifest.loaderConfig.internalModuleBaseUrls);

            if(totalRows > 0) {

                //let colTypes: Model.IResultPropertyDef[] = res.RawSearchResults.Properties as any;
                let colTypes: Model.IResultPropertyDef[] = res.RawSearchResults.PrimaryQueryResult.RelevantResults.Table.Rows[0].Cells as any;

                this._applyLastSecondColumnConfig(colTypes);

                currentPage = 1;

            }

            this.setState({
                ...this.state,
                config: nextProps.config,
                searchQuery: nextProps.searchQuery,
                results: results,
                currentPage: currentPage,
                totalPages: totalPages,
                totalResults: totalRows,
                faritems: [this.resultCountLabel(totalRows)]
            } as IResultInterfaceState);

        });
    }

    public render(): React.ReactElement<IResultsInterfaceProps> {
        return(
            <div className={styles.results}>
                <CommandBar 
                    items={this.state.items}
                    overflowItems={this.state.overflowItems} 
                    farItems={this.state.faritems}
                />

                <DetailsList
                    items={this.state.results}
                    compact={false}
                    columns={this.state.columns}
                    selectionMode={SelectionMode.single}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    isHeaderVisible={true}
                    selection={this._selection}
                    selectionPreservedOnEmptyClick={true}
                    //onItemInvoked={this._onItemInvoked}
                    enterModalSelectionOnTouch={true}
                />

                <div>
                    Your search returned zero matches.
                </div>

                <Pagination
                    currentPage={this.state.currentPage}
                    totalPages={this.state.totalPages}
                    boundaryPagesRange={0}
                    onChange={(page) => this.pagination_click(page)}
                />

                <DebugPanel 
                    searchQuery={this.state.searchQuery} 
                    isDebug={this.props.isDebug} 
                />

                <ItemPropertiesPanel
                    PageType={PageType.EditForm}
                    SPWebUrl={this.state.spWebUrl}
                    ListID={this.state.listID}
                    ListItemID={this.state.listItemID}
                    ContentTypeId={this.state.contentTypeId}
                    SPWebUrlLocal={this.props.context.pageContext.web.absoluteUrl}                    
                    isOpen={this.state.itemPropPanelOpen}
                    onDismiss={() => this.itemPropertiesPanel_dismiss()}
                    type={PanelType.medium}
                    isLightDismiss={true}>
                </ItemPropertiesPanel>

                <Panel 
                    type={PanelType.smallFluid}
                    isOpen={this.state.documentReaderOpen}
                    onDismiss={() => this.documentReaderPanel_dismiss()}>
                    <div>
                        <iframe
                            className={styles.frmDocumentReader} 
                            src={this.state.documentReaderUrl} 
                            frameBorder={0}></iframe>
                    </div>
                </Panel>
            </div>
        );
    }

    protected documentReaderPanel_dismiss(): void {
        let newState: IResultInterfaceState = {
            ...this.state,
            documentReaderOpen: false
        };

        this.setState(newState);
    }

    protected itemPropertiesPanel_dismiss(): void {
        let newState: IResultInterfaceState = {
            ...this.state,
            itemPropPanelOpen: false,
            spWebUrl: '',
            listID: '',
            listItemID: '',
            contentTypeId: ''
        };

        console.log('Frame state reset');

        this.setState(newState);
    }

    protected pagination_click(page: number): void {

        if(page < 1 || page > this.state.totalPages) { return; }

        this.searchData.getPage(page - 1).then((res: SearchResults) => {

            this.setState({
                ...this.state,
                results: res.PrimarySearchResults,
                currentPage: this.searchData.page + 1
            });
        });
    }

    protected btnCommandbar_click(e: React.MouseEvent<HTMLElement>, btn: ICommandBarItemProps): void {
        let action: string = btn.key;
        let selected: IAdvancedSearchResult = this._getSelectionDetails();
        let newState = {
            ...this.state
        } as IResultInterfaceState;

        switch(action) {
            case 'view':
                console.log(action, selected);
                newState.documentReaderOpen = true;
                newState.documentReaderUrl = selected.ServerRedirectedEmbedURL;
                break;
            case 'go':
                window.open(selected.OriginalPath);
                break;
            case 'opencontainer':
                window.open(selected.ParentLink);
                break;
            case 'viewproperties':
                //const url = `${selected.SPWebUrl}/_layouts/15/listform.aspx?PageType=${PageType.EditForm}&ListID=${selected.ListID}&ID=${selected.ListItemID}&ContentTypeId=${selected.ContentTypeId}&source=${encodeURIComponent(this._closePanelRedirectUrl)}`;
                //console.log(url);
                newState.itemPropPanelOpen = true;
                newState.spWebUrl = selected.SPWebUrl;
                newState.listID = selected.ListID;
                newState.listItemID = selected.ListItemID;
                newState.contentTypeId = selected.ContentTypeId;
                //window.open(url);
                break;
            case 'clientopen':
                break;
            case 'download':
                break;
            default:
                break;

        }

        this.setState(newState);
    }


    protected handleFrameEvents(): void {
        //this._dialogHelper.activateCancelButtons();
    }


    private _applyLastSecondColumnConfig(colTypes: Model.IResultPropertyDef[]): void {
        var columns = [
            ...this.state.columns
        ];

        columns.forEach((col, idx, cols) => {
            if(!col.type) {
                let colType = colTypes.filter((type) => {    
                    return type.Key === col.fieldName; 
                });
                if(colType.length === 0) { return; }
                col.type = colType[0].ValueType;
                cols[idx] = this._applyResultPropertyDefaults(col);
            }
        });

        this.setState({
            ...this.state,
            columns: columns
        });
    }

    private _applyResultPropertyDefaults(colConfig: Model.IResultProperty): Model.IResultProperty {
        let typeDefaults: any = {};

        switch(colConfig.type) {
            case Model.ResultPropertyValueType.DateTime:
                typeDefaults = {
                    onRender: (item: IAdvancedSearchResult) => {
                      return this._formatDate(item[colConfig.fieldName] as string);
                    }
                };
                break;
            case Model.ResultPropertyValueType.Boolean:
                typeDefaults = {
                    onRender: (item: IAdvancedSearchResult) => {
                        return this._formatBool(item[colConfig.fieldName] as string);
                    }
                };
                break;
        }

        return {
            ...ColumnDefaults,
            ...typeDefaults,
            ...colConfig
        } as Model.IResultProperty;
    }


    private _formatDate (isoDate: string): string {
        return (new Date(isoDate)).toLocaleDateString();
    }

    private _formatBool (bool: string): string {
        if(bool === 'true'){
            return 'Yes';
        }
        else {
            return 'No';
        }
    }

    private _getSelectionDetails(): IAdvancedSearchResult {
        
        const selectionCount = this._selection.getSelectedCount();
    
        switch (selectionCount) {
          case 1:
            return this._selection.getSelection()[0] as IAdvancedSearchResult;
          default:
          return null;
        }
    }

    private commandbarButtons(result: IAdvancedSearchResult): ICommandBarItemProps[] {
        let items: ICommandBarItemProps[] = [];

        if(!result) { return items; }

        if(this._isPage(result)) {
            items.push({
                key: 'go',
                name: 'Go',
                iconProps: {
                    iconName: 'Generate'
                },
                onClick: (e, btn) => this.btnCommandbar_click(e, btn)
            });
        } else if(result.IsDocument == "true" as any) {
            items.push({
                key: 'view',
                name: 'View Document',
                iconProps: {
                    iconName: 'View'
                },
                onClick: (e, btn) => this.btnCommandbar_click(e, btn)
            });
        }

        if(result.ListID && result.SPWebUrl && result.ListItemID) {
            items.push({
                key: 'viewproperties',
                name: 'Properties',
                iconProps: {
                    iconName: 'CustomList'
                },
                onClick: (e, btn) => this.btnCommandbar_click(e, btn)
            });
        }

        if(result.ParentLink) {
            items.push({
                key: 'opencontainer',
                name: 'Open Container',
                iconProps: {
                    iconName: 'FolderOpen'
                },
                onClick: (e, btn) => this.btnCommandbar_click(e, btn)
            });
        }
        
        return items;
    }

    private commandbarOverflowButtons(result: IAdvancedSearchResult): ICommandBarItemProps[] {
        let items: ICommandBarItemProps[] = [];
        
        if(!result) { return items; }

        if(result.IsDocument == "true" as any) {
            
            items.push({
                key: 'clientopen',
                name: 'Open in Client',
                iconProps: {
                    iconName: 'DocumentReply'
                },
                onClick: (e, btn) => this.btnCommandbar_click(e, btn)
            });

            items.push({
                key: 'download',
                name: 'Download',
                iconProps: {
                    iconName: 'Download'
                },
                onClick: (e, btn) => this.btnCommandbar_click(e, btn)
            });
        }

        return items;

    }

    private _isWeb(result: IAdvancedSearchResult): boolean {
        return  result.IsDocument == "false" as any && 
                result.FileType === "aspx" &&
                result.IsContainer == "true" as any &&
                result.IsListItem === null;
    }

    private _isListOrLibrary(result: IAdvancedSearchResult): boolean {
        return  result.IsDocument == "false" as any &&
                result.FileType === "html" &&
                result.IsContainer == "false" as any &&
                result.IsListItem === null;
    }

    private _isPage(result: IAdvancedSearchResult): boolean {
        return  result.FileExtension === "aspx" || 
                result.FileType === "html";
    }

    private resultCountLabel(resultCount: number): ICommandBarItemProps {
        
        return {
            key: 'matches',
            name: `Matches: ${resultCount}`,
            className: `${styles["commandbar-label-item"]}`,
            disabled: true
        } as ICommandBarItemProps;

    }

}