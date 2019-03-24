import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDynamicField,
  IWebPartPropertiesMetadata
} from '@microsoft/sp-webpart-base';
import * as Model from '../../model/AdvancedSearchModel';
import * as strings from 'AdvancedSearchResultsWebPartStrings';
import AdvancedSearchResults from './components/AdvancedSearchResults';
import { IAdvancedSearchResultsProps } from './components/AdvancedSearchResults';
import Validation from '../../helpers/Validation';
import { DynamicProperty } from '@microsoft/sp-component-base';

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

    const searchQuery: string | undefined = this.properties.searchQuery.tryGetValue();

/*     const needsConfiguration: boolean = !this.properties.bingMapsApiKey || (!address && !this.properties.address.tryGetSource()) || 
    (!city && !this.properties..tryGetSource());
 */
    this.resultsConfig = <Model.IResultsConfig>JSON.parse(this.properties.resultsConfig);
    const element: React.ReactElement<IAdvancedSearchResultsProps > = React.createElement(
      AdvancedSearchResults,
      {
        description: this.properties.description,
        isDebug: this.properties.isDebug,
        rowLimit: this.properties.rowLimit,
        config: this.resultsConfig,
        searchQuery: searchQuery,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      // Specify the web part properties data type to allow the address
      // information to be serialized by the SharePoint Framework.
      'searchQuery': {
        dynamicPropertyType: 'string'
      }
    };
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
                PropertyPaneDynamicField('searchQuery', {
                  label: strings.SearchQueryFieldLabel
                }),
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
