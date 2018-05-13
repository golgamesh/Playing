import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';
import * as angular from 'angular';
import './app/app-module';

export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {


  private $injector: angular.auto.IInjectorService;

  protected onInit(): Promise<void> {
    window['disableBeaconLogToConsole'] = true;
    return super.onInit();
  }

  public render(): void {
    if(this.renderedOnce === false) {
      this.domElement.innerHTML = require('./templates/home-template.html');
      this.$injector = angular.bootstrap(this.domElement, ['testapp2']);
    } 
    this.$injector.get('$rootScope').$broadcast('configurationChanged', {
      description: this.properties.description
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
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
