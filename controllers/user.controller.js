const AccountModel = require('../database/models/01-account.model');
const ProfileModel = require('../database/models/12-profile.model');
const CommonService = require('../services/common.service');
const { sequelize, Sequelize } = require('sequelize');
const Op = Sequelize.Op;

class UserController {
    /**
     * Get list user
     * @param {*} req { key_words (option), per_page (option)}
     * @param {*} res 
     * Get user by name, email or phone 
     */
    static async getUser(req, res) {
        const { key_words } = req.query;
        let where = '';
        let include = '';
        if(key_words && key_words.length ){
            where = { 
                status: 'Active',
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
                    where: {
                        full_name: {
                            [Op.like]: '%' + key_words + '%'
                        }
                    }
                }
            ]; 
        }
        else{
            where = { status: 'Active' };
            include = [{ model: ProfileModel }];
        }
        let resource = { model: AccountModel, req, where, include };
        let data = await CommonService.paginate(resource);
        let total = await AccountModel.count({ where, include });
        res.status(200).send({ 'message': 'Đã tìm thấy ' + total+ ' kết quả', data });
    }
}

module.exports = UserController;
