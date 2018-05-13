import * as angular from 'angular';
import HomeController from './HomeController';
import { TextInput, SelectInput, DateRangeInput, SearchResults, Toolbar } from './Directives';
import FilterBuilderService from './FilterBuilderService';
import SearchService from './SearchService';
import PaginationService from './PaginationService';
import 'angular-paging';
import 'ng-office-ui-fabric';

const searchApp: angular.IModule = angular.module('searchApp', [
    'bw.paging',
    'officeuifabric.core', 
    'officeuifabric.components'
]);

searchApp
    .controller('HomeController', HomeController)
    .directive('textinput', TextInput.AngularDependencies)
    .directive('selectinput', SelectInput.AngularDependencies)
    .directive('daterangeinput', DateRangeInput.AngularDependencies)
    .directive('searchresults', SearchResults.AngularDependencies)
    .directive('toolbar', Toolbar.AngularDependencies)
    .service('FilterBuilderService', FilterBuilderService)
    .service('SearchService', SearchService)
    .service('PaginationService', PaginationService);
