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
    IsListItem: string;
    SPWebURL: string;
    FileType: string;
    Path: string; 
    OriginalPath: string;
    owsID: string;
    ServerRedirectedURL: string;
    SiteName: string;
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
        "SPWebURL",
        "FileType",
        "Path", 
        "OriginalPath",
        "owsID", 
        "WorkId", 
        "ServerRedirectedURL",
        "SiteName", 
        "ParentLink"
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
            
            this.currentResults = r;    // update the current results
            this.page = 0;              // reset if needed
            this.totalRows = r.TotalRows;
/* 
            if(this.totalRows === 0) {
                this.page = 0;
            } */

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