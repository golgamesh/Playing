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
import { IAdvancedSearchProps } from './components/IAdvancedSearchProps';

export interface IAdvancedSearchWebPartProps {
  description: string;
  rowLimit: number;
  options: string;
  addCriteria: string;
  isDebug: boolean;
}

export default class AdvancedSearchWebPart extends BaseClientSideWebPart<IAdvancedSearchWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      this.initialOptions = <Model.IAdvancedSearchOptions>JSON.parse(this.properties.options);
    });
  }

  public initialOptions: Model.IAdvancedSearchOptions;

  public render(): void {
    const element: React.ReactElement<IAdvancedSearchProps > = React.createElement(
      AdvancedSearch,
      {
        description: this.properties.description,
        rowLimit: this.properties.rowLimit,
        initialOptions: this.initialOptions,
        isDebug: this.properties.isDebug
      }
    );

    ReactDom.render(element, this.domElement);
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
                PropertyPaneTextField('options', {
                  label: strings.OptionsFieldLabel,
                  multiline: true,
                  description: strings.OptionsFieldDesc,
                  validateOnFocusOut: true,
                  onGetErrorMessage: Validation.validateOptions.bind(this)
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
