import * as Model from '../model/AdvancedSearchModel';

export default class Validation {

    public static validateOptions(strOptions: string): string {

        var o: any;
        var sample: Model.IAdvancedSearchOptions = require('../model/SampleOptions');

        try {
            o = JSON.parse(strOptions);
        }
        catch (ex) {
            return 'Invalid JSON Syntax';
        }

        if (Validation.is<Model.IAdvancedSearchOptions>(o, sample, false)) {
            return '';
        } else {
            return 'Fails To Implement IAdvancedSearchOptions, see console for details';
        }
    }

    /**
     * Checks if given object implements interface by comparing it 
     * to a sampe object that is valid
     * @param o object to check
     * @param sample object that correctly implements interface
     * @param strict returns false if extra properties are found
     * @param recursive checks chilc objects
     */
    public static is<T>(o: any, sample: T, strict = true, recursive = true): o is T {
        if (o == null) return false;
        let s = sample as any;
        // If we have primitives we check that they are of the same type and that type is not object 
        if (typeof s === typeof o && typeof o != "object") return true;

        //If we have an array, then each of the items in the o array must be of the same type as the item in the sample array
        if (o instanceof Array) {
            // If the sample was not an arry then we return false;
            if (!(s instanceof Array)) return false;
            let oneSample = s[0];
            let e: any;
            for (e of o) {
                if (!this.is(e, oneSample, strict, recursive)) return false;
            }
        } else {
            // We check if all the properties of sample are present on o
            for (let key of Object.getOwnPropertyNames(sample)) {
                if (typeof o[key] !== typeof s[key]) {
                    console.log('Object missing property: ' + key, o);
                    return false;
                }
                if (recursive && typeof s[key] == "object" && !this.is(o[key], s[key], strict, recursive)) {
                    return false;
                }
            }
            // We check that o does not have any extra prperties to sample
            if (strict) {
                for (let key of Object.getOwnPropertyNames(o)) {
                    if (s[key] == null) return false;
                }
            }
        }

        return true;
    }

    public static verifyOptionalProperties(options: Model.IAdvancedSearchOptions): boolean {
        options.fields.forEach((field: Model.ISearchPropertyData) => {
        });

        return true;
    }

}