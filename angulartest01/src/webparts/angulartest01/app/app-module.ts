import * as angular from 'angular';
import HomeController from './HomeController';
import DataService from './DataService';
import { farted } from './TheDirectives';

const todoapp: angular.IModule = angular.module('todoapp', []);

todoapp
  .controller('HomeController', HomeController)
  .service('DataService', DataService)
  .directive('farted', farted.AngularDependencies); 