import * as angular from 'angular';
import HomeController from './HomeController';
import { TextInput } from './Directives';
//import DataService from './DataService';

const testapp2: angular.IModule = angular.module('testapp2', []);

testapp2
    .controller('HomeController', HomeController)
    .directive('textinput', TextInput.AngularDependencies); 
//testapp2.service('DataServie', DataService);
