import * as React from 'react';
import styles from './AdvancedSearch.module.scss';
import { IAdvancedSearchProps } from './IAdvancedSearchProps';
import { escape } from '@microsoft/sp-lodash-subset';
import SearchInterface, { ISearchInterfaceProps } from './SearchInterface';
import * as Model from '../model/AdvancedSearchModel';

export default class AdvancedSearch extends React.Component<IAdvancedSearchProps, {}> {
  constructor(props) {
    super(props);
    console.log(arguments);
    this.state = {
      options: { 
        ...props.initialOptions 
      }
    };
  }

  public state: any;

  public render(): React.ReactElement<IAdvancedSearchProps> {
    return (
      <div className={ styles.advancedSearch }>
        <SearchInterface options={this.state.options} changeHandler={e => this.control_change(e)} />
      </div>
    );
  }

  protected control_change(e: Event): void {
    let ctrl  = e.currentTarget as HTMLInputElement;

    console.log(ctrl.value);
  }
}
