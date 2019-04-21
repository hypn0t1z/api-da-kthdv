const AccountModel = require('../database/models/01-account.model');
const Controller = require('./controller')
class UserController extends Controller{
    static async getUserByPhone(req, res) {
        const { phone } = req.params;
        console.log(phone)
        const user = await AccountModel.findOne({ where: { phone } });
        if (user) {
            return this.sendResponseMessage(res, 200, "user exist!")
        } else
            return this.sendResponseMessage(res, 404, "user not exist!")
    }
}

module.exports = UserController;
