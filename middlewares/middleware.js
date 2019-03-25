require('dotenv').config();

const { NODE_ENV } = process.env;

/**
* @module Middleware
* @requires module:dotenv
*/
/**
* @class
* @classdesc This class is ATD for middleware.
* @hideconstructor
* @static
*/
class Middleware {
    /**
    * @summary IsErrors method checks error amount.
    * @static
    * @param {object} errors - Object of the errors
    * @return {boolean}
    */
    static isError(errors) {
        for (let _ in errors) {
            return true;
        }

        return false;
    }

    /**
    * @summary SendRequestError method sends error messages about invalid data request.
    * @static
    * @param {object} errors - Object of the errors.
    * @param {object} res - Express response object @see {@link http://expressjs.com/en/api.html#res}.
    * @return {void}
    */
    static sendRequestError(errors, res) {
        res.status(400).send({ errors });
    }

    /**
    * @summary SendServerError method sends server error message.
    * @description If the 'NODE_ENV' is not 'production' (PROD) of the process environment, adds error message and stack trace in the response body.
    * @param {} exception - Throw expression.
    * @param {object} res - Express response object @see {@link http://expressjs.com/en/api.html#res}.
    * @return {void}
    */
    static sendServerError(exception, res) {
        const error = exception.message;
        const stack = exception.stack;

        res.status(500).send(NODE_ENV !== 'PROD' ? { error, stack } : null);
    }
    /**
    * @summary SendNotFoundError method sends not found status.
    * @param {object} res - Express response object @see {@link http://expressjs.com/en/api.html#res}.
    * @return {void}
    */
    static sendNotFoundError(res) {
        res.status(404).send();
    }

    /**
    * @summary BuildError method builds error message
    * @description This method checks 'field' argument, if he was not passed in the arguments, return null. <br/>
    *              Otherwise adds error message to it and returns
    * @static
    * @param {object | null} errors - Object of errors
    * @param {string} field - Error field
    * @param {string} message - Error message
    * @return {void | string[]}
    */
    static buildError(errors = {}, field, message) {
        if (!field) {
            return;
        }

        const error = errors[field];

        return error && Array.isArray(error) ? error.concat(message) : [message];
    }
}

module.exports = Middleware;
