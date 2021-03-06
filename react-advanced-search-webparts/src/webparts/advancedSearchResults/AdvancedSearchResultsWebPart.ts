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
  DynamicDataSharedDepth,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType
} from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as Model from '../../model/AdvancedSearchModel';
import * as strings from 'AdvancedSearchResultsWebPartStrings';
import AdvancedSearchResults from './components/AdvancedSearchResults';
import { IAdvancedSearchResultsProps } from './components/AdvancedSearchResults';
import { DynamicProperty } from '@microsoft/sp-component-base';
import { IDynamicDataSource } from '@microsoft/sp-dynamic-data';
import WebPartPropertiesHelper from '../../helpers/WebPartPropertiesHelper';
import SearchSchemaHelper from '../../helpers/SearchSchemaHelper';
import ManagedPropertyPicker from '../../components/ManagedPropertyPicker';
import { SortDirection } from '@pnp/sp';
//import '@pnp/polyfill-ie11'

const defaultSortProperties: Array<string> = [
  'Rank'
];

export interface IAdvancedSearchResultsWebPartProps {
  description: string;
  isDebug: boolean;
  rowLimit: number;
  resultsConfig: string;
  columns: Array<Model.IResultProperty>;
  searchQuery: DynamicProperty<string>;
  sortProperty: string;
  sortDirection: SortDirection;
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

  private _sortableProperties: Array<IPropertyPaneDropdownOption> = [];

  public render(): void {

    this.resultsConfig = this._parseConfig(this.properties.resultsConfig);
    const searchQuerySource: IDynamicDataSource | undefined = this.properties.searchQuery.tryGetSource();
    const searchQuery: string | undefined = this.properties.searchQuery.tryGetValue();
    const needsConfiguration: boolean = (!searchQuerySource && !searchQuery) || !this.properties.columns;
    
    const element: React.ReactElement<IAdvancedSearchResultsProps > = React.createElement(
      AdvancedSearchResults,
      {
        needsConfiguration: needsConfiguration,
        onConfigure: () => this._onConfigure(),
        isDebug: this.properties.isDebug,
        rowLimit: this.properties.rowLimit,
        columns: this.properties.columns,
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

  protected updateSortableProperties(): void {
    let props = [  
      ...defaultSortProperties
    ];
    if(this.properties.columns) {
      let custProps = this.properties.columns.filter(prop => {
        return prop.sortable === true;
      }).map(prop => prop.name);
      props = [
        ...defaultSortProperties,
        ...custProps
      ].sort();
    }
    this._sortableProperties = props.map(prop => {
      return <IPropertyPaneDropdownOption> {
        text: prop,
        key: prop
      };
    });
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

  protected onPropertyPaneConfigurationStart(): void {
    this.updateSortableProperties();
    this.context.propertyPane.refresh();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    this.updateSortableProperties();
    this.context.propertyPane.refresh();
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
                PropertyPaneDropdown('sortProperty', {
                  options: this._sortableProperties,
                  label: 'Sort Property',
                }),
                PropertyPaneDropdown('sortDirection', {
                  options: [{
                    text: 'Ascending',
                    key: SortDirection.Ascending
                  },{
                    text: 'Descending',
                    key: SortDirection.Descending
                  }],
                  label: 'Sort Direction'
                }),
                PropertyFieldCollectionData('columns', {
                    key: 'resultsConfig',
                    enableSorting: true,
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
                        type: CustomCollectionFieldType.custom,
                        onCustomRender: (field, value, onUpdate, item, rowUniqueId) => {
                          return(
                            React.createElement(ManagedPropertyPicker, {
                              key: 'ac' + field.id,
                              context: this.context,
                              value: value || "",
                              onChanged: (e: React.ChangeEvent<HTMLInputElement>) => {
                                onUpdate(field.id, (<HTMLInputElement>e.target).value);
                              },
                              onSelect: (val: string) => {
                                onUpdate(field.id, val);
                              }
                            })
                          );
                        }
                      },
                      {
                        id: 'sortable',
                        title: 'sortable',
                        required: false,
                        type: CustomCollectionFieldType.boolean
                      }
                    ]
                  }
                )
              ]
            }
          ]
        }
      ]
    };
  }
}
