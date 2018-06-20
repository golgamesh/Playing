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
import Validation from './helpers/Validation';
import * as Model from './model/AdvancedSearchModel';
import * as strings from 'AdvancedSearchWebPartStrings';
import AdvancedSearch from './components/AdvancedSearch';
import { IAdvancedSearchProps } from './components/AdvancedSearch';
import { ISearchInterfaceProps } from './components/SearchInterface';

export interface IAdvancedSearchWebPartProps {
  description: string;
  rowLimit: number;
  searchConfig: string;
  resultsConfig: string;
  addCriteria: string;
  isDebug: boolean;
}

export default class AdvancedSearchWebPart extends BaseClientSideWebPart<IAdvancedSearchWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      this.searchConfig = <Model.IAdvancedSearchConfig>JSON.parse(this.properties.searchConfig);
      this.resultsConfig = <Model.IResultsConfig>JSON.parse(this.properties.resultsConfig);
      this._indexProperties();
    });
  }

  public searchConfig: Model.IAdvancedSearchConfig;
  public resultsConfig: Model.IResultsConfig;

  public render(): void {
    const element: React.ReactElement<IAdvancedSearchProps> = React.createElement(
      AdvancedSearch,
      <IAdvancedSearchProps>{
        description: this.properties.description,
        rowLimit: this.properties.rowLimit,
        searchConfig: this.searchConfig,
        resultsConfig: this.resultsConfig,
        isDebug: this.properties.isDebug,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
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
                PropertyPaneTextField('resultsConfig', {
                  label: strings.ResultsConfigFieldLabel,
                  multiline: true,
                  description: strings.ResultsConfigFieldDesc,
                  validateOnFocusOut: true,
                  onGetErrorMessage: Validation.validateResultsConfig.bind(this)
                }),
                PropertyPaneTextField('addCriteria', {
                  label: strings.AddCriteriaFieldLabel,
                  description: strings.AddCriteriaFieldDesc,
                  multiline: true
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
