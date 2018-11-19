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
import { 
    Panel, 
    PanelType 
} from 'office-ui-fabric-react/lib/Panel';
import * as Model from '../model/AdvancedSearchModel';
import Pagination from 'office-ui-fabric-react-pagination';
import AdvancedSearchData, {
    IAdvancedSearchResult
} from '../model/AdvandSearchData';
import DebugPanel from './DebugPanel';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SearchResults, SearchResult } from '@pnp/sp';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { getFileTypeIconProps, initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { uniq } from '@microsoft/sp-lodash-subset';

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
    viewPanelOpen: boolean;
    viewPanelUrl: string;
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
            viewPanelOpen: false,
            viewPanelUrl: ""
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
                    overflowItems
                });
            }
          });

    }

    public searchData: AdvancedSearchData;
    public state: IResultInterfaceState;
    private _selection: Selection;

    public componentWillReceiveProps(nextProps: IResultsInterfaceProps): void {

        this.searchData.search(nextProps.searchQuery).then((res: SearchResults) => {
            let totalPages = 0;
            let currentPage = 0;
            
            if(res.TotalRows !== 0) {
                totalPages = Math.ceil(res.TotalRows / this.props.rowLimit);
            }
            console.log('totalrows: ', res.TotalRows);
            console.log('rowlimit: ', this.props.rowLimit);
            console.log('currpage: ', this.searchData.page);
            console.log('totpages: ', totalPages);

            if(res.RowCount > 0) {

                //let colTypes: Model.IResultPropertyDef[] = res.RawSearchResults.Properties as any;
                let colTypes: Model.IResultPropertyDef[] = res.RawSearchResults.PrimaryQueryResult.RelevantResults.Table.Rows[0].Cells as any;

                this._applyLastSecondColumnConfig(colTypes);

                currentPage = 1;

            }
            this.setState({
                ...this.state,
                config: nextProps.config,
                searchQuery: nextProps.searchQuery,
                results: res.PrimarySearchResults,
                currentPage: currentPage,
                totalPages: totalPages,
                totalResults: this.searchData.totalRows,
                faritems: [this.resultCountLabel(this.searchData.totalRows)]
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

                <Panel 
                    isOpen={this.state.viewPanelOpen}
                    type={PanelType.smallFluid}
                    onDismiss={() => this.viewPanel_dismiss()}
                    headerText="Header">
                    <div style={
                        {
                            border: "1px solid blue"
                        }}>
                        <iframe 
                            src={this.state.viewPanelUrl} 
                            className={styles.frmViewPanel} 
                            frameBorder={0}
                        />
                    </div>

                </Panel>
            </div>
        );
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
                newState.viewPanelOpen = true;
                newState.viewPanelUrl = selected.ServerRedirectedEmbedURL;
                break;
            case 'opencontainer':
                window.open(selected.ParentLink);
                break;
            case 'viewproperties':
                window.open(selected.Path);
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

    protected viewPanel_dismiss(): void {
        let newState = {
            ...this.state,
            viewPanelOpen: false
        } as IResultInterfaceState;

        this.setState(newState);
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

        if(result.IsDocument == "true" as any) {
            items.push({
                key: 'view',
                name: 'View Document',
                iconProps: {
                    iconName: 'View'
                },
                onClick: (e, btn) => this.btnCommandbar_click(e, btn)
            });
        }

        if(result.IsListItem == "true" as any) {
            items.push({
                key: 'viewproperties',
                name: 'View Properties',
                iconProps: {
                    iconName: 'View' 
                },
                onClick: (e, btn) => this.btnCommandbar_click(e, btn)
            });
        }

        items.push({
            key: 'opencontainer',
            name: 'Open Container',
            iconProps: {
                iconName: 'FolderOpen'
            },
            onClick: (e, btn) => this.btnCommandbar_click(e, btn)
        });
        
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

    private resultCountLabel(resultCount: number): ICommandBarItemProps {
        
        return {
            key: 'matches',
            name: `Matches: ${resultCount}`,
            className: `${styles["commandbar-label-item"]}`,
            disabled: true
        } as ICommandBarItemProps;

    }

}