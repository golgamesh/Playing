import * as angular from 'angular';
import { IAdvancedSearchWebPartProps } from '../AdvancedSearchWebPart';
import  FilterBuilderService, { 
    AdvancedSearchOptions, 
    ResultPropertyValueType, 
    FilterData
} from './FilterBuilderService';
import { SearchResults, SearchResult } from '@pnp/sp';
import SearchService, { ResponseSearchProperty } from './SearchService';
import PaginationService, { PaginationItem } from './PaginationService';
import * as $ from 'jquery';
import 'picker';
import 'pickadate';
import { SearchResponse } from '@pnp/sp/src/search';
import 'ng-office-ui-fabric';

export interface IAdvancedSearchRootScope extends angular.IRootScopeService {
    fields: FilterData[];
    search: SearchService;
    options: AdvancedSearchOptions;
    wpProps: IAdvancedSearchWebPartProps;
    results: SearchResult[];
    SearchProperties: ResponseSearchProperty[];
    selectedResult: SearchResult;
    getResults(): void;
    reset(): void;
    searchQuery(): string;
    dateRangeChange($event: angular.IAngularEvent): void;
    formatDate(isoDate: string): string;
    formatBool(bool: string): string;
    getPage(page: number): Promise<void>;
    row_click(e: JQuery.Event): void;
}

export default class HomeController {
    
    public static $inject: string[] = ['$rootScope', '$compile', '$element', 'FilterBuilderService', 'SearchService', 'PaginationService'];
    public properties: IAdvancedSearchWebPartProps;
    public options: AdvancedSearchOptions;

    constructor(private $rootScope: IAdvancedSearchRootScope, private $compile: angular.ICompileService, private $element: angular.IRootElementService, private filterBuilder: FilterBuilderService, private search: SearchService, private paging: PaginationService) {
        const vm: HomeController = this;
        vm.init();

        $rootScope.$on('configurationChanged', (event: angular.IAngularEvent, args: { wpProps: IAdvancedSearchWebPartProps }): void => {
            $rootScope.$apply((scope: angular.IScope) => {
                vm.init(args.wpProps);
            });
        });

        $rootScope.getResults = () => {
            this.search.search().then((r: SearchResults) => {
                this.renderResults(r);
            });
        };

        $rootScope.reset = () => {

            var fields: any[] = $rootScope['fields'];
            fields.forEach((field) => {
                field.value = '';
            });

            var $inputs = $('.ms-DatePicker-input').val('')
            //.pickadate();
            //$inputs.pickadate('destroy');
            //$inputs.pickadate();

        };

        $rootScope.searchQuery = (): string => {
            return this.search.getSearchQueryString_SQLSyntax();
        };

        $rootScope.dateRangeChange = ($event: angular.IAngularEvent) => {
            console.log('change');
        };

        $rootScope.formatDate = (isoDate: string): string => {
            return (new Date(isoDate)).toLocaleDateString();
        };

        $rootScope.formatBool = (bool: string) => {
            if(bool === 'true'){
                return 'Yes';
            }
            else {
                return 'No';
            }
        };

        $rootScope.selectedResult = null;

        $rootScope.row_click = (e: JQuery.Event): void => {
            var $row = $(e.currentTarget);
            var selected = 'is-selected';
            var index: number = $row.data('index');
            var result: SearchResult = this.$rootScope.results[index];

            if($row.hasClass(selected)) {
                $row.removeClass(selected);
                $row.attr('uif-selected', "false");
                result = null;
            }
            else {
                $row.parent().find('TR').removeClass(selected);
                $row.addClass(selected);
                $row.attr('uif-selected', "true");
            }
            this.select(result);
        };
    }

    private renderResults(r: SearchResults) {
        // Loop on results to populate structure
        // this is strange, but appears necessary
        for(var i in r.PrimarySearchResults){
            var resultItem = r.PrimarySearchResults[i];
        }

        var rawRows = r.RawSearchResults.PrimaryQueryResult.RelevantResults.Table.Rows;
        var props = this.options.results.properties;

        if(rawRows.length) {
            var firstRow = rawRows[0].Cells;
            
            props.forEach((p) => {
                p.type = <ResultPropertyValueType>firstRow.filter(c => c.Key === p.property)[0].ValueType;
            });
        }

        this.$rootScope.results = r.PrimarySearchResults;
        this.$rootScope.SearchProperties = r.RawSearchResults.Properties;

        const pagingData: PaginationItem = this.paging.GetPager(this.search.totalRows, this.search.pageNumber, this.search.rowLimit);
        console.log(pagingData);

        this.$rootScope['pager'] = pagingData;
        
        $('.reg-search-results')
            .empty()
            .prepend(this.$compile(`
                <div toolbar selectedResult="selectedResult"></div>
                <div searchresults results="results" properties="options.results.properties" selectedResult="selectedResult"></div>
            `)(this.$rootScope));
    }

    private init(wpProps?: IAdvancedSearchWebPartProps) {
        this.properties = wpProps;
        if(this.properties){
            this.options = JSON.parse(this.properties.options);
            this.search.rowLimit = this.properties.rowLimit;
            this.primeScope();
            let ui = this.filterBuilder.BuildFilterUI();
            console.log(ui);
            let jUi = this.$compile(ui)(this.$rootScope);
            this.$element.find('.reg-search-filter').empty().prepend(jUi);
            
        }
    }

    private primeScope(): void {
        
        // Init each field value to empty
        this.options.fields.forEach((field: FilterData) => {
            field.value = '';
        });
        
        this.$rootScope.fields = this.options.fields;
        this.$rootScope.search = this.search;
        this.$rootScope.options = this.options;
        this.$rootScope.wpProps = this.properties;
        this.$rootScope.getPage = (page: number): Promise<void> => {
            return this.search.getPage(page).then((r: SearchResults) => {
                this.renderResults(r);
            });
        };
    }

    protected select(result: SearchResult): void {
        this.$rootScope.selectedResult = result;
    }

    protected viewProperties_click(e: JQuery.Event): void {
        this.$rootScope.results
    }

    private getLibraryName(result: SearchResult): void {
        //var siteURL = result.
        var fileURL = result.Path;

        /*
        <xsl:template name="getLibraryName">
        <xsl:param name="siteURL" />
        <xsl:param name="fileURL" />
        <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" /> 
        <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" /> 
        <xsl:value-of select="substring-before(concat(substring-after(translate($fileURL, $uppercase, $smallcase), concat(translate($siteURL, $uppercase, $smallcase), '/')), '/'), '/')" /> 
      </xsl:template>
      */
    }
}
 