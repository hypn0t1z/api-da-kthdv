const Middleware = require('./middleware');
const AccountModel = require('../database/models/01-account.model')

class UserMiddleware extends Middleware {
    static async getUserByPhone(req, res, next) {
        next()
    }

    static async getUserProfile(req, res, next) {
        const {id} = req.params;
        const user = await AccountModel.findOne( { where: {id} } )
        if (!user)
            return this.sendResponseMessage(res, 404, "user with this this id not found!")

        next()
    }
}

module.exports = UserMiddleware;
