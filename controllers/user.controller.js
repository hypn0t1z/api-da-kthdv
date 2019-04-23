const AccountModel = require('../database/models/01-account.model');
const ProfileModel = require('../database/models/12-profile.model');
const AddressModel = require('../database/models/02-address.model');
const ProviderModel = require('../database/models/06-provider.model');
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
    
    /**
     * Get info provider
     * @param {*} req 
     * @param {*} res 
     */
    static async getProvider(req, res) {
        const {id} = req.params;
        
        const provider = await ProviderModel.findOne({where: {account_id: id}, include: [ AddressModel ]})
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
        }
        /* let x = await CommonService.getAddress('0100200040');
        res.send({x}) */
        return this.sendResponseMessage(res, 200, "get provider success", data)
    }

    /**
     * Create provider
     * @param {*} req 
     * @param {*} res 
     */
    static async createProvider(req, res) {
        const {id} = req.params;
        const { identity_card, open_time, close_time, phone, addr_province, addr_district, addr_ward, addr_more, latitude, longtitude } = req.body;
        const provider = await ProviderModel.findOne({where: {account_id: id}, include: [ AddressModel ]});
        let address = '';
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
            provider.update({
                identity_card: identity_card ? identity_card : provider.identity_card,
                open_time: open_time ? open_time : provider.open_time,
                close_time: close_time ? close_time : provider.close_time,
                phone: phone ? phone : provider.phone,
                address_id: address.id ,
                latitude: latitude ? latitude : provider.latitude,
                longtitude: longtitude ? longtitude : provider.longtitude
            })
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
        }
        return this.sendResponseMessage(res, 200, "create provider success")
    }
}

module.exports = UserController;
