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
import { 
  Dropdown, 
  IDropdown, 
  DropdownMenuItemType, 
  IDropdownOption, 
  IDropdownProps
} from 'office-ui-fabric-react/lib/Dropdown';
import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType,
  IPropertyFieldCollectionDataProps
} from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import Validation from '../../helpers/Validation';
import * as Model from '../../model/AdvancedSearchModel';
import * as strings from 'AdvancedSearchWebPartStrings';
import AdvancedSearch from './components/AdvancedSearch';
import { IAdvancedSearchProps } from './components/AdvancedSearch';
import { ISearchInterfaceProps } from './components/SearchInterface';
import { IDynamicDataPropertyDefinition, IDynamicDataCallables } from '@microsoft/sp-dynamic-data';
import ManagedPropertyPicker from '../../components/ManagedPropertyPicker';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';

export interface IAdvancedSearchWebPartProps {
  searchConfig: string;
  searchConfig2: any[];
  addCriteria: string;
  includeKeywordSearch: boolean;
  startMinimized: boolean;
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

      console.log(JSON.stringify(this.properties.searchConfig2));
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
        startMinimized: this.properties.startMinimized,
        searchHandler: (searchQuery) => this.search(searchQuery),
        includeKeywordSearch: this.properties.includeKeywordSearch,
        parentElement: this.domElement,
        additionalCriteria: this.properties.addCriteria
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

  protected onPropertyPaneConfigurationStart(): void {

  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    console.log('Property Pane Change. Path: ', propertyPath);
    console.log(newValue);
  }

  protected onDataType_change = (option: IDropdownOption, index?: number): void => {
    console.log('change', option.text);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get disableReactivePropertyChanges() {
    return true;
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
                PropertyPaneToggle('includeKeywordSearch', {
                  label: strings.IncludeKeywordSearchLabel
                }),
                PropertyPaneToggle('startMinimized', {
                  label: strings.StartMinimizedLabel,
                  disabled: !this.properties.includeKeywordSearch
                }),
                PropertyPaneTextField('searchConfig', {
                  label: strings.SearchConfigFieldLabel,
                  multiline: true,
                  description: strings.SearchConfigFieldDesc,
                  validateOnFocusOut: true,
                  onGetErrorMessage: Validation.validateSearchConfig.bind(this)
                }),
                PropertyFieldCollectionData('searchConfig2', <IPropertyFieldCollectionDataProps>{
                    key: 'searchConfig',
                    enableSorting: true,
                    label: 'Choose Result Columns',
                    panelHeader: 'Result Columns',
                    manageBtnLabel: 'Choose Result Columns',
                    value: this.properties.searchConfig2,
                    fields: [{
                      id: 'name',
                      title: 'Column Display Name',
                      required: true,
                      type: CustomCollectionFieldType.string,
                    }, 
                    {
                      id: 'property',
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
                      id: 'type',
                      title: 'Data Type',
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: 'Boolean',
                          text: 'Boolean',
                          value: 'Boolean'
                        },
                        {
                          key: 'DateTime',
                          text: 'Date Time',
                          value: 'DateTime'
                        },
                        {
                          key: 'Int32',
                          text: 'Numeric',
                          value: 'Int32'
                        },
                        {
                          key: 'String',
                          text: 'Text',
                          value: 'String'
                        }
                      ]
                    },
                    {
                      id: 'operator',
                      title: 'Operator',
                      required: true,
                      type: CustomCollectionFieldType.custom,
                      onCustomRender: (field, value, onUpdate, item, itemId) => {
                        let options: Array<IDropdownOption>;
                        switch(item['type']) {
                          case 'DateTime':
                              options = [{
                                  key: 'DateRange',
                                  text: 'Date Range',
                                  selected: true
                                }
                              ];
                              if(value !== 'DateRange') {
                                onUpdate(field.id, 'DateRange');
                              }
                            break;
                          case 'String':
                            options = [{
                                key: 'equals',
                                text: 'Equals'
                              },
                              {
                                key: 'like',
                                text: 'Like'
                              }
                            ];
                            break;
                          default: 
                            options = [{
                                key: 'equals',
                                text: 'Equals',
                                selected: true
                              }
                            ];
                            if(value !== 'equals') {
                              onUpdate(field.id, 'equals');
                            }
                            break;
                        }

                        return (
                          React.createElement(Dropdown, <IDropdownProps> {
                            options: options,
                            selectedKey: value,
                            onChanged: (option: IDropdownOption, index?: number): void => {
                              onUpdate(field.id, option.key);
                            } 
                          })
                        );
                      }
                    },
                    {
                      id: 'options',
                      title: 'Choices',
                      type: CustomCollectionFieldType.custom,
                      onCustomRender: (field, val, onUpdate, item, itemId) => {
                        console.log('val', val);
                        let disabled: boolean = false;
                        let type = item['type']; 
                        if(type === 'DateTime' || type === 'Boolean') {
                          disabled = true;
                        }
                        return (
                          React.createElement(TextField, <ITextFieldProps> {
                            multiline: true,
                            disabled: disabled,
                            value: val || "",
                            onChanged: (newValue: any): void => {
                              onUpdate(field.id, newValue);
                            }
                          })
                        );
                      }
                    }
                  ]
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
