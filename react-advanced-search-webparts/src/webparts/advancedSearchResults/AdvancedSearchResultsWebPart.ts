import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IPropertyPaneConditionalGroup,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDynamicField,
  IWebPartPropertiesMetadata,
  DynamicDataSharedDepth
} from '@microsoft/sp-webpart-base';
import * as Model from '../../model/AdvancedSearchModel';
import * as strings from 'AdvancedSearchResultsWebPartStrings';
import AdvancedSearchResults from './components/AdvancedSearchResults';
import { IAdvancedSearchResultsProps } from './components/AdvancedSearchResults';
import Validation from '../../helpers/Validation';
import { DynamicProperty } from '@microsoft/sp-component-base';
import { IDynamicDataSource } from '@microsoft/sp-dynamic-data';

export interface IAdvancedSearchResultsWebPartProps {
  description: string;
  isDebug: boolean;
  rowLimit: number;
  resultsConfig: string;
  searchQuery: DynamicProperty<string>;
}

export default class AdvancedSearchResultsWebPart extends BaseClientSideWebPart<IAdvancedSearchResultsWebPartProps> {

  public resultsConfig: Model.IResultsConfig;

  public render(): void {

    this.resultsConfig = this._parseConfig(this.properties.resultsConfig);
    const searchQuerySource: IDynamicDataSource | undefined = this.properties.searchQuery.tryGetSource();
    const searchQuery: string | undefined = this.properties.searchQuery.tryGetValue();
    const needsConfiguration: boolean = (!searchQuerySource && !searchQuery) || !this.resultsConfig;
    
    const element: React.ReactElement<IAdvancedSearchResultsProps > = React.createElement(
      AdvancedSearchResults,
      {
        needsConfiguration: needsConfiguration,
        onConfigure: () => this._onConfigure(),
        isDebug: this.properties.isDebug,
        rowLimit: this.properties.rowLimit,
        config: this.resultsConfig,
        searchQuery: searchQuery,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

 /**
  * Event handler for clicking the Configure button on the Placeholder
  */
  private _onConfigure = (): void => {
    this.context.propertyPane.open();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  private _parseConfig(json: string): Model.IResultsConfig {
    try {
      return JSON.parse(json);
    } catch(ex) {
      return null;
    }
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      // Specify the web part properties data type to allow the address
      // information to be serialized by the SharePoint Framework.
      'searchQuery': {
        dynamicPropertyType: 'string'
      }
    } as any as IWebPartPropertiesMetadata;
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
              primaryGroup: {
                groupName: 'fsdajk',
                groupFields: [
                  PropertyPaneTextField('searchQuery', {
                    label: strings.SearchQueryFieldLabel
                  })
                ]
              },
              secondaryGroup: {
                groupName: 'fsdajk',
                groupFields: [
                  PropertyPaneDynamicField('searchQuery', {
                    label: strings.SearchQueryFieldLabel
                  })
                ],                
                sharedConfiguration: {
                  // because address and city come from the same data source
                  // the connection can share the selected dynamic property
                  depth: DynamicDataSharedDepth.Property
                }
              },
              showSecondaryGroup: !!this.properties.searchQuery.tryGetSource()
            } as IPropertyPaneConditionalGroup,
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('resultsConfig', {
                  label: strings.ResultsConfigFieldLabel,
                  multiline: true,
                  description: strings.ResultsConfigFieldDesc,
                  validateOnFocusOut: true,
                  onGetErrorMessage: Validation.validateResultsConfig.bind(this)
                }),
                PropertyPaneTextField('rowLimit', {
                  label: strings.RowLimitFieldLabel
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
