/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\MicrosoftAjax.debug.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\jquery-1.7.2-vsdoc.js" />

var SearchControls = {
    Control: 'Control',
    TextField: 'TextField',
    SelectField: 'SelectField',
    DateRange: 'DateRange'
};

function createControl(containerId) {

    var _val = '';

    var control = {
        type: 'Control',
        toString: function () {
            return this.type;
        },
        val: function (value) {
            if (value !== undefined) {
                _val = value;
            }
            else {
                return _val;
            }
        },
        reset: function () {
            this.val('');
        },
        isEmpty: function () {
            return this.val() === '';
        },
        jContainer: resolveContainerId(containerId),
        container: null,
        jElement: $([]),
        element: null
    };

    control.container = control.jContainer[0];

    return control;

}

function createFreetextField(containerId) {

    var control = createControl(containerId);
    control.type = 'Freetext';
    control.jElement = $('#' + containerId);
    control.element = control.jElement[0];

    control.val = function (value) {
        if (value !== undefined) {
            control.element.value = value;
            control.jElement.focus();
        }
        else {
            return control.element.value;
        }
    };

    return control;

}

function createTextField(containerId) {
    
    var control = createControl(containerId);
    control.type = 'TextField';
    var html = '<input type="text" class="searchControl searchControlTextField" />';
    
    (function render () {
        control.jElement = control.jContainer.append(html).children().last();
        control.element = control.jElement[0];
    })();

    control.val = function (value) {
        if (value !== undefined) {
            control.element.value = value;
        }
        else {
            return control.element.value;
        }
    };

    return control;

}

function createSelectField(containerId) {

    var control = createControl(containerId);
    control.type = 'SelectField';

    var html = '<select class="searchControl searchControlSelectField"><option></option></select>';

    (function render() {
        control.jElement = control.jContainer.append(html).children().last();
        control.element = control.jElement[0];
    })();

    control.val = function (value) {
        var opts = control.element.options;
        if (value !== undefined) {
            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value == value) {
                    opts[i].selected = true;
                    break;
                }
            }
        }
        else {
            return opts[control.element.selectedIndex].text;
        }
    };

    control.reset = function () {
        control.selected(0);
    };

    control.options = control.element.options;

    control.addOption = function (display, value) {
        if (!value) {
            value = display;
        }

        control.element.options.add(new Option(display, value));

    };

    control.selected = function (valdex) {
        var opts = control.element.options;
        if (valdex !== undefined) {
            if (isInt(valdex)) {
                opts[valdex].selected = true;
            }
            else {
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].text == valdex) {
                        opts[i].selected = true;
                        break;
                    }
                }
            }
        }
        else {
            return opts[control.element.selectedIndex].text;
        }
    };

    function isInt(n) {
        return n % 1 === 0;
    }

    return control;
}

function createDaterangeField(containerId) {

    var control = createControl(containerId);
    control.type = 'DateRange';
    var jTextOne = $([]);
    var jTextTwo = $([]);

    var html = '<table class="searchControl searchControlDaterangeField"> \
                    <tr> \
                        <td> \
                            <input type="text" class="searchControlDateText" /> \
                        </td> \
                        <td> \
                            To&nbsp; \
                        </td> \
                        <td align="right"> \
                            <input type="text" class="searchControlDateText" /> \
                        </td> \
                    </tr> \
                </table>';

    (function render() {
        control.jElement = control.jContainer.append(html).children().last();
        control.element = control.jElement[0];
        $('.searchControlDateText').datepicker({
            showOn: "button",
            buttonImage: "/sites/Imaging/Style%20Library/RegalNetBranding/Images/KLCalendar20.png",
            buttonImageOnly: true,
            buttonText: "Select date"
        });

        jTextOne = $('TD:nth-child(1)>INPUT', control.element);
        jTextTwo = $('TD:nth-child(3)>INPUT', control.element);

    })();

    control.reset = function () {
        control.val(';');
    };

    control.val = function (value) {
        if (value !== undefined) {
            var vals = value.split(';');
            control.val1(vals[0]);
            control.val2(vals[1]);
        }
        else {
            return control.val1() + ';' + control.val2();
        }
    };

    control.val1 = function (value) {
        if (value !== undefined) {
            jTextOne.val(value);
        }
        else {
            return jTextOne.val();
        }
    };

    control.val2 = function (value) {
        if (value !== undefined) {
            jTextTwo.val(value);
        }
        else {
            return jTextTwo.val();
        }
    };

    control.isEmpty = function () {
        return control.val() === ';';
    }

    return control;

}

function resolveContainerId(containerId) {
    if (typeof containerId == 'object') {
        return containerId;
    }
    else {
        return $('#' + containerId);
    }
}