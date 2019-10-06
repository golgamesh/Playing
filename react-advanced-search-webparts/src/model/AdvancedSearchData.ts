import { 
    sp, 
    SearchResults,
    SearchResult, 
    //SearchQueryBuilder,
    SearchQuery 
} from '@pnp/sp';
import { uniq } from '@microsoft/sp-lodash-subset';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import * as Model from './AdvancedSearchModel';
import { SearchQueryBuilder } from "@pnp/polyfill-ie11/dist/searchquerybuilder";

export interface IAdvancedSearchResult extends SearchResult {
    Title: string; 
    Filename: string;
    TitleOrFilename?: string;
    IsListItem: string;
    SPWebUrl: string;
    FileType: string;
    Path: string; 
    OriginalPath: string;
    owsID: string;
    ServerRedirectedURL: string;
    SiteName: string;
    ListID: string;
    ContentTypeId: string;
    ListItemID: string;
    ResultItemType: Model.ResultItemType;
}

export default class AdvancedSearchData {
    constructor(public context: BaseComponentContext, public columns: Array<Model.IResultProperty>) {
        sp.setup({
            spfxContext: context
        });
    }

    public rowLimit: number = 30;
    public page: number;
    public totalRows: number;
    //public resultsConfig: Model.IResultsConfig;
    public currentResults: SearchResults;

    public get customSelectProperties(): Array<string> {
        let props: Array<string> = [];
        
        if(this.columns) {
            this.columns.forEach((prop: Model.IResultProperty) => {
                props.push(prop.fieldName);
            });
        }

        return props;
    }

    public readonly internalSelectProperties: Array<string> = [
        "Title", 
        "Filename",
        "IsDocument",
        "IsContainer",
        "IsListItem",
        "Rank", 
        "SPWebUrl",
        "FileType",
        "Path", 
        "OriginalPath",
        "owsID", 
        "WorkId", 
        "ServerRedirectedURL",
        "ServerRedirectedPreviewURL",
        "ServerRedirectedEmbedURL",
        "SiteName", 
        "ParentLink",
        "ListID",
        "ContentTypeId",
        "ListItemID"
    ];

    public search(queryText: string): Promise<SearchResults> {

        const props = uniq<string>([ 
            ...this.internalSelectProperties, 
            ...this.customSelectProperties 
        ]);

        const queryOptions: SearchQuery = {
            SelectProperties: props,
            RowsPerPage: this.rowLimit,
            RowLimit: this.rowLimit
        };

        const q = SearchQueryBuilder(queryText, queryOptions);

        return sp.search(q).then((r: SearchResults) => {

            this.currentResults = r;                                        // update the current results
            this.page = 1;                                                  // reset if needed
            
            if(r && r.RawSearchResults && r.RawSearchResults.PrimaryQueryResult) {
                this.totalRows = r.TotalRows;
            } else {
                this.totalRows = 0;
            }

            r.PrimarySearchResults.forEach((row: IAdvancedSearchResult) => this._transformResult(row));

            console.log(r);

            return r;

        });
    }

    public next(): Promise<SearchResults> {
        return this.currentResults.getPage(++this.page).then((r: SearchResults) => {
            r.PrimarySearchResults.forEach((row: IAdvancedSearchResult) => this._transformResult(row));
            return  r; 
        });
    }

    public prev(): Promise<SearchResults> {
        return this.currentResults.getPage(--this.page).then((r: SearchResults) => {
            r.PrimarySearchResults.forEach((row: IAdvancedSearchResult) => this._transformResult(row));
            return r;
        });
    }

    public getPage(page: number): Promise<SearchResults> {
        return this.currentResults.getPage(this.page = page).then((r: SearchResults) => {
            r.PrimarySearchResults.forEach((row: IAdvancedSearchResult) => this._transformResult(row));
            return r;
        });
    }

    private _transformResult(item: IAdvancedSearchResult): void {
        item.ResultItemType = this._determineItemType(item);
    }

    private _determineItemType(item: IAdvancedSearchResult): Model.ResultItemType {
        let type = Model.ResultItemType;
        switch(true) {
            case this._isPage(item):
                return type.Page;
            case this._isDocument(item):
                return type.Document;
            case this._isWeb(item):
                return type.Web;
            case this._isOneDrive(item):
                return type.OneDrive;
            case this._isListItem(item):
                return type.ListItem;
            case this._isList(item):
                return type.List;
            case this._isLibrary(item):
                return type.Library;
            default:
                console.log(`Unknown Type: ${item.FileExtension}`);
                console.log(`IsDocument: ${item.IsDocument}`);
                console.log(`FileType: ${item.FileType}`);
                console.log(`IsContainer: ${item.IsContainer}`);
                console.log(`IsListItem: ${item.IsListItem}`);
                console.log(``);
                return type.Unknown;
        }
    }

    private _isDocument(result: IAdvancedSearchResult): boolean {
        return result.IsDocument == "true" as any;
    }

    private _isWeb(result: IAdvancedSearchResult): boolean {
        return  result.IsDocument == "false" as any && 
                result.FileType === "aspx" &&
                result.IsContainer == "true" as any &&
                result.IsListItem === null;
    }

    private _isList(result: IAdvancedSearchResult): boolean {
        return   result.IsDocument == "false" as any &&
                 result.FileType === "html" &&
                 result.IsContainer == "false" as any &&
                 result.IsListItem === null &&
                 this._isListOrLibrary(result) &&
                 result.OriginalPath.match(/.+\/Lists\/[^/]+\/[^/]+.aspx$/i) !== null;
    }

    private _isLibrary(result: IAdvancedSearchResult): boolean {
        return  result.IsDocument == "false" as any &&
                result.FileType === "html" &&
                result.IsContainer == "false" as any &&
                result.IsListItem === null &&  
                this._isListOrLibrary(result) &&
                result.OriginalPath.match(/.+\/Forms\/[^/]+.aspx$/i) !== null;
    }

    private _isListOrLibrary(result: IAdvancedSearchResult): boolean {
        return  result.IsDocument == "false" as any &&
                result.FileType === "html" &&
                result.IsContainer == "false" as any &&
                result.IsListItem === null;                
    }

    private _isListItem(result: IAdvancedSearchResult): boolean {
        return  result.IsDocument == "false" as any &&
                result.FileType === null &&
                result.IsContainer == "false" as any &&
                result.IsListItem == "true";
    }

    private _isPage(result: IAdvancedSearchResult): boolean {
        return (result.FileExtension === "aspx" || 
                result.FileType === "html") &&
                result.IsContainer == "false" as any &&
                result.IsDocument == "false" as any;

    }

    private _isOneDrive(result: IAdvancedSearchResult): boolean {
        return  result.IsDocument == "false" as any &&
                result.FileType === null &&
                result.IsContainer == "true" as any &&
                result.IsListItem === null;
    }

}