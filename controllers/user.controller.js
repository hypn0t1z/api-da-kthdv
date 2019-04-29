const AccountModel = require('../database/models/01-account.model');
const ProfileModel = require('../database/models/12-profile.model');
const AddressModel = require('../database/models/02-address.model');
const ProviderModel = require('../database/models/06-provider.model');
const ImageModel = require('../database/models/10-images-service.model');
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
    
    /**
     * Get info provider
     * @param {*} req 
     * @param {*} res 
     */
    static async getProvider(req, res) {
        const {id} = req.params;
        let user = await AccountModel.findOne({where: { id, status: 'Active' }});
        if (!user) {
            return this.sendResponseMessage(res, 404, 'Tài khoản này không tồn tại hoặc chưa xác nhận email');
        }

        //check is provider
        if ((user.role & 0b010) === 0)
            return this.sendResponseMessage(res, 400, 'This account is not provider')

        const provider = await ProviderModel.findOne({where: {account_id: id}, include: [ AddressModel, ImageModel ]});
        let check_images = await ImageModel.findOne({ where: { provider_id: 2 } });
        let data = {
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
            images: provider && provider.images_services ? provider.images_services : ''
        }
        return this.sendResponseMessage(res, 200, "Get provider success", data)
    }

    /**
     * Create provider
     * @description: Check if exist provider, if existed --> Update , else --> Create
     * 
     * @param {*} req images = [{ path: '{base64String}', description: '(option)' }, 
     *                          { path: '{base64String}', description: '(option)' }] 
     * @param {*} res 
     */
    static async createProvider(req, res) {
        const {id} = req.params;
        const { identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more, latitude, longtitude, images } = req.body;
        let account = await AccountModel.findOne({ where: { id, status: 'Active' } });
        account.update({ role: 0b010|account.role });
        const provider = await ProviderModel.findOne({ where: { account_id: id }, include: [ AddressModel ]});
        let address = '';
        let message = '';
        if(provider){
            if(provider.address){
                address = await provider.address.update({
                    province: addr_province ? addr_province : provider.address.province,
                    district: addr_district ? addr_district : provider.address.district,
                    ward: addr_ward ? addr_ward : provider.address.ward,
                    addr_more: addr_more ? addr_more : provider.address.addr_more,
                })
            }
            else{
                address = await AddressModel.create({
                    province: addr_province,
                    district: addr_district,
                    ward: addr_ward,
                    addr_more
                })
            }
            await provider.update({
                identity_card: identity_card ? identity_card : provider.identity_card,
                open_time: open_time ? open_time : provider.open_time,
                close_time: close_time ? close_time : provider.close_time,
                phone: phone ? phone : provider.phone,
                address_id: address.id ,
                latitude: latitude ? latitude : provider.latitude,
                longtitude: longtitude ? longtitude : provider.longtitude
            })
            message = 'Cập nhật nhà cung cấp dịch vụ thành công';        
        }
        else{
            address = await AddressModel.create({
                province: addr_province,
                district: addr_district,
                ward: addr_ward,
                addr_more
            });
            await ProviderModel.create({
                account_id: id,
                status_id: 1,
                identity_card: identity_card ? identity_card : '',
                open_time: open_time ? open_time : '',
                close_time: close_time ? close_time : '',
                phone: phone ? phone : '',
                address_id: address.id ,
                latitude: latitude ? latitude : '00.00',
                longtitude: longtitude ? longtitude : '00.00'
            })
            message = 'Thêm mới nhà cung cấp dịch vụ thành công'
        }
        if(images.length > 0){
            let check_images = await ImageModel.findAll({ where: { provider_id: provider.id } });
            if(check_images && Object.keys(check_images).length){
                for(let i in check_images) {
                    check_images[i].destroy();
                }
            }
            for( let i in images ){
                await ImageModel.create({
                    provider_id: provider.id,
                    path: await CommonService.uploadImage(images[i].path),
                    description: images[i].description
                })
            }
        }
        return this.sendResponseMessage(res, 200, message)
    }

    /**
     * Get account by id
     * @param {*} req 
     * @param {*} res 
     */
    static async getAccount(req, res) {
        const {id} = req.params;

        const account = await AccountModel.findOne({ where: {id}, include: [ProfileModel]})

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
    static async blockAccount(req, res){
        const {id} = req.params;
        let user = req.user;
        if ((user.role & 0b100) === 0){
            return this.sendResponseMessage(res, 401, 'Không được phép')
        }
        let check_account = await AccountModel.findOne({ where: { id, status: 'Active' }});
        if(check_account){
            if(check_account.role == 0b100){
                return this.sendResponseMessage(res, 401, 'Không thể xoá tài khoản Admin');
            }else{
                await check_account.update({
                    status: 'Banned',
                    role: 0b000,
                })
            }
        }else{
            return this.sendResponseMessage(res, 404, 'Tài khoản đã bị chặn hoặc không tồn tại');
        }
        return this.sendResponseMessage(res, 200, 'Chặn thành công', check_account);
    }

    /**
     * Check profile with account id
     * @param {id} req  
     * @param {*} res 
     */
    static async isExistProfile(req, res){
        const { id } = req.params; // account_id
        let profile = await ProfileModel.findOne({ where: { account_id: id }, include: [ AddressModel ] });
        if(profile){
            return this.sendResponseMessage(res, 200,  'Profile Existed', profile)
        }
        return this.sendResponseMessage(res, 404,  'Bạn chưa có thông tin cá nhân. Vui lòng tạo thông tin và thử lại')
    }

    /**
     * Get profile info
     * @param {*} req 
     * @param {*} res 
     * @author Tuan Tien Ty
     */
    static async getUserProfile(req, res) {
        const {id} = req.params;

        const profile = await ProfileModel.findOne({ where: { account_id: id }, include: [AddressModel] })
        if (!profile)
            return this.sendResponseMessage(res, 404, "profile with this id not found", {});

        if (!profile.full_name || !profile.avatar || !profile.birthday || !profile.address_id)
            return this.sendResponseMessage(res, 404, "profile not complete", profile)

        return this.sendResponseMessage(res, 200, "get profile success", profile)
    }

    /**
     * Create profile
     * @param {*} req 
     * @param {*} res 
     */
    static async createProfile(req, res) {
        const { id } = req.user;
        const {province, district, ward, address_more, birthday, avatar} = req.body;
        let image = avatar ? CommonService.uploadImage(avatar) : '';
        let address = await AddressModel.create({
            province,
            district,
            ward,
            address_more
        });
        await ProfileModel.create({
            account_id: id,
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
        const {province, district, ward, address_more, birthday, avatar} = req.body;
        let profile = await ProfileModel.findOne({where: { account_id: id }, include: [AddressModel] });
        let address = {};
        if(profile.address){
            address = await profile.address.update({
                province: province ? province : profile.province,
                district: district ? district : profile.province,
                ward: ward ? ward : profile.ward,
                address_more: address_more ? address_more : profile.address_more,
            })
        }else{
            address = await AddressModel.create({
                province,
                district,
                ward,
                address_more
            })
        }
        let image = avatar ? CommonService.uploadImage(avatar) : profile.avatar;
        await profile.update({
            avatar: image,
            address_id: address.id,
            birthday: birthday ? birthday : profile.birthday,
            status: 'updated'
        })
        return this.sendResponseMessage(res, 200, 'Cập nhật thông tin thành công')
    }

    static async updateProvider(req, res) {
        const {id} = req.params;
        const { identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more, latitude, longtitude, images } = req.body;
        let account = await AccountModel.findOne({ where: { id, status: 'Active' } });
        account.update({ role: 0b010|account.role });
        const provider = await ProviderModel.findOne({ where: { account_id: id }, include: [ AddressModel ]});
        let address = '';
        let message = '';
        if(provider){
            if(provider.address){
                address = await provider.address.update({
                    province: addr_province ? addr_province : provider.address.province,
                    district: addr_district ? addr_district : provider.address.district,
                    ward: addr_ward ? addr_ward : provider.address.ward,
                    addr_more: addr_more ? addr_more : provider.address.addr_more,
                })
            }
            else{
                address = await AddressModel.create({
                    province: addr_province,
                    district: addr_district,
                    ward: addr_ward,
                    addr_more
                })
            }
            await provider.update({
                identity_card: identity_card ? identity_card : provider.identity_card,
                open_time: open_time ? open_time : provider.open_time,
                close_time: close_time ? close_time : provider.close_time,
                phone: phone ? phone : provider.phone,
                address_id: address.id ,
                latitude: latitude ? latitude : provider.latitude,
                longtitude: longtitude ? longtitude : provider.longtitude
            })
            message = 'Cập nhật nhà cung cấp dịch vụ thành công';
        }
        else{
            address = await AddressModel.create({
                province: addr_province,
                district: addr_district,
                ward: addr_ward,
                addr_more
            });
            await ProviderModel.create({
                account_id: id,
                status_id: 1,
                identity_card: identity_card ? identity_card : '',
                open_time: open_time ? open_time : '',
                close_time: close_time ? close_time : '',
                phone: phone ? phone : '',
                address_id: address.id ,
                latitude: latitude ? latitude : '00.00',
                longtitude: longtitude ? longtitude : '00.00'
            })
            message = 'Thêm mới nhà cung cấp dịch vụ thành công'
        }
        if(images.length > 0){
            let check_images = await ImageModel.findAll({ where: { provider_id: provider.id } });
            if(check_images && Object.keys(check_images).length){
                for(let i in check_images) {
                    check_images[i].destroy();
                }
            }
            for( let i in images ){
                await ImageModel.create({
                    provider_id: provider.id,
                    path: await CommonService.uploadImage(images[i].path),
                    description: images[i].description
                })
            }
        }
        return this.sendResponseMessage(res, 200, 'Cập nhật thông tin thành công')
    }
}

module.exports = UserController;
