import * as Model from '../model/AdvancedSearchModel';

export default class SearchQueryBuilder {
    constructor () {

    }

    
    public static getSearchQueryString_SQLSyntax(fields: Array<Model.ISearchProperty>): string {

        if(!fields){
            return '';
        }

        var searchString = '';
        var strAndOperator = ' AND ';
        var strOrOperator = ' OR ';
        var timetail = ' 23:59:59';

        // Freetext
        /*
        if (!ctrlFreeText.isEmpty()) {
            searchString += "FREETEXT(DEFAULTPROPERTIES, '" + ctrlFreeText.val() + "')";
            
            if (jRdoKeywordBool.prop('checked')) {
                searchString += strAndOperator;
            }
            else {
                searchString += strOrOperator;
            }
        }
        */
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var prop = field.property;
            var oper = field.operator || '';
            var type = field.type;

            if (!field.value)
                continue;

            switch (oper.toLowerCase()) {
                case Model.SearchOperator.Freetext:
                    searchString += "FREETEXT(DEFAULTPROPERTIES, '" + field.value + "')";
                    break;
                case Model.SearchOperator.Equals:

                    if(type === Model.PropertyValueType.String || type === Model.PropertyValueType.DateTime){
                        searchString += prop + "='" + field.value + "'";
                        //author="John Smith"
                    }
                    else {
                        searchString += prop + "=" + field.value;
                        //IsDocument=true
                    }
                    break;
                case Model.SearchOperator.Like:
                    searchString += prop + " LIKE '%" + field.value + "%'";
                    //author LIKE '%Smith%'
                    break;
                case Model.SearchOperator.Between:
                    //LastModifiedTime>='06/28/2011' AND LastModifiedTime<='06/30/2012'
                    searchString += prop + ">='" + this._convertToSPSQLSearchDateFormat((<string>field.value).split(',')[0]) + "'" + strAndOperator + prop + "&amp;lt;='" + this._convertToSPSQLSearchDateFormat((<string>field.value).split(',')[1]) + timetail + "'";
                    break;
            }

            searchString += strAndOperator;
        }
        
        if (this._endsWith(searchString, strAndOperator)) {
            searchString = searchString.substring(0, searchString.length - strAndOperator.length);
        }

        if (this._endsWith(searchString, strOrOperator)) {
            searchString = searchString.substring(0, searchString.length - strOrOperator.length);
        }

        return searchString;
    }

    public static BuildSearchQueryString_Keyword(searchModel: Model.IAdvancedSearchConfig): string {
        var searchString = '';
        var strAndOperator = ' AND ';
        var properties = searchModel.properties;
        for (var i = 0; i < properties.length; i++) {
            var field = properties[i];
            var prop = field.property;
            var oper = field.operator;
            var type = field.control;

            if (!field.value)
                continue;
            
            switch (oper.toLowerCase()) {
                case Model.SearchOperator.Equals:
                    searchString += prop + ':"' + field.value + '"';
                    //author: "John Smith"
                    break;
                case Model.SearchOperator.Like:
                    searchString += prop + ':"*' + field.value + '*"';
                    //author: "*Smith*"
                    break;
                case Model.SearchOperator.Between:
                    //LastModifiedTime:06/28/2011..06/30/2012
                    searchString += prop + ':' + (<string>field.value).replace(';', '..');
                    break;
            }

            searchString += strAndOperator;

        }

        searchString = searchString.substring(0, searchString.length - strAndOperator.length);

        return searchString;
    }

    private static _convertToSPSQLSearchDateFormat(strDate): string {
        var arr = strDate.split('/');
        return arr[2] + '/' + arr[0] + '/' + arr[1];
    }

    private static _endsWith(str, suffix): boolean {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

/*     private trimX (str, x): void {
        var rs = new RegExp('^' + x + '+|' + x + '+$', 'g');
        return str.replace(rs, '');
    }

    private trimEnd(str, suffix): void {
        var rs = new RegExp(str + '+$', 'g');
        return str.replace(rs, '');
    }
 */


}