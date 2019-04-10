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
  PropertyPaneButton,
  IWebPartPropertiesMetadata,
  DynamicDataSharedDepth
} from '@microsoft/sp-webpart-base';
import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType
} from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as Model from '../../model/AdvancedSearchModel';
import * as strings from 'AdvancedSearchResultsWebPartStrings';
import AdvancedSearchResults from './components/AdvancedSearchResults';
import { IAdvancedSearchResultsProps } from './components/AdvancedSearchResults';
import Validation from '../../helpers/Validation';
import { DynamicProperty } from '@microsoft/sp-component-base';
import { IDynamicDataSource } from '@microsoft/sp-dynamic-data';
import WebPartPropertiesHelper from '../../helpers/WebPartPropertiesHelper';
import SearchSchemaHelper from '../../helpers/SearchSchemaHelper';

export interface IAdvancedSearchResultsWebPartProps {
  description: string;
  isDebug: boolean;
  rowLimit: number;
  resultsConfig: string;
  columns: Array<Model.IResultProperty>;
  searchQuery: DynamicProperty<string>;
}

export default class AdvancedSearchResultsWebPart extends BaseClientSideWebPart<IAdvancedSearchResultsWebPartProps> {

  public resultsConfig: Model.IResultsConfig;
  public searchSchemaHelper: SearchSchemaHelper;

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {

      this.searchSchemaHelper = new SearchSchemaHelper(
        document.location.origin,
        this.context.pageContext.web.serverRelativeUrl, 
        this.context.spHttpClient);

    });
  }

  public render(): void {

    console.log(JSON.stringify(this.properties.columns));

    this.resultsConfig = this._parseConfig(this.properties.resultsConfig);
    //this.resultsConfig = this.properties.resultsConfig;
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
        columns: this.properties.columns,
        //config: this.resultsConfig,
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

  protected onPropertiesExport_click(): void {
    let p = new WebPartPropertiesHelper();
    p.export(this.properties, 'hello');
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

  protected managedPropertyValidation(value: any, index: number, crntItem: any): Promise<string> {
    return this.searchSchemaHelper.managedPropertyExists(value).then((exists: boolean) => {
      return exists ? '' : `That managed property does not exists`;
    });
  }

  protected get disableReactivePropertyChanges() {
    return true;
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
/*                 PropertyPaneTextField('resultsConfig', {
                  label: strings.ResultsConfigFieldLabel,
                  multiline: true,
                  description: strings.ResultsConfigFieldDesc,
                  validateOnFocusOut: true,
                  onGetErrorMessage: Validation.validateResultsConfig.bind(this)
                }), */
                PropertyPaneButton('export', {
                  text: 'Export Configuration',
                  onClick: () => this.onPropertiesExport_click()
                }),
                PropertyPaneTextField('rowLimit', {
                  label: strings.RowLimitFieldLabel
                }),
                PropertyPaneToggle('isDebug', {
                  label: strings.IsDebugFieldLabel
                }),
                PropertyFieldCollectionData('columns', {
                    key: 'resultsConfig',
                    label: 'Choose Result Columns',
                    panelHeader: 'Result Columns',
                    manageBtnLabel: 'Choose Result Columns',
                    value: this.properties.columns,
                    fields: [{
                        id: 'name',
                        title: 'Column Display Name',
                        required: true,
                        type: CustomCollectionFieldType.string,
                      },
                      {
                        id: 'fieldName',
                        title: 'Managed Property',
                        required: true,
                        type: CustomCollectionFieldType.string,
                        deferredValidationTime: 1000,
                        onGetErrorMessage: (value: any, index: number, crntItem: any) => this.managedPropertyValidation(value, index, crntItem)
                      },
                      {
                        id: 'sortable',
                        title: 'sortable',
                        required: false,
                        type: CustomCollectionFieldType.boolean
                      }
                    ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
