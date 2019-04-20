const AccountModel = require('../database/models/01-account.model');
class AuthPublicController {
    /**
     * @author Tuan
     * Check phone is exist;
     */
    static async phoneExist(req, res, next) {
        const { phone } = req.body;
        const userByPhone = await AccountModel.findOne({ where: { phone } });

        if (userByPhone) {
            return res.code()
            return res.send({
                isExist: 1
            })
        } else
            return res.send({
                isExist: 0
            })
    }

}

module.exports = AuthPublicController;

