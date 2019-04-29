const Middleware = require('./middleware');
const AccountModel = require('../database/models/01-account.model');
const ProfileModel = require('../database/models/12-profile.model');
const FieldsMiddleware = require('./fields.middleware');

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

    /**
     * Validate before create provider
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async createProvider(req, res, next) {
        const {id} = req.params;
        const { identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more } = req.body;
        let user = await AccountModel.findOne({where: {id, status: 'Active'}});
        if (!user) {
            return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại hoặc chưa được xác nhận');
        }
        const message = FieldsMiddleware.simpleCheckRequired(
            { identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more },
            [
                'identity_card', 
                'open_time', 
                'close_time', 
                'phone', 
                'addr_province', 
                'addr_district', 
                'addr_ward',  
            ],
            [
                'Số chứng minh nhân dân không được bỏ trống',
                'Giờ mở cửa không được bỏ trống',
                'Giờ đóng cửa không được bỏ trống',
                'Số điện thoại liên hệ không được bỏ trống',
                'Tỉnh/Thành phố không được bỏ trống',
                'Quận/Huyện không được bỏ trống',
                'Phường/Xã không được bỏ trống',
            ]
        );

        if (message) {
            return this.sendResponseMessage(res, 400, message)
        }
        next();
    }

    /**
     * Get Account
     * @param {account_id} id
     * @author Hoang Tuan
     */
    static async getAccount(req, res, next) {
        const {id} = req.params;

        const account = await AccountModel.findOne({ where: {id}})
        if (!account)
            return this.sendResponseMessage(res, 404, `account with id = ${id} not found`)
        next()
    }

    /**
     * Validate profile request
     * @param { id }
     * @author Hung Dang
     */
    static async create(req, res, next) {
        const {province, district, ward, address_more, birthday, full_name} = req.body;
        const {id} = req.params; // account_id
        const message = FieldsMiddleware.simpleCheckRequired(
            {full_name, province, district, ward, address_more, birthday},
            [
                "full_name",
                'province',
                'district',
                'ward',
                'address_more',
                'birthday',
            ],
            [
                'Họ và tên không được để trống',
                'Tỉnh/Thành phố không được bỏ trống',
                'Quận/Huyện không được bỏ trống',
                'Phường/Xã không được bỏ trống',
                'Số nhà/Ngõ/Ngách không được bỏ trống',
                'Ngày sinh không được bỏ trống',
            ]
        );

        if (message) {
            return this.sendResponseMessage(res, 400, message)
        }
        if(id){
            let user = await AccountModel.findOne({where: {id, status: 'Active'}});
            if (!user) {
                return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại hoặc chưa được xác nhận');
            }
        }
        next();
    }

    static async update(req, res, next) {
        console.log("debug")
        const {province, district, ward, address_more, birthday, full_name} = req.body;
        const {id} = req.params; // account_id

        const profile = ProfileModel.findOne({ where: {account_id: id}})

        if (!profile)
            return this.sendResponseMessage(res, 400, "This account not have profile!");

        console.log(profile)

        const message = FieldsMiddleware.simpleCheckRequired(
            {full_name, province, district, ward, address_more, birthday},
            [
                "full_name",
                'province',
                'district',
                'ward',
                'address_more',
                'birthday',
            ],
            [
                'Họ và tên không được để trống',
                'Tỉnh/Thành phố không được bỏ trống',
                'Quận/Huyện không được bỏ trống',
                'Phường/Xã không được bỏ trống',
                'Số nhà/Ngõ/Ngách không được bỏ trống',
                'Ngày sinh không được bỏ trống',
            ]
        );

        if (message) {
            return this.sendResponseMessage(res, 400, message)
        }
        if(id){
            let user = await AccountModel.findOne({where: {id, status: 'Active'}});
            if (!user) {
                return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại hoặc chưa được xác nhận');
            }
        }
        next();
    }
}

module.exports = UserMiddleware;
