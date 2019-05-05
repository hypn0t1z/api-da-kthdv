const Controller = require('./controller');
const ServiceModel = require('../database/models/08-service.model');
const ProviderModel = require('../database/models/21-provider.model');
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
            return this.sendResponseMessage(res, 200, "Get services success", services)
        }
        return this.sendResponseMessage(res, 200, "Not found service");
    }

    /**
     * Get list Service Types
     */
    static async getListServiceType(req, res) {
        let where = {};
        let resource = { model: ServiceTypeModel, req, where };
        let data = await CommonService.paginate(resource);
        let total = await ServiceTypeModel.count({ where });
        return this.sendResponseMessage(res, 200, 'Đã tìm thấy ' + total+ ' kết quả', data)
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
        return this.sendResponseMessage(res, 200, "Get create service success", data);
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
        return this.sendResponseMessage(res, 200, "Create service success");
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
            return this.sendResponseMessage(res, 404, "Service not found"); 
        }
        let data = {
            serviceDt,
            service_types
        }
        return this.sendResponseMessage(res, 200, "Get edit info service success", data);
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
        return this.sendResponseMessage(res, 200, "Update service success", data );
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
            return this.sendResponseMessage(res, 404, "Service not found");
        }
        let { provider_id } = service;
        await service.destroy();
        let services = await ServiceModel.findAll({ where: { provider_id } });
        return this.sendResponseMessage(res, 200, "Delete service success", services);
    }

    /**
     * Get providers by a service type array
     */
    static async getProviderByType(req, res){
        const { typeIds } = req.body;
        const services = await ServiceModel.findAll({ 
            attributes:
                [ 'id', 'service_type_id', 'price_min', 'price_max', 'provider_id'],
            where: {
                service_type_id: {
                    [Op.in]: typeIds
                }    
            },
            group: ['provider_id'] ,
            include: [{
                model: ProviderModel,
                required: true,
                attributes: ['account_id', 'address_id', 'name', 'open_time', 'close_time', 'longtitude', 'latitude'], 
            }]
        })
        return this.sendResponseMessage(res, 200, `Đã tìm thấy ${services.length} nhà cung cấp`, services);
    }
}
module.exports = ServiceController