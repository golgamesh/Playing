export class TextInput {

    public static initializer: ng.IDirectiveFactory = () => {
        return {
            restrict: 'AEC',
            controller: () => new TextInput(),
            controllerAs: 'vm',
            replace: true,
            scope: {
                id: '@',
                bindModel: '=ngModel'
            },
            template: require('../templates/textinput-template.html')
        };
    }

    constructor() {
        
    }

    public static AngularDependencies: any[] = [TextInput.initializer];
}