const AccountModel = require('../database/models/01-account.model');
const ProfileModel = require('../database/models/12-profile.model');
const CommonService = require('../services/common.service');
const { sequelize, Sequelize } = require('sequelize');
const Controller = require('./controller')
const Op = Sequelize.Op;

class UserController extends Controller {
    /**
     * Get list user with option params: key_words, per_page, page
     * key_words: key word to search ( name, phone, email )
     * per_page: default = 10 rows
     * page: default = 1
     * @param { key_words: option, per_page: option, page: default = 1 } req
     * @param {*} res 
     * @author Hung Dang
     */
    static async getUser(req, res) {
        const { key_words } = req.query;
        let where = '';
        let include = '';
        if(key_words && key_words.length ){
            where = {
                [Op.or]: [
                    {
                        email: {
                            [Op.like]: '%' + key_words + '%'
                        }
                    },
                    {
                        phone: {
                            [Op.like]: '%' + key_words + '%'
                        }
                    },
                ],
            };
            include = [
                {
                    model: ProfileModel,
                    required: false,
                    where: {
                        full_name: {
                            [Op.like]: '%' + key_words + '%'
                        }
                    }
                }
            ]; 
        }
        else{
            include = [{ model: ProfileModel, required: false }];
        }
        let resource = { model: AccountModel, req, where, include };
        let data = await CommonService.paginate(resource);
        let total = await AccountModel.count({ where, include });
        return this.sendResponseMessage(res, 200, 'Đã tìm thấy ' + total+ ' kết quả', data)
    }

    /**
     * Get user by phone
     * @param {*} req 
     * @param {*} res 
     */
    static async getUserByPhone(req, res) {
        const { phone } = req.params;
        const user = await AccountModel.findOne({ where: { phone } });
        if (user) {
            return this.sendResponseMessage(res, 200, "user exist!")
        } else
            return this.sendResponseMessage(res, 404, "user not exist!")
    }

    static async getUserProfile(req, res) {
        const {id} = req.params;

        const profile = await ProfileModel.findOne({where: {account_id: id}})
        if (!profile)
            return this.sendResponseMessage(res, 404, "profile with this id not found", {});

        if (!profile.full_name || !profile.avatar || !profile.birthday || !profile.address_id)
            return this.sendResponseMessage(res, 404, "profile not complete", profile)

        return this.sendResponseMessage(res, 200, "get profile success", profile)
    }
}

module.exports = UserController;
