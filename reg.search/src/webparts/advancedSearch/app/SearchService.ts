import { 
    sp, 
    SearchQuery, 
    SearchQueryBuilder, 
    SearchResults, 
    SearchResult 
} from '@pnp/sp';
import { 
    FilterData, 
    FilterControl, 
    FilterOperator, 
    AdvancedSearchOptions, 
    PropertyValueType
} from './FilterBuilderService';
import { trimEnd } from 'lodash';

export class ResponseSearchProperty { 
    public Key: string;
    public Value: any;
    public ValueType: string; 
}

export interface SelectableSearchResult extends SearchResult {
    IsSelected: boolean;
}

export default class SearchService {

    public static $inject: string[] = ['$rootScope'];
    public rowLimit: number = 10;
    public page: number = 0;
    private currentResults: SearchResults;
    private get controls(): FilterData[] {
        return <Array<FilterData>>this.$rootScope['fields'];
    }
    public totalRows: number;

    public get pageNumber(): number {
        return this.page + 1;
    }

    constructor(private $rootScope: angular.IRootScopeService) {

    }

    public search(): Promise<SearchResults> {


        var txt = this.getSearchQueryString_SQLSyntax();

        //txt = 'IsDocument=true';

        console.log(txt);

        // construct our query that will be throughout the paging process, likely from user input
        const q = SearchQueryBuilder
        .create(txt)
        .rowLimit(this.rowLimit)
        .selectProperties(
            "Filename",
            "FileExtension",
            "IsDocument",
            "LastModifiedTime",
            "SPContentType",
            "Title", "Path", "Rank", "Size", "owsID", "WorkId", "SiteName", "OWS_URL",
            "ListUrl",
            "IsListItem",
            "OriginalPath",
            "SPWebURL",
            "WebUrl",
            "ServerRedirectedURL",
            "IsContainer",
            "LinkingUrl"
        );

        return sp.search(q).then((r: SearchResults) => {
    
            this.currentResults = r; // update the current results
            this.page = 0; // reset if needed
            this.totalRows = r.RawSearchResults.PrimaryQueryResult.RelevantResults.TotalRows;

            this.deselectResults(r);

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

    public getSearchQueryString_SQLSyntax(): string {

        if(!this.controls){
            return;
        }

        var searchString = '';
        var strAndOperator = ' AND ';
        var strOrOperator = ' OR ';
        var timetail = ' 23:59:59';

        // Freetext
        /*
        if (!ctrlFreeText.isEmpty()) {
            searchString += "FREETEXT(DEFAULTPROPERTIES, '" + ctrlFreeText.val() + "')";
            
            if (jRdoKeywordBool.prop('checked')) {
                searchString += strAndOperator;
            }
            else {
                searchString += strOrOperator;
            }
        }
        */
        for (var i = 0; i < this.controls.length; i++) {
            var cont = this.controls[i];
            var prop = cont.property;
            var oper = cont.operator || '';
            var type = cont.type;

            if (!cont.value)
                continue;

            switch (oper.toLowerCase()) {
                case FilterOperator.Freetext:
                    searchString += "FREETEXT(DEFAULTPROPERTIES, '" + cont.value + "')";
                    break;
                case FilterOperator.Equals:

                    if(type === PropertyValueType.String || type === PropertyValueType.DateTime){
                        searchString += prop + "='" + cont.value + "'";
                        //author="John Smith"
                    }
                    else {
                        searchString += prop + "=" + cont.value;
                        //IsDocument=true
                    }
                    break;
                case FilterOperator.Like:
                    searchString += prop + " LIKE '%" + cont.value + "%'";
                    //author LIKE '%Smith%'
                    break;
                case FilterOperator.Between:
                    //LastModifiedTime>='06/28/2011' AND LastModifiedTime<='06/30/2012'
                    searchString += prop + ">='" + this._convertToSPSQLSearchDateFormat(cont.value.split(',')[0]) + "'" + strAndOperator + prop + "&amp;lt;='" + this._convertToSPSQLSearchDateFormat(cont.value.split(',')[1]) + timetail + "'";
                    break;
            }

            searchString += strAndOperator;
        }
        
        if (this.endsWith(searchString, strAndOperator)) {
            searchString = searchString.substring(0, searchString.length - strAndOperator.length);
        }

        if (this.endsWith(searchString, strOrOperator)) {
            searchString = searchString.substring(0, searchString.length - strOrOperator.length);
        }

        return searchString;
    }

    private _getSearchQueryString_Keyword(): string {
        var searchString = '';
        var strAndOperator = ' AND ';
        for (var i = 0; i < this.controls.length; i++) {
            var cont = this.controls[i];
            var prop = cont.property;
            var oper = cont.operator;
            var type = cont.control;

            if (!cont.value)
                continue;
            
            switch (oper.toLowerCase()) {
                case FilterOperator.Equals:
                    searchString += prop + ':"' + cont.value + '"';
                    //author: "John Smith"
                    break;
                case FilterOperator.Like:
                    searchString += prop + ':"*' + cont.value + '*"';
                    //author: "*Smith*"
                    break;
                case FilterOperator.Between:
                    //LastModifiedTime:06/28/2011..06/30/2012
                    searchString += prop + ':' + cont.value.replace(';', '..');
                    break;
            }

            searchString += strAndOperator;

        }

        searchString = searchString.substring(0, searchString.length - strAndOperator.length);

        return searchString;
    }

    private _convertToSPSQLSearchDateFormat(strDate): string {
        var arr = strDate.split('/');
        return arr[2] + '/' + arr[0] + '/' + arr[1];
    }

    private endsWith(str, suffix): boolean {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    private trimX (str, x): void {
        var rs = new RegExp('^' + x + '+|' + x + '+$', 'g');
        return str.replace(rs, '');
    }

    private trimEnd(str, suffix): void {
        var rs = new RegExp(str + '+$', 'g');
        return str.replace(rs, '');
    }

    private deselectResults (r: SearchResults){
            
        r.PrimarySearchResults.forEach((result: SelectableSearchResult) => {
            result.IsSelected = false;
        });

    }

}