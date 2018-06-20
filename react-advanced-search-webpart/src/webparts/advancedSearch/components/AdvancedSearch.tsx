import * as React from 'react';
import styles from './AdvancedSearch.module.scss';
//import { escape } from '@microsoft/sp-lodash-subset';
import SearchInterface, { ISearchInterfaceProps } from './SearchInterface';
import * as Model from '../model/AdvancedSearchModel';
import SearchQueryBuilder from '../helpers/SearchQueryBuilder';
//import AdvancedSearchData from '../model/AdvandSearchData';
//import { SearchResults, SearchResult } from '@pnp/sp';
import ResultsInterface, { IResultsInterfaceProps } from './ResultsInterface';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAdvancedSearchProps {
  description: string;
  rowLimit: number;
  searchConfig: Model.IAdvancedSearchConfig;
  resultsConfig: Model.IResultsConfig;
  isDebug: boolean;
  context: WebPartContext;
}

export interface IAdvancedSearchState {
  searchQuery: string;
}

export default class AdvancedSearch extends React.Component<IAdvancedSearchProps, {}> {

  constructor(props) {
    super(props);
    console.log('Advancesearchprops: ', props);
    //this.searchData = new AdvancedSearchData(props.context, props.resultsConfig);
    this.state = {
      searchQuery: ''
    };
  }

  public state: IAdvancedSearchState;

  public render(): React.ReactElement<IAdvancedSearchProps> {
    return (
      <div className={ styles.advancedSearch }>
        <SearchInterface 
          initialConfig={this.props.searchConfig} 
          searchHandler={(searchModel) => this.search(searchModel)} 
        />
        <ResultsInterface 
          config={this.props.resultsConfig} 
          searchQuery={this.state.searchQuery} 
          context={this.props.context}
          isDebug={this.props.isDebug}
          rowLimit={this.props.rowLimit}
        />
      </div>
    );
  }


  protected search(searchModel: Model.IAdvancedSearchConfig): void {
  
    let query: string = SearchQueryBuilder.BuildSearchQueryString_Keyword(searchModel);

    console.log(query);

    this.setState({
      ...this.state,
      searchQuery: query
    });


  }

}
