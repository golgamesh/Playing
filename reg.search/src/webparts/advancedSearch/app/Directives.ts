import 'ng-office-ui-fabric';
import 'pickadate';

export class TextInput {
    
    public static initializer: ng.IDirectiveFactory = () => {
        return {
            restrict: 'AEC',
            controller: () => new TextInput(),
            controllerAs: 'vm',
            replace: true,
            scope: {
                name: '@',
                property: '@',
                bindModel: '=ngModel'
            },
            template: require('../templates/textinput-template.html')
        };
    }

    constructor() {
        
    }

    public static AngularDependencies: any[] = [TextInput.initializer];

}

export class SelectInput {

    public static initializer: ng.IDirectiveFactory = () => {
        return {
            restrict: 'AEC',
            controller: () => new SelectInput(),
            controllerAs: 'vm',
            replace: true,
            scope: {
                name: '@',
                property: '@',
                bindModel: '=ngModel',
                choices: '='
            },
            template: require('../templates/selectinput-template.html')
        };
    }

    constructor() {

    }

    public static AngularDependencies: any[] = [SelectInput.initializer];

}

export class DateRangeInput {

    public static initializer: ng.IDirectiveFactory = () => {
        return {
            restrict: 'AEC',
            controller: () => new DateRangeInput(),
            controllerAs: 'vm',
            replace: true,
            scope: {
                name: '@',
                property: '@'
            },
            // compile: (tElem, tAttrs) => {
            //     console.log('compile!');
            //     console.log(tElem);
            //     console.log(tAttrs);
            // },
            link: {
                /*
                pre: (scope: any, elem: JQuery, attr: ng.IAttributes) => {
                    console.log('pre!');
                    console.log(scope);
                    console.log(elem);
                },
                */
                post: (scope: any, elem: JQuery, attr: ng.IAttributes) => {
                    var $fromPut = elem.find('.reg-date-from input[type="text"]').pickadate();
                    var $untlPut = elem.find('.reg-date-until input[type="text"]').pickadate();

                    var fromPicker = $fromPut.pickadate('picker');
                    var untlPicker = $untlPut.pickadate('picker');

                    fromPicker.on({
                        set: function (thingSet) { 
                            dateChange(new Date(thingSet.select), this);
                        }
                    });

                    untlPicker.on({
                        set: function(thingSet) {
                            dateChange(new Date(thingSet.select), this);
                        }
                    });

                    function dateChange(select: Date, picker: Pickadate.DatePicker): void {
                        
                        var mode = picker.$node.closest('div.ms-DatePicker').hasClass('reg-date-from') ? 'from' : 'until';

                        var $compInput = elem.find('input.hidden'); 

                        if($compInput.val() == '') {
                            $compInput.val(',');
                        }
                        var index = 0;
                        if(mode === 'until') {
                            index = 1;
                        }

                        var t = $compInput.val().toString().split(',');
                        t[index] = select.toLocaleDateString();
                        $compInput.val(t.join(',')).trigger('change');    
                    }
                }
            },
            template: require('../templates/daterangeinput-template.html')
        };
    }

    constructor() {

    }

    public static AngularDependencies: any[] = [DateRangeInput.initializer];

}

export class SearchResults {
    public static initializer: ng.IDirectiveFactory = () => {
        return {
            restrict: 'AEC',
            controller: () => new SearchResults,
            controllerAs: 'vm',
            replace: true,
            link: {
                post: (scope: any, elem: JQuery, attr: ng.IAttributes) => {

                    // is-selected
                    
                    //elem.on('click', 'tbody>TR', (e: JQuery.Event) => row_click(e));

                    function row_click(e: JQuery.Event) {
                        //console.log('directive link click');
                        //$(e.currentTarget).toggleClass('is-selected');
                        // var $row = $(e.currentTarget);
                        // var selected = 'is-selected';
                        
                        // if($row.hasClass(selected)) {
                        //     $row.removeClass(selected);

                        // }
                        // else {
                        //     $row.parent().find('TR').removeClass(selected);
                        //     $row.addClass(selected);

                        // }

                    }
                    
                    /*
                    var TableElements = document.querySelectorAll(".ms-Table");
                    for (var i = 0; i < TableElements.length; i++) {
                      new fabric['Table'](TableElements[i]);
                    }
                    */
                }
            },
            scope: {
                results: '=',
                textvalue: '@',
                properties: '=',
                formatDate: '&',
                pager:'=',
                selectedResult: '=',
                getPage:'&',
                bindModel: '=ngModel'
            },
            template: require('../templates/search-results.html')
        };
    }

    constructor() {

    }

    public static AngularDependencies: any[] = [SearchResults.initializer];
}

export class Toolbar {
    public static initializer: ng.IDirectiveFactory = () => {
        return {
            restrict: 'AEC',
            controller: () => new Toolbar(),
            controllerAs: 'vm',
            replace: true,
            scope: {
                selectedResult: '='
            },
            template: require('../templates/toolbar-template.html')
        }
    };

    public static AngularDependencies: any[] = [Toolbar.initializer];
}

export class Pagination {
    public static initializer: ng.IDirectiveFactory = () => {
        return {
            restrict: 'AEC',
            controller: () => new Pagination(),
            controllerAs: 'vm',
            replace: true,
            scope: {
                pageNumber: '@',
                rowLimit: '@',
                totalRows: '@',
                buttonLimit: '@'
            },
            template: require('../templates/pagination-template.html')
        };
    }

    constructor() {

    }

    public static AngularDependencies: any[] = [Pagination.initializer];
}