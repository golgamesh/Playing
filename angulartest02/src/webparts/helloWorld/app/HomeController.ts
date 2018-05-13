
import * as angular from 'angular';
import { template } from 'lodash';

export default class HomeController {

    public static $inject: string[] = ['$rootScope', '$element', '$compile'];
    public description: string; 

    constructor(private $rootScope: angular.IRootScopeService, private $element: angular.IRootElementService, private $compile: angular.ICompileService) {
        const vm: HomeController = this;
        $rootScope['alvin'] = 'test';
        this.init();
        this.addControls();

        $rootScope.$on('configurationChanged', (event: angular.IAngularEvent, args: { description: string }): void => {
            $rootScope.$apply((scope: angular.IScope) => {
                vm.init(args.description);
            });
        });

    }

    private init(description?: string): void {
            this.description = description;
    }

    private addControls(): void {
        var el = document.querySelector('#app');
        
        var dirText = template('<div myrective id="<%= id %>" ng-model="<%= id %>"></div>');

        var txt = this.$compile(dirText({ id: 'alvin' }))(this.$rootScope);

        this.$element.append(txt);
        //this.$element(el).append('<div myrective id="name" value="jane"></div>');

    }

}