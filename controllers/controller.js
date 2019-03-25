/**
* @module Controller
*/
/**
* Abstract class describes ATD for the CRUD usage
* @class
* @abstract
* @static
* @hideconstructor
* @property {object} model - Sequelize model instance @see {@link http://docs.sequelizejs.com/class/lib/model.js~Model.html}
*/
class Controller {
    /**
    * Getter method
    * @abstract
    * @static
    * @readonly
    * @throws {Error} Abstract method
    * @returns {object} - returns Sequelize model instance @see {@link http://docs.sequelizejs.com/class/lib/model.js~Model.html}
    */
    static get model() {
        throw new Error('Abstract method!');
    }

    /**
    * Gets collection
    * @async
    * @static
    * @param {object} req - Express request object @see {@link http://expressjs.com/en/api.html#req}
    * @param {object} res - Express response object @see {@link http://expressjs.com/en/api.html#res}
    * @returns {Promise<object[]>}
    */
    static async all(req, res) {
        return res.send(await this.model.findAll());
    }

    /**
    * Gets Sequelize model by id
    * @async
    * @static
    * @param {object} req - Express request object @see {@link http://expressjs.com/en/api.html#req}
    * @param {object} res - Express response object @see {@link http://expressjs.com/en/api.html#res}
    * @returns {Promise<object>}
    */
    static async show(req, res) {
        const { id } = req.params;
        return res.send(await this.model.findById(id));
    }

    /**
    * Creates Sequelize model
    * @async
    * @static
    * @param {object} req - Express request object @see {@link http://expressjs.com/en/api.html#req}
    * @param {object} res - Express response object @see {@link http://expressjs.com/en/api.html#res}
    * @returns {Promise<object>}
    */
    static async create(req, res) {
        return res.send(await this.model.create(req.body));
    }

    /**
    * Updates Sequelize model by id
    * @async
    * @static
    * @param {object} req - Express request object @see {@link http://expressjs.com/en/api.html#req}
    * @param {object} res - Express response object @see {@link http://expressjs.com/en/api.html#res}
    * @returns {Promise<object>}
    */
    static async update(req, res) {
        const { params: { id }, body } = req;
        const model = await this.model.findById(id);

        await model.update(body);

        return res.send(model);
    }

    /**
    * Destroys Sequelize model by id
    * @async
    * @static
    * @param {object} req - Express request object @see {@link http://expressjs.com/en/api.html#req}
    * @param {object} res - Express response object @see {@link http://expressjs.com/en/api.html#res}
    * @returns {Promise<Object>}
    */
    static async destroy(req, res) {
        const { id } = req.params;
        const model = await this.model.findById(id);

        return res.send(await model.destroy());
    }
}

module.exports = Controller;
