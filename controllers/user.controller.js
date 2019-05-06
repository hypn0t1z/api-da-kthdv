const AccountModel = require('../database/models/01-account.model');
const ProfileModel = require('../database/models/12-profile.model');
const AddressModel = require('../database/models/02-address.model');
const ProviderModel = require('../database/models/21-provider.model');
const ServiceModel = require('../database/models/08-service.model');
const ServiceTypeModel = require('../database/models/07-service-type.model');
const ImageModel = require('../database/models/10-images-service.model');
const RateModel = require('../database/models/11-rate.model');
const CommonService = require('../services/common.service');
const {sequelize, Sequelize} = require('sequelize');
const Controller = require('./controller');
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
        const {key_words} = req.query;
        let where = '';
        let include = '';
        if (key_words && key_words.length) {
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
                    include: [AddressModel]
                }
            ];
        } else {
            include = [{model: ProfileModel, required: false, include: [AddressModel]}];
        }
        let resource = {model: AccountModel, req, where, include};
        let data = await CommonService.paginate(resource);
        let total = await AccountModel.count({where, include});
        return this.sendResponseMessage(res, 200, 'Đã tìm thấy ' + total + ' kết quả', data)
    }

    /**
     * Get user by phone
     * @param {*} req
     * @param {*} res
     */
    static async getUserByPhone(req, res) {
        const {phone} = req.params;
        const user = await AccountModel.findOne({where: {phone}});
        if (user) {
            return this.sendResponseMessage(res, 200, "user exist!")
        } else
            return this.sendResponseMessage(res, 404, "user not exist!")
    }

    /**
     * Get all provider
     * @param {*} req
     * @param {*} res
     */
    static async getAllProvider(req, res){
        const providers =  await ProviderModel.findAll();
        return this.sendResponseMessage(res, 200, "Lấy danh sách nhà cung cấp thành công", providers);
    }

    /**
     * Get provider by provider's name or phone
     * @param {*} key_words (option)
     * @param {*} res
     * @returns { object }
     */
    static async getProviderByKeyword(req, res) {
        const {key_words} = req.query;
        let where = '';
        let include = '';
        if (key_words && key_words.length) {
            where = {
                [Op.or]: [
                    {
                        phone: {
                            [Op.like]: '%' + key_words + '%'
                        }
                    },
                    {
                        name: {
                            [Op.like]: '%' + key_words + '%'
                        }
                    },
                ],
            };
            include = [
                {
                    model: ServiceModel,
                    required: false,
                },
            ];
        } else {
            include = [{
                model: ServiceModel,
                required: false
            }];
        }
        let order = [['createdAt', 'DESC']];
        let resource = {model: ProviderModel, req, where, include, order};
        let data = await CommonService.paginate(resource);
        let total = await ProviderModel.count({where, include});
        return this.sendResponseMessage(res, 200, 'Đã tìm thấy ' + total + ' kết quả', data)
    }

    /**
     * Get info provider
     * @param {*} req
     * @param {*} res
     */
    static async getProvider(req, res) {
        const {id} = req.params; // account_id
        let user = await AccountModel.findOne({where: {id, status: 'Active'}});
        if (!user) {
            return this.sendResponseMessage(res, 404, 'Tài khoản này không tồn tại hoặc chưa xác nhận email');
        }

        //check is provider
        if ((user.role & 0b010) === 0)
            return this.sendResponseMessage(res, 400, 'This account is not provider')

        const provider = await ProviderModel.findOne({where: {account_id: id}, include: [AddressModel]});
        let data = {
            name: provider && provider.name ? provider.name : '',
            identity_card: provider && provider.identity_card ? provider.identity_card : '',
            open_time: provider && provider.open_time ? provider.open_time : '',
            close_time: provider && provider.close_time ? provider.close_time : '',
            phone: provider && provider.phone ? provider.phone : '',
            addr_province: provider && provider.address_id ? provider.address.province : '',
            addr_district: provider && provider.address_id ? provider.address.district : '',
            addr_ward: provider && provider.address_id ? provider.address.ward : '',
            addr_more: provider && provider.address_id ? provider.address.address_more : '',
            status_id: provider && provider.status_id ? provider.status_id : '',
            latitude: provider && provider.latitude ? provider.latitude : '',
            longtitude: provider && provider.longtitude ? provider.longtitude : '',
            status: provider && provider.status ? provider.status : 'ON',
        }
        const images = await ImageModel.findAll({where: {provider_id: id}});
        data.images = images;
        return this.sendResponseMessage(res, 200, "Get provider success", data)
    }

    /**
     * Create provider by account_id
     * @description: Check if exist provider, if existed --> Update , else --> Create
     *
     * @param {*} req images = [{ path: '{base64String}', description: '(option)' },
     *                          { path: '{base64String}', description: '(option)' }]
     * @param {*} res
     */
    static async createProvider(req, res) {
        const {id} = req.params; // account_id
        const {identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more, latitude, longtitude, images, name, status} = req.body;
        let account = await AccountModel.findOne({where: {id, status: 'Active'}});
        account.update({role: 0b010 | account.role});
        const provider = await ProviderModel.findOne({where: {account_id: id}, include: [AddressModel]});
        let address = '';
        let message = '';
        if (provider) {
            return this.sendResponseMessage(res, 400, "Nhà cung cấp dịch vụ đã tồn tại. Vui lòng chọn cập nhật");
        } else {
            address = await AddressModel.create({
                province: addr_province,
                district: addr_district,
                ward: addr_ward,
                address_more: addr_more
            });
            await ProviderModel.create({
                account_id: id,
                status_id: 1,
                name: name ? name : '',
                identity_card: identity_card ? identity_card : '',
                open_time: open_time ? open_time : '',
                close_time: close_time ? close_time : '',
                phone: phone ? phone : '',
                address_id: address.id,
                latitude: latitude ? latitude : '00.00',
                longtitude: longtitude ? longtitude : '00.00',
                status: status ? status.toUpperCase() : 'ON'
            })
            message = 'Thêm mới nhà cung cấp dịch vụ thành công'
        }
        if (images && images.length > 0) {
            let check_images = await ImageModel.findAll({where: {provider_id: id}});
            if (check_images && Object.keys(check_images).length) {
                for (let i in check_images) {
                    check_images[i].destroy();
                }
            }
            for (let i in images) {
                await ImageModel.create({
                    provider_id: id,
                    path: await CommonService.uploadImage(images[i].path),
                    description: images[i].description
                })
            }
        }
        return this.sendResponseMessage(res, 200, message)
    }

    /**
     * Update Provider by account_id
     */
    static async updateProvider(req, res) {
        const {id} = req.params; // account_id
        const {identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more, latitude, longtitude, images, name, status} = req.body;
        let account = await AccountModel.findOne({where: {id, status: 'Active'}});
        account.update({role: 0b010 | account.role});
        const provider = await ProviderModel.findOne({where: {account_id: id}, include: [AddressModel]});
        let address = '';
        let message = '';
        if (provider) {
            if (provider.address) {
                address = await provider.address.update({
                    province: addr_province ? addr_province : provider.address.province,
                    district: addr_district ? addr_district : provider.address.district,
                    ward: addr_ward ? addr_ward : provider.address.ward,
                    address_more: addr_more ? addr_more : provider.address.addr_more,
                })
            } else {
                address = await AddressModel.create({
                    province: addr_province,
                    district: addr_district,
                    ward: addr_ward,
                    address_more: addr_more
                })
            }
            await provider.update({
                name: name ? name : provider.name,
                identity_card: identity_card ? identity_card : provider.identity_card,
                open_time: open_time ? open_time : provider.open_time,
                close_time: close_time ? close_time : provider.close_time,
                phone: phone ? phone : provider.phone,
                address_id: address.id,
                latitude: latitude ? latitude : provider.latitude,
                longtitude: longtitude ? longtitude : provider.longtitude,
                status: status ? status.toUpperCase() : provider.status
            })
            message = 'Cập nhật nhà cung cấp dịch vụ thành công';
        } else {
            return this.sendResponseMessage(res, 404, 'Tài khoản chưa đăng kí nhà cung cấp dịch vụ');
        }
        if (images && images.length > 0) {
            let check_images = await ImageModel.findAll({where: {provider_id: id}});
            if (check_images && Object.keys(check_images).length) {
                for (let i in check_images) {
                    check_images[i].destroy();
                }
            }
            for (let i in images) {
                await ImageModel.create({
                    provider_id: id,
                    path: await CommonService.uploadImage(images[i].path),
                    description: images[i].description
                })
            }
        }
        return this.sendResponseMessage(res, 200, message)
    }

    /**
     * Delete provider
     * @param {*} req
     * @param {*} res
     */
    static async deleteProvider(req, res) {
        /* const {id} = req.params; // account_id
        const account = await AccountModel.findOne({ where: { id , status: 'Active' } });
        if(!account){
            return this.sendResponseMessage(res, 404, "Tài khoản này không tồn tại hoặc chưa xác nhận email");
        }
        if ((account.role === 0b100) || (account.role === 0b010)){
            const provider = await ProviderModel.findOne({ where: { account_id: id } });
            if(!provider){
                return this.sendResponseMessage(res, 404, "Không tìm thấy nhà cung cấp");
            }
            await provider.destroy();
            account.update({
                role: 0b001
            })
        }
        else{
            return this.sendResponseMessage(res, 401, 'Không được phép')
        } */
    }

    static async changeStatusProvider(req, res) {
        const { id, status } = req.params; //account_id
        let statusUC  = status.toUpperCase();
        const provider = await ProviderModel.findOne({ where: { account_id: id } });
        provider.update({
            status: statusUC
        });
        return this.sendResponseMessage(res, 200, 'Cập nhật trạng thái thành công');
    }

    /**
     * Get account by id
     * @param {*} req
     * @param {*} res
     */
    static async getAccount(req, res) {
        const {id} = req.params;

        const account = await AccountModel.findOne({where: {id}, include: [ProfileModel]})

        const data = {
            id: account.id,
            email: account.email,
            phone: account.phone,
            role: account.role,
            profle: account.profile
        }
        return this.sendResponseMessage(res, 200, "Get account success", data)
    }

    /**
     * Block account  /api/user/block/:id
     * @param {id}
     * @author Hung Dang
     */
    static async blockAccount(req, res) {
        const {id} = req.params;
        let user = req.user;
        if ((user.role & 0b100) === 0) {
            return this.sendResponseMessage(res, 401, 'Không được phép')
        }
        let check_account = await AccountModel.findOne({where: {id, status: 'Active'}});
        if (check_account) {
            if (check_account.role == 0b100) {
                return this.sendResponseMessage(res, 401, 'Không thể xoá tài khoản Admin');
            } else {
                await check_account.update({
                    status: 'Banned',
                    role: 0b000,
                })
            }
        } else {
            return this.sendResponseMessage(res, 404, 'Tài khoản đã bị chặn hoặc không tồn tại');
        }
        return this.sendResponseMessage(res, 200, 'Chặn thành công', check_account);
    }

    /**
     * Check profile with account id
     * @param {id} req
     * @param {*} res
     */
    static async isExistProfile(req, res) {
        const {id} = req.params; // account_id
        let profile = await ProfileModel.findOne({where: {account_id: id}, include: [AddressModel]});
        if (profile) {
            return this.sendResponseMessage(res, 200, 'Profile Existed', profile)
        }
        return this.sendResponseMessage(res, 404, 'Bạn chưa có thông tin cá nhân. Vui lòng tạo thông tin và thử lại')
    }

    /**
     * Get profile info
     * @param {*} req
     * @param {*} res
     * @author Tuan Tien Ty
     */
    static async getUserProfile(req, res) {
        const {id} = req.params;

        const profile = await ProfileModel.findOne({where: {account_id: id}, include: [AddressModel]})
        if (!profile)
            return this.sendResponseMessage(res, 404, "profile with this id not found", {});

        if (!profile.full_name || !profile.birthday || !profile.address_id)
            return this.sendResponseMessage(res, 404, "profile not complete", profile)

        return this.sendResponseMessage(res, 200, "get profile success", profile)
    }

    /**
     * Create profile with account id
     * @param {*} req
     * @param {*} res
     */
    static async createProfile(req, res) {
        const {id} = req.params; // account_id
        const {province, district, ward, address_more, birthday, avatar, full_name} = req.body;
        let profile = await ProfileModel.findOne({where: {account_id: id}});
        if (profile) {
            return this.sendResponseMessage(res, 400, "Profile is existed");
        }
        let image = avatar ? await CommonService.uploadImage(avatar) : '';
        let address = await AddressModel.create({
            province,
            district,
            ward,
            address_more
        });
        await ProfileModel.create({
            account_id: id,
            full_name,
            avatar: image,
            address_id: address.id,
            birthday: birthday ? birthday : '',
            status: 'created'
        })
        return this.sendResponseMessage(res, 200, 'Tạo thông tin thành công')
    }

    /**
     * Update profile
     * @param {*} req
     * @param {*} res
     */
    static async updateProfile(req, res) {
        const {id} = req.params;
        const {province, district, ward, address_more, birthday, avatar, full_name} = req.body;
        let profile = await ProfileModel.findOne({where: {account_id: id}, include: [AddressModel]});
        let address = {};
        if (profile.address) {
            address = await profile.address.update({
                province: province ? province : profile.province,
                district: district ? district : profile.province,
                ward: ward ? ward : profile.ward,
                address_more: address_more ? address_more : profile.address_more,
            })
        } else {
            address = await AddressModel.create({
                province,
                district,
                ward,
                address_more
            })
        }
        let image = avatar ? await CommonService.uploadImage(avatar) : profile.avatar;
        await profile.update({
            avatar: image,
            full_name: full_name ? full_name : profile.full_name,
            address_id: address.id,
            birthday: birthday ? birthday : profile.birthday,
            status: 'updated'
        })
        return this.sendResponseMessage(res, 200, 'Cập nhật thông tin thành công')
    }

    static async getProviderServices(req, res) {
        const {id} = req.params;
        let services = await ServiceModel.findAll({where: {provider_id: id}, include: [ServiceTypeModel]});
        return this.sendResponseMessage(res, 200, "Get services success", services)
    }

    static async createProviderService(req, res) {
        const {id} = req.params;
        const {price_min, price_max, service_type_id, description} = req.body;
        await ServiceModel.create({
            provider_id: id,
            price_min: price_min,
            price_max: price_max,
            service_type_id: service_type_id,
            description: description
        })
        return this.sendResponseMessage(res, 200, "Create service success");
    }

    static async updateService(req, res) {
        const {price_min, price_max, service_type_id, description} = req.body;
        const service_id = req.params.service_id;
        const id = req.params.id

        let service = await ServiceModel.findOne({ where: { id: service_id } });
        let data = await service.update({
            price_min: price_min,
            price_max: price_max,
            service_type_id: service_type_id,
            provider_id: id,
            description: description

        })
        return this.sendResponseMessage(res, 200, "Update service success", data );
    }

    static async deleteService(req, res) {
        const id = req.params.id;
        const service_id = req.params.service_id;
        let service = await ServiceModel.findOne({ where: { id: service_id } });
        await service.destroy();
        let services = await ServiceModel.findAll({ where: { provider_id: id } });
        return this.sendResponseMessage(res, 200, "Delete service success", services);
    }

    static async getProviderServicesWithId(req, res) {
        const {id, service_id} = req.params;
        let service = await ServiceModel.findOne({
            where: {
                provider_id: id,
                id: service_id
            },
            include: [ServiceTypeModel]
        });
        return this.sendResponseMessage(res, 200, "Get services success", service)
    }

    /**
     * Get Rate By rate_id
     * @param { id, rate_id }
     * @param {res}
     * @return {object}
     */
    static async getRateById(req, res){
        const {id, rate_id} = req.params;
        const rate = await RateModel.findOne({ where: { id: rate_id, customer_id: id } });
        return this.sendResponseMessage(res, 200, "Lấý thông tin đánh giá thành công", rate);
    }

    /**
     * Get Rate By provider_id
     * @param { id, rate_id }
     * @param {res}
     * @return {object}
     */
    static async getRateByProviderId(req, res){
        const {id, provider_id} = req.params;
        const rates = await RateModel.findAll({ 
            where: { provider_id }, 
            include: [
                { 
                    model: AccountModel,
                    attributes: ['email'],
                    required: false,
                    include: [{
                        model: ProfileModel,
                        attributes: ['full_name', 'avatar'],
                        required: false
                    }]
                }
            ] 
        });
        return this.sendResponseMessage(res, 200, "Lấý thông tin đánh giá thành công", rates);
    }

    static async createRate(req, res){
        const {id, provider_id} = req. params;
        const { comment, star_number } = req.body;
        let rate = await RateModel.create({
            provider_id,
            customer_id: id,
            comment: comment ? comment : '',
            star_number
        });
        return this.sendResponseMessage(res, 200, "Đánh giá thành công", rate);
    }

    static async updateRate(req, res){
        const {rate_id} = req. params;
        const { comment, star_number } = req.body;
        let rate = await RateModel.findOne( { where: { id: rate_id } });
        await rate.update({
            comment: comment ? comment : rate.comment,
            star_number: star_number ? star_number : rate.star_number
        });
        return this.sendResponseMessage(res, 200, "Cập nhật đánh giá thành công", rate);
    }
}

module.exports = UserController;
