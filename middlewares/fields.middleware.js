const Middleware = require('./middleware');
const validator = require('validator');

/**
* @module FieldsMiddleware
* @requires module:Middleware
*/
/**
* @class
* @classdesc FieldsMiddleware class describes methods to check fields
* @hideconstructor
* @extends module:Middleware
*/
class FieldsMiddleware extends Middleware {

    /**
    * @summary CheckRequired method checks required field.
    * @static
    * @param {object} data Object to check
    * @param {string[] | null} fields Field list for the check fields of request
    * @return {object | void} If all fields of the data was passed returned void or object with error messages.
    */
    static checkRequired(data, items = [], messages = []) {
        let errors = {};
        for(let i in items){
            const item = items[i];
            const item_check = data[item];
            if(!item_check){
                errors[item] = this.buildError(
                    errors,
                    item,
                    messages[i]
                );
            }
        }

        if (this.isError(errors)) {
            return errors;
        }
    }
}

module.exports = FieldsMiddleware;
