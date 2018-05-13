
export class farted  {
    public static initializer: ng.IDirectiveFactory = () => {
        return {
            restrict: 'AEC',
            controller: () => new farted(),
            controllerAs: 'farted',
            replace: true,
            scope: {},
            template: require('../templates/mydirective-template.html')
        };
    }

    public static AngularDependencies: any[] = [farted.initializer];

    public constructor() {


    }

    public message: string = 'I farted';

}


