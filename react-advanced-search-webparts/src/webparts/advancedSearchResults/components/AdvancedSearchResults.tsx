import * as React from 'react';
import styles from './AdvancedSearchResults.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import ResultsInterface, { IResultsInterfaceProps } from './ResultsInterface';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as Model from '../../../model/AdvancedSearchModel';
  

export interface IAdvancedSearchResultsProps {
  description: string;
  isDebug: boolean;
  config: Model.IResultsConfig;
  searchQuery: string;
  context: WebPartContext;
  rowLimit: number;
}

export interface IAdvancedSearchResultsState {
  searchQuery: string;
  
}

export default class AdvancedSearchResults extends React.Component<IAdvancedSearchResultsProps, IAdvancedSearchResultsState> {
  constructor(props: IAdvancedSearchResultsProps) {
    super(props);

    this.state = {
      searchQuery: this.props.searchQuery
    };
  }

  public state: IAdvancedSearchResultsState;

  public componentWillReceiveProps(nextProps: IAdvancedSearchResultsProps): void {
    this.setState({
      ...this.state,
      searchQuery: nextProps.searchQuery
    });
  }

  public render(): React.ReactElement<IAdvancedSearchResultsProps> {
    return (
      <div className={styles.advancedSearchResults}>
        <ResultsInterface 
          config={this.props.config} 
          searchQuery={this.state.searchQuery} 
          context={this.props.context}
          isDebug={this.props.isDebug}
          rowLimit={this.props.rowLimit}
        />
      </div>
    );
  }
}
