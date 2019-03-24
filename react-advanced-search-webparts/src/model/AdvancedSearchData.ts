import { 
    sp, 
    SearchResults,
    SearchResult, 
    SearchQueryBuilder,
    SearchQuery 
} from '@pnp/sp';
import { uniq } from '@microsoft/sp-lodash-subset';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import * as Model from './AdvancedSearchModel';


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
}

export default class AdvancedSearchData {
    constructor(context: BaseComponentContext, resultsConfig: Model.IResultsConfig) {
        this.context = context;
        this.resultsConfig = resultsConfig;
        sp.setup({
            spfxContext: context
        });
    }

    public rowLimit: number = 10;
    public page: number;
    public totalRows: number;
    public resultsConfig: Model.IResultsConfig;
    public context: BaseComponentContext;
    public currentResults: SearchResults;

    public get customSelectProperties(): Array<string> {
        let props: Array<string> = [];
        
        this.resultsConfig.columns.forEach((prop: Model.IResultProperty) => {
            props.push(prop.fieldName);
        });

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

        const queryOptions: SearchQuery  = {
            SelectProperties: props,
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

            console.log(r);

            return r;

        });
    }

    public next(): Promise<SearchResults> {
        return this.currentResults.getPage(++this.page).then((r: SearchResults) => {
            return  r; 
        });
    }

    public prev(): Promise<SearchResults> {
        return this.currentResults.getPage(--this.page).then((r: SearchResults) => {
            return r;
        });
    }

    public getPage(page: number): Promise<SearchResults> {
        return this.currentResults.getPage(this.page = page).then((r: SearchResults) => {
            return r;
        });
    }



}