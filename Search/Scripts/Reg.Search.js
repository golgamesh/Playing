/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\MicrosoftAjax.debug.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\SP.debug.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\jquery-1.7.2-vsdoc.js" />
/// <reference path=".\Reg.WebControls.Search.js" />

var RegSearch = RegSearch || {};

var RegSearchInitString = RegSearchInitString || '[]';


var SearchOperators = {
    Equals: '=',
    Like: 'Like',
    Range: 'Range',
    Freetext: 'Freetext'
};

var RegSearch = function (rs) {
    
    var options = [];
    var jContainer = $([]);
    var container = null;
    var containerId = '';
    var jTable = $([]);
    var jTxtKeyword = $([]);
    var jRdoKeywordBool = $([]);
    var ctrlFreeText = null;
    var resultsPageUrl = '.';
    var timetail = ' 23:59:59';

    rs.SearchLanguages = {
        Keyword: 0,
        SQLSyntax: 1,
        FQL: 2
    };

    rs.SearchSyntax = rs.SearchLanguages.SQLSyntax;

    rs.controls = [];

    rs.reset = function () {
        jTxtKeyword.val('');
        jTxtKeyword.trigger('blur');
        jRdoKeywordBool[0].setAttribute('checked', 'checked');
        for (var i = 0; i < rs.controls.length; i++) {
            rs.controls[i].reset();
        }
    };

    rs.search = function () {
        var qs = '';

        switch (rs.SearchSyntax) {
            case rs.SearchLanguages.Keyword:
                qs = _getSearchQueryString_Keyword();
                break;
            case rs.SearchLanguages.SQLSyntax:
                qs = _getSearchQueryString_SQLSyntax();
                break;
            default:
                break;
        }
        
        return qs;

    };

    rs.goToResults = function (qs) {
        var searchVariable = '';
        var searchAddr = '';

        switch (rs.SearchSyntax) {
            case rs.SearchLanguages.Keyword:
                searchVariable = 'k';
                break;
            case rs.SearchLanguages.SQLSyntax:
                searchVariable = 'search';
                break;
            default:
                break;
        }

        searchAddr = resultsPageUrl + '?' + searchVariable + '=' + encodeURIComponent(qs);

        if (!jRdoKeywordBool.prop('checked') && !ctrlFreeText.isEmpty()) {
            searchAddr += '&kwb=or';
        }

        window.location = searchAddr;

    }

    rs.init = function init(elId) {
        containerId = elId;
        jContainer = $('#' + containerId);
        jRdoKeywordBool = $("INPUT[name='rdoKeywordBool']");
        container = jContainer[0];
        options = Sys.Serialization.JavaScriptSerializer.deserialize(RegSearchInitString);

        if (RegSearchResultsPage == '.') {
            resultsPageUrl = window.location.pathname;
        }
        else {
            resultsPageUrl = RegSearchResultsPage;
        }

        jTable = _buildTable();
        rs.buildControls();
        _setupKeyword();

        var prevSearch = _parseQueryString_SQLSyntax();
        _loadCriteria(prevSearch);

        $('#btnClear').click(function () {
            try {
                rs.reset();
            }
            catch (ex) {
                throw ex;
            }
            finally {
                return false;
            }
        });

        $('#btnSearch').click(function () {
            try {
                var query = rs.search();
                if (query == '') {
                    var notifyId = SP.UI.Notify.addNotification("You need to provide search criteria.", true);
                    setTimeout(function () { SP.UI.Notify.removeNotification(notifyId); }, 5000);
                }
                else {
                    rs.goToResults(query);
                }
            }
            catch (ex) {
                throw ex;
            }
            finally {
                return false;
            }
        });
        
    };
    
    rs.buildControls = function () {
        var control = null;
        var jTableCell = $([]);

        // Freetext Field
        ctrlFreeText = createFreetextField('txtKeyword');
        ctrlFreeText.operator = SearchOperators.Freetext;

        for (var i = 0; i < options.length; i++) {
            jTableCell = _appendControlContainer(options[i].name, options[i].operator);
            switch (options[i].type) {
                case SearchControls.TextField:
                    control = createTextField(jTableCell);
                    break;
                case SearchControls.SelectField:
                    control = createSelectField(jTableCell);
                    var data = options[i].data;
                    for (var j = 0; j < data.length; j++) {
                        control.addOption(data[j]);
                    }
                    break;
                case SearchControls.DateRange:
                    control = createDaterangeField(jTableCell);
                    break;
            }
            control.managedProp = options[i].property;
            control.operator = options[i].operator;
            rs.controls.push(control);
        }
        $('.searchControlTable TR:last-child > TD.boolLabel:last-child').css({ display: 'none' });

    };

    function _appendControlContainer(controlName, operator) {
        var html = '<tr><td>' + controlName + '</td><td>' + operator + '</td><td></td><td class="boolLabel">And</td></tr>';
        return jTable.append(html).find('TR').last().find(':nth-child(3)');
    }

    function _buildTable() {
        html = '<table class="searchControlTable"></table>';
        return $('#' + containerId).append(html).children().last();
    }

    function _setupKeyword() {
        jTxtKeyword = $('.keywordBackground');

        jTxtKeyword.focus(function () {
            $(this).removeClass('keywordBackground');
        }).blur(function () {
            if ($(this).val() == '') {
                $(this).addClass('keywordBackground');
            }
        });
    }

    function _getSearchQueryString_SQLSyntax() {
        var searchString = '';
        var strAndOperator = ' AND ';
        var strOrOperator = ' OR ';

        // Freetext
        if (!ctrlFreeText.isEmpty()) {
            searchString += "FREETEXT(DEFAULTPROPERTIES, '" + ctrlFreeText.val() + "')";
            
            if (jRdoKeywordBool.prop('checked')) {
                searchString += strAndOperator;
            }
            else {
                searchString += strOrOperator;
            }
        }

        for (var i = 0; i < rs.controls.length; i++) {
            var cont = rs.controls[i];
            var prop = cont.managedProp;
            var oper = cont.operator;
            var type = cont.type;

            if (cont.isEmpty())
                continue;

            switch (oper) {
                case SearchOperators.Freetext:
                    searchString += "FREETEXT(DEFAULTPROPERTIES, '" + cont.val() + "')";
                    break;
                case SearchOperators.Equals:
                    searchString += prop + "='" + cont.val() + "'";
                    //author="John Smith"
                    break;
                case SearchOperators.Like:
                    searchString += prop + " LIKE '%" + cont.val() + "%'";
                    //author LIKE '%Smith%'
                    break;
                case SearchOperators.Range:
                    //LastModifiedTime>='06/28/2011' AND LastModifiedTime<='06/30/2012'
                    searchString += prop + ">='" + _convertToSPSQLSearchDateFormat(cont.val().split(';')[0]) + "'" + strAndOperator + prop + "&amp;lt;='" + _convertToSPSQLSearchDateFormat(cont.val().split(';')[1]) + timetail + "'";
                    break;
            }

            searchString += strAndOperator;
        }

        if (searchString.endsWith(strAndOperator)) {
            searchString = searchString.substring(0, searchString.length - strAndOperator.length);
        }

        if (searchString.endsWith(strOrOperator)) {
            searchString = searchString.substring(0, searchString.length - strOrOperator.length);
        }

        return searchString;
    }

    function _getSearchQueryString_Keyword() {
        var searchString = '';
        var strAndOperator = ' AND ';
        for (var i = 0; i < rs.controls.length; i++) {
            var cont = rs.controls[i];
            var prop = cont.managedProp;
            var oper = cont.operator;
            var type = cont.type;

            if (cont.isEmpty())
                continue;
            
            switch (oper) {
                case SearchOperators.Equals:
                    searchString += prop + ':"' + cont.val() + '"';
                    //author: "John Smith"
                    break;
                case SearchOperators.Like:
                    searchString += prop + ':"*' + cont.val() + '*"';
                    //author: "*Smith*"
                    break;
                case SearchOperators.Range:
                    //LastModifiedTime:06/28/2011..06/30/2012
                    searchString += prop + ':' + cont.val().replace(';', '..');
                    break;
            }

            searchString += strAndOperator;

        }

        searchString = searchString.substring(0, searchString.length - strAndOperator.length);

        return searchString;
    }

    function _parseQueryString_SQLSyntax() {
        var kvps = [];
        var item = '';
        var kvp = [];
        var objKvp = {};
        var k, v;
        var items = '';
        var d1 = '';
        var d2 = '';

        var search = $.QueryString["search"];
        if (search) {
            items = search.split(/ AND | OR /);
        }
        else {
            return objKvp;
        }

        for (var i = 0; i < items.length; i++) {
            item = items[i];

            if(item.indexOf(' LIKE ') != -1 && item.indexOf('%') != -1){
                item = item.replace(/%/g, '').replace(/'/g, '');
            }

            if (item.indexOf('FREETEXT') != -1) {
                item = item.replace("FREETEXT(DEFAULTPROPERTIES, '", 'Freetext=');
                item = item.replace("')", "");
            }

            kvp = item.split(/ LIKE |>=|&amp;lt;=|=/);
            if (item.indexOf('FREETEXT') == -1) {
                kvp[1] = kvp[1].trimX('\"');
                kvp[1] = kvp[1].trimX("'");
                kvp[1] = kvp[1].trimX(timetail);
            }
            else {
                kvp[0]
            }
            kvps.push(kvp);
        }
        var json = Sys.Serialization.JavaScriptSerializer.serialize(kvps);

        //$('#lblOutput').text(json);


        for (var i = 0; i < kvps.length; i++) {
            k = kvps[i][0];
            v = kvps[i][1];
            
            if (objKvp[k] == undefined) {
                objKvp[k] = v;
            }
            else {
                objKvp[k] = objKvp[k] + ';' + v;
            }
        }

        for (var i in objKvp) {
            v = objKvp[i];
            if (v.indexOf(';') !== -1 && v.indexOf('/') !== -1) {
                d1 = v.split(';')[0];
                d2 = v.split(';')[1];

                d1 = _convertFromSPSQLSearchDateFormat(d1);
                d2 = _convertFromSPSQLSearchDateFormat(d2);

                objKvp[i] = d1 + ';' + d2;
            }
        }

        var obj = Sys.Serialization.JavaScriptSerializer.serialize(objKvp);

        //$('#lblOutput').append(obj);

        return objKvp;
    }

    function _getControlByManagedProp(prop) {
        if (prop == 'Freetext') {
            return ctrlFreeText;
        }
        for (var i = 0; i < rs.controls.length; i++) {
            if (rs.controls[i].managedProp == prop) {
                return rs.controls[i];
            }
        }
    }

    function _loadCriteria(critData) {
        var value = '';
        var ctrl = null;
        var kwb = $.QueryString['kwb'];

        if(kwb)
            kwb = kwb.toLowerCase();
   

        if (kwb == 'or') {
            jRdoKeywordBool[1].click();
        }

        for (var key in critData) {
            value = critData[key];
            ctrl = _getControlByManagedProp(key);
            ctrl.val(value);
        }
    }

    function _convertToSPSQLSearchDateFormat(strDate) {
        var arr = strDate.split('/');
        return arr[2] + '/' + arr[0] + '/' + arr[1];
    }

    function _convertFromSPSQLSearchDateFormat(strDate) {
        var arr = strDate.split('/');
        return arr[1] + '/' + arr[2] + '/' + arr[0];
    }

    return rs;

}(RegSearch);


String.prototype.trimX = function (x) {
    var rs = new RegExp('^' + x + '+|' + x + '+$', 'g');
    return this.replace(rs, '');
};

(function ($) {
    /// <summary>
    /// Creates jQuery Extension for retrieving query
    /// string parameters from the browser address
    /// Usage: $.QueryString["param"]
    /// Note:  This is case sensitive
    /// </summary>
    $.QueryString = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0].toLowerCase()] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);
