import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneTextFieldProps,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import Validation from '../../helpers/Validation';
import * as Model from '../../model/AdvancedSearchModel';
import * as strings from 'AdvancedSearchWebPartStrings';
import AdvancedSearch from './components/AdvancedSearch';
import { IAdvancedSearchProps } from './components/AdvancedSearch';
import { ISearchInterfaceProps } from './components/SearchInterface';
import { IDynamicDataPropertyDefinition, IDynamicDataCallables } from '@microsoft/sp-dynamic-data';


export interface IAdvancedSearchWebPartProps {
  description: string;
  searchConfig: string;
  addCriteria: string;
  rowLimit: number;
  isDebug: boolean;
}

const searchQueryDynamicPropertyId = 'search-query';
const searchQueryDynamicPropertyLabel = 'Search Query';

export default class AdvancedSearchWebPart extends BaseClientSideWebPart<IAdvancedSearchWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      // register this web part as dynamic data source
      this.context.dynamicDataSourceManager.initializeSource(this);
    });
  }

  public searchConfig: Model.IAdvancedSearchConfig;

  /**
   * Currently submitted search query
   */
  private _searchQuery: string;

  /**
   * Return list of dynamic data properties that this dynamic data source
   * returns
   */
  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [
      {
        id: searchQueryDynamicPropertyId,
        title: searchQueryDynamicPropertyLabel
      }
    ];
  }

  /**
   * Return the current value of the specified dynamic data set
   * @param propertyId ID of the dynamic data set to retrieve the value for
   */
  public getPropertyValue(propertyId: string): string {
    switch (propertyId) {
      case searchQueryDynamicPropertyId:
        return this._searchQuery;
    }

    throw new Error('Bad property id');
  }

  /**
   * Web part native render method
   */
  public render(): void {

    this.searchConfig = <Model.IAdvancedSearchConfig>JSON.parse(this.properties.searchConfig);
    this._indexProperties();
    //console.log(this.context.manifest.loaderConfig.internalModuleBaseUrls);
    const element: React.ReactElement<IAdvancedSearchProps> = React.createElement(
      AdvancedSearch,
      <IAdvancedSearchProps> {
        config: this.searchConfig,
        isDebug: this.properties.isDebug,
        context: this.context,
        searchHandler: (searchQuery) => this.search(searchQuery)
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected search(searchQuery:string): void {
    this._searchQuery = searchQuery;

    console.log('search query change', searchQuery);
    
    // notify subscribers that the selected event has changed
    this.context.dynamicDataSourceManager.notifyPropertyChanged(searchQueryDynamicPropertyId);
  }

  private _indexProperties() {
    this.searchConfig.properties.forEach((field: Model.ISearchProperty, idx: number) => {
      field.propIndex = idx;
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true
                }),
                PropertyPaneTextField('searchConfig', {
                  label: strings.SearchConfigFieldLabel,
                  multiline: true,
                  description: strings.SearchConfigFieldDesc,
                  validateOnFocusOut: true,
                  onGetErrorMessage: Validation.validateSearchConfig.bind(this)
                }),
                PropertyPaneTextField('addCriteria', {
                  label: strings.AddCriteriaFieldLabel,
                  description: strings.AddCriteriaFieldDesc,
                  multiline: true
                }),
                PropertyPaneToggle('isDebug', {
                  label: strings.IsDebugFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
