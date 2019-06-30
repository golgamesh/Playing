import * as React from 'react';
import styles from './AdvancedSearch.module.scss';
//import { escape } from '@microsoft/sp-lodash-subset';
import SearchInterface, { ISearchInterfaceProps } from './SearchInterface';
import * as Model from '../../../model/AdvancedSearchModel';
import SearchQueryBuilder from '../../../helpers/SearchQueryBuilder';
//import AdvancedSearchData from '../model/AdvandSearchData';
//import { SearchResults, SearchResult } from '@pnp/sp';
//import ResultsInterface, { IResultsInterfaceProps } from './ResultsInterface';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAdvancedSearchProps {
  config: Model.IAdvancedSearchConfig;
  isDebug: boolean;
  context: WebPartContext;
  searchHandler: Function;
  includeKeywordSearch: boolean;
  parentElement: HTMLElement;
  startMinimized: boolean;
  additionalCriteria: string;
}

export interface IAdvancedSearchState {
  searchQuery: string;
  config: Model.IAdvancedSearchConfig;
}

export default class AdvancedSearch extends React.Component<IAdvancedSearchProps, IAdvancedSearchState> {

  constructor(props) {
    super(props);
    console.log('Advancesearchprops: ', props);
    //this.searchData = new AdvancedSearchData(props.context, props.resultsConfig);
    this.state = {
      searchQuery: '',
      config: this.props.config
    };
  }

  public state: IAdvancedSearchState;

  public componentWillReceiveProps(nextProps: IAdvancedSearchProps): void {
    this.setState({
      ...this.state,
      config: nextProps.config
    });
  }

  public render(): React.ReactElement<IAdvancedSearchProps> {
    return (
      <div className={ styles.advancedSearch }>
        <SearchInterface 
          config={this.props.config}
          searchHandler={(keywordSearch, searchModel, additionalCriteria) => this.search(keywordSearch, searchModel, additionalCriteria)} 
          includeKeywordSearch={this.props.includeKeywordSearch}
          parentElement={this.props.parentElement}
          startMinimized={this.props.startMinimized}
          additionalCriteria={this.props.additionalCriteria}
        />
      </div>
    );
  }


  protected search(keywordSearch: string, searchModel: Model.IAdvancedSearchConfig, additionalCriteria: string): void {
  
    let query: string = SearchQueryBuilder.BuildSearchQueryString_Keyword(keywordSearch, searchModel, additionalCriteria);

    this.props.searchHandler(query);

  }

}
