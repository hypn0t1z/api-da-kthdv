const Controller = require('./controller');
const ServiceModel = require('../database/models/08-service.model');
const ProviderModel = require('../database/models/21-provider.model');
const AddressModel = require('../database/models/02-address.model');
const ServiceTypeModel = require('../database/models/07-service-type.model');
const CommonService = require('../services/common.service');
const {sequelize, Sequelize} = require('sequelize');
const Op = Sequelize.Op;

class ServiceController extends Controller {

    /**
     * Get list service by provider_id
     * @param {*} req 
     * @param {*} res 
     */
    static async getList(req, res) {
        const { id } = req.query;
        let check_service = await ServiceModel.findOne({ where: { provider_id: id } });
        let services = {};
        if(check_service && Object.keys(check_service).length){
            services = await ServiceModel.findAll({ where: { provider_id: id }, include: [ServiceTypeModel]});
            return this.sendResponseMessage(res, 200, "Lấy danh sách dịch vụ thành công", services)
        }
        return this.sendResponseMessage(res, 200, "Không tìm thấy dịch vụ");
    }

    /**
     * Get list Service Types
     */
    static async getListServiceType(req, res) {
        let types = await ServiceTypeModel.findAll();
        let total = types.length;
        return this.sendResponseMessage(res, 200, 'Đã tìm thấy ' + total+ ' kết quả', types)
    }

    /**
     * Get form create Service 
     * @param {*} req 
     * @param {*} res 
     */
    static async getCreate(req, res) {
        let service_types = await ServiceTypeModel.findAll();
        let serviceDt = {
            price_min: '',
            price_max: '',
            service_type_id: ''
        };
        let data = {
            service: serviceDt,
            service_types
        }
        return this.sendResponseMessage(res, 200, "Lấy thông tin tạo dịch vụ thành công", data);
    }

    /**
     * Create service
     * body : "serviceDt": {
            "price_min": 15000,
            "price_max": 50000,
            "service_type_id": 2
        };
     */
    static async createService(req, res) {
        const {serviceDt} = req.body;
        let provider = await ProviderModel.findOne({ where: { account_id: req.user.id } });
        await ServiceModel.create({
            provider_id: provider.id,
            price_min: serviceDt.price_min,
            price_max: serviceDt.price_max,
            service_type_id: serviceDt.service_type_id
        })
        return this.sendResponseMessage(res, 200, "Tạo mới dịch vụ thành công");
    }

    /**
     * Get edit info service by id service
     * @param {*} req 
     * @param {*} res 
     */
    static async getEdit(req, res) {
        const { id } = req.params;
        let service = await ServiceModel.findOne({ where: { id } });
        let service_types = await ServiceTypeModel.findAll();
        let serviceDt = {};
        if( service ){
            serviceDt = {
                price_min: service.price_min,
                price_max: service.price_max,
                service_type_id: serviceDt.service_type_id
            }
        }else{
            return this.sendResponseMessage(res, 404, "Không tìm thấy dịch vụ"); 
        }
        let data = {
            serviceDt,
            service_types
        }
        return this.sendResponseMessage(res, 200, "Lấy thông tin chỉnh sửa dịch vụ thành công", data);
    }

    /**
     * Update Service by service id
     * @param {*} req 
     * @param {*} res 
     */
    static async updateService(req, res) {
        const { serviceDt } = req.body;
        const { id } = req.params;
        let service = await ServiceModel.findOne({ where: { id } });
        let data = await service.update({
            price_min: serviceDt.price_min,
            price_max: serviceDt.price_max,
            service_type_id: serviceDt.service_type_id
        })
        return this.sendResponseMessage(res, 200, "Cập nhật thông tin dịch vụ thành công", data );
    }

    /**
     * Delete a service by service id
     * @param { id } req
     * @param {*} res
     * @author Hung Dang
     */
    static async deleteService(req, res) {
        const { id } = req.params; // service_id
        let service = await ServiceModel.findOne({ where: { id } });
        if(!service){
            return this.sendResponseMessage(res, 404, "Không tìm thấy dịch vụ");
        }
        let { provider_id } = service;
        await service.destroy();
        let services = await ServiceModel.findAll({ where: { provider_id } });
        return this.sendResponseMessage(res, 200, "Xoá dịch vụ thành công", services);
    }

    /**
     * Get providers by a service type array
     */
    static async getProviderByType(req, res){
        let { typeIds, mylat = 0,  mylon = 0, dist = 10 } = req.body;
        mylat = parseFloat(mylat);
        mylon = parseFloat(mylon);
        dist = parseFloat(dist);
        let lon1 = mylon-dist/Math.abs(Math.cos(mylat)*69);
        let lon2 = mylon+dist/Math.abs(Math.cos(mylat)*69);
        let lat1 = mylat-(dist/69);
        let lat2 = mylat+(dist/69);
        const providers = await ProviderModel.findAll({
            where: {
                status: 'ON',
                latitude: {
                    [Op.between]: [lat1, lat2]
                },
                longtitude: {
                    [Op.between]: [lon1, lon2]
                }
            },
            include: [
                {
                    required: false,
                    model: AddressModel
                }
            ]
        });
        let data = [];
        for(let i in providers){
            const services = await ServiceModel.findAll({ 
                where: {
                    provider_id: providers[i].account_id,
                    service_type_id: {
                        [Op.in]: typeIds
                    }  
                }
            });
            if(services.length > 0){
                let found_service = [];
                for(let service of services){
                    found_service.push(service.id);
                }
                data.push({
                    account_id: providers[i].account_id,
                    address_id: providers[i].address_id,
                    name: providers[i].name,
                    open_time: providers[i].open_time,
                    close_time: providers[i].close_time,
                    longtitude: providers[i].longtitude,
                    latitude: providers[i].latitude,
                    phone: providers[i].phone,
                    address: providers[i].address,
                    found_service
                })
            }
        }
        return this.sendResponseMessage(res, 200, `Đã tìm thấy ${data.length} nhà cung cấp`, data);
    }
}
module.exports = ServiceController