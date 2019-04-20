const AccountModel = require('../database/models/01-account.model');
class UserController {
    static async getUserByPhone(req, res) {
        const { phone } = req.params;
        console.log(phone)
        const user = await AccountModel.findOne({ where: { phone } });
        if (user) {
            return res.status(200).send({message: "user exist"})
        } else
            return res.status(404).send({message: "user not exist"})
    }
}

module.exports = UserController;
