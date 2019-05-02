const Middleware = require('./middleware');
const AccountModel = require('../database/models/01-account.model');
const ProfileModel = require('../database/models/12-profile.model');
const ProviderModel = require('../database/models/21-provider.model');
const ServiceModel = require('../database/models/08-service.model')
const FieldsMiddleware = require('./fields.middleware');

class UserMiddleware extends Middleware {
    static async getUserByPhone(req, res, next) {
        next()
    }

    static async getUserProfile(req, res, next) {
        const {id} = req.params;
        const user = await AccountModel.findOne({where: {id}})
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
        const {identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more, name} = req.body;
        let user = await AccountModel.findOne({where: {id, status: 'Active'}});
        if (!user) {
            return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại hoặc chưa được xác nhận');
        }
        const message = FieldsMiddleware.simpleCheckRequired(
            {name, identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more},
            [
                'name',
                'identity_card',
                'open_time',
                'close_time',
                'phone',
                'addr_province',
                'addr_district',
                'addr_ward',
                'addr_more'
            ],
            [
                'Tên nhà cung cấp dịch vụ không được bỏ trống',
                'Số chứng minh nhân dân không được bỏ trống',
                'Giờ mở cửa không được bỏ trống',
                'Giờ đóng cửa không được bỏ trống',
                'Số điện thoại liên hệ không được bỏ trống',
                'Tỉnh/Thành phố không được bỏ trống',
                'Quận/Huyện không được bỏ trống',
                'Phường/Xã không được bỏ trống',
                'Số nhà/đường/phố/ngõ/ngách không được bỏ trống'
            ]
        );

        if (message) {
            return this.sendResponseMessage(res, 400, message)
        }
        next();
    }

    /**
     * Update provider by account_id
     * @author Hung Dang
     */
    static async updateProvider(req, res, next) {
        const {id} = req.params;
        const {identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more, name} = req.body;
        let user = await AccountModel.findOne({where: {id, status: 'Active'}});
        if (!user) {
            return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại hoặc chưa được xác nhận');
        }
        const message = FieldsMiddleware.simpleCheckRequired(
            {name, identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more},
            [
                'name',
                'identity_card',
                'open_time',
                'close_time',
                'phone',
                'addr_province',
                'addr_district',
                'addr_ward',
                'addr_more',
            ],
            [
                'Tên nhà cung cấp dịch vụ không được bỏ trống',
                'Số chứng minh nhân dân không được bỏ trống',
                'Giờ mở cửa không được bỏ trống',
                'Giờ đóng cửa không được bỏ trống',
                'Số điện thoại liên hệ không được bỏ trống',
                'Tỉnh/Thành phố không được bỏ trống',
                'Quận/Huyện không được bỏ trống',
                'Phường/Xã không được bỏ trống',
                'Số nhà/đường/phố/ngõ/ngách không được bỏ trống'
            ]
        );

        if (message) {
            return this.sendResponseMessage(res, 400, message)
        }
        next();
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static async changeStatusProvider(req, res, next){
        const { id, status } = req.params;
        const { status } = req.body;
        let statusUC  = status.toUpperCase();
        await this.isProvider(id, req, res);
        if(statusUC !== 'ON' || statusUC !== 'OFF'){
            return this.sendResponseMessage(res, 400, `Lỗi chọn trạng thái nhà cung cấp`);
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

        const account = await AccountModel.findOne({where: {id}})
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
        if (id) {
            let user = await AccountModel.findOne({where: {id, status: 'Active'}});
            if (!user) {
                return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại hoặc chưa được xác nhận');
            }
        }
        next();
    }

    static async update(req, res, next) {
        const {province, district, ward, address_more, birthday, full_name} = req.body;
        const {id} = req.params; // account_id

        const profile = await ProfileModel.findOne({where: {account_id: id}})

        if (!profile)
            return this.sendResponseMessage(res, 400, "This account not have profile!");

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
        if (id) {
            let user = await AccountModel.findOne({where: {id, status: 'Active'}});
            if (!user) {
                return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại hoặc chưa được xác nhận');
            }
        }
        next();
    }

    static async getProviderServices(req, res, next) {
        const {id} = req.params;
        await this.isProvider(id, req, res)
        next()
    }

    static async getProviderServicesWithId(req, res, next) {
        const {id, service_id} = req.params;
        await this.isProvider(id, req, res)
        await this.isServiceExist(service_id, id, req, res)
        next()
    }

    static async isProvider(user_id, req, res) {
        console.log(`check is provider with id ${user_id}`)
        const user = await AccountModel.findOne({where: {id: user_id}})
        if (!user)
            return this.sendResponseMessage(res, 404, `user with id ${user_id} not found`)

        console.log(`user role is ${user.role}`)
        if ((user.role & 0b010) === 0) {
            //this is not provider,
            return this.sendResponseMessage(res, 400, `user with id ${user_id} was not provider`)
        }

        const provider = await ProviderModel.findOne({where: {account_id: user_id}})
        if (!provider)
            return this.sendResponseMessage(res, 400, 'provider info was not set, please setup it')

    }

    static async createProviderService(req, res, next) {
        const {id} = req.params;
        await this.isProvider(id, req, res)

        const {price_min, price_max, service_type_id} = req.body;
        const message = FieldsMiddleware.simpleCheckRequired(
            { price_min: price_min, price_max: price_max, service_type_id: service_type_id },
            [
                'price_min',
                'price_max',
                'service_type_id',
            ],
            [
                'Giá dịch vụ không được bỏ trống',
                'Giá dịch vụ không được bỏ trống',
                'Vui lòng chọn loại dịch vụ',
            ]
        );
        if (message) {
            return this.sendResponseMessage(res, 400, message)
        }
        next();
    }

    static async isServiceExist(service_id, provider_id, req, res) {
        const service = await ServiceModel.findOne({
            where: {
                id: service_id,
                provider_id: provider_id
            }
        })

        if (!service)
            return this.sendResponseMessage(res, 400,
                `provider with id ${provider_id} not have service with id ${service_id}`)
    }

    static async updateService(req, res, next) {
        const id = req.params.id;
        const service_id = req.params.service_id;

        await this.isProvider(id, req, res)
        await this.isServiceExist(service_id, id, req, res)

        next()
    }

    static async deleteService(req, res, next) {
        const id = req.params.id;
        const service_id = req.params.service_id;

        await this.isProvider(id, req, res)
        await this.isServiceExist(service_id, id, req, res)

        next()
    }
}

module.exports = UserMiddleware;
