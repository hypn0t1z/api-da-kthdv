const Sequelize = require('sequelize');
const config = require('./config');

require('dotenv').config();

const { NODE_ENV, DB_DEBUG } = process.env;

/**
* @typedef {Object} Database
* @property {function} connect
* @property {DefaultOptions} defaultOptions
*/

/**
* This class describes connecting to the database.
*/
class Database {
    /**
    * @returns {Database}
    */
    constructor() {
        this.sequelize = new Sequelize({ ...this.defaultOptions, ...config });
    }
    /**
    * @typedef {Object} DefaultOptions
    * @property {string} dialect
    * @property {boolean} logging
    */

    /**
    * This property returns default database's config.
    *
    * @returns {DefaultOptions}
    */
    get defaultOptions() {
        return {
            dialect: 'mysql',
            logging: NODE_ENV !== 'PROD' && JSON.parse(DB_DEBUG) ? console.log : false,
            define: {
                charset: 'utf8',
                dialectOptions: {
                    collate: 'utf8_general_ci'
                },
            },
        };
    }

    /**
    * This method reconnects to the database.
    *
    * @param {object | string} options
    * @returns {Sequelize}
    */
    reconnect(options) {
        if (typeof options === 'string') {
            return (this.sequelize = new Sequelize(options, this.defaultOptions));
        }

        return (this.sequelize = new Sequelize({ ...this.defaultOptions, ...options }));
    }
}

const db = new Database();

exports.db = db;
exports.Database = Database;
exports.sequelize = db.sequelize;
exports.Sequelize = Sequelize;
