import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import { SPComponentLoader } from '@microsoft/sp-loader';
require('./AdvancedSearchWebPart.css');
import * as strings from 'AdvancedSearchWebPartStrings';
import * as angular from 'angular';
import './app/app-module';
import * as $ from 'jquery';
//import 'picker';
//import 'pickadate';
//import 'ng-office-ui-fabric';
//import '../../../node_modules/office-ui-fabric-react/dist/css/fabric.min.css';

export interface IAdvancedSearchWebPartProps {
  description: string;
  rowLimit: number;
  options: string;
  debug: boolean;
}

export default class AdvancedSearchWebPart extends BaseClientSideWebPart<IAdvancedSearchWebPartProps> {

  constructor() {
    super();
    this.initComplete = false;

    SPComponentLoader.loadCss('https://appsforoffice.microsoft.com/fabric/2.6.1/fabric.min.css');
    SPComponentLoader.loadCss('https://appsforoffice.microsoft.com/fabric/2.6.1/fabric.components.min.css');
  }
  private $injector: angular.auto.IInjectorService;

  private initComplete: boolean;

  protected onInit(): Promise<void> {

    return super.onInit().then(() => {

      window['disableBeaconLogToConsole'] = true;

      $(document).ready(() => {
        this.initComplete = true;
        this.render(); 
      }); 
    });
  }

  public render(): void {
    if(this.renderedOnce === false) {
      this.domElement.innerHTML = require('./templates/home-template.html');
      this.$injector = angular.bootstrap(this.domElement, ['searchApp']);
    }
    if(this.initComplete) {
      this.$injector.get('$rootScope').$broadcast('configurationChanged', {
        wpProps: this.properties
      });
    }
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
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('options', {
                  label: strings.OptionsFieldLabel,
                  multiline: true
                }),
                PropertyPaneTextField('rowLimit', {
                  label: strings.RowLimitFieldLabel
                }),
                PropertyPaneToggle('debug', {
                  label: strings.DebugFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
