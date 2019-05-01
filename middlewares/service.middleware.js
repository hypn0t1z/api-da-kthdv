const Middleware = require('./middleware');
const ServiceModel = require('../database/models/08-service.model');
const ProviderModel = require('../database/models/21-provider.model');
const FieldsMiddleware = require('./fields.middleware');

class ServiceMiddleware extends Middleware {
    static async createService(req, res, next) {
        const {serviceDt} = req.body;
        let provider = await ProviderModel.findOne({ where: { account_id: req.user.id } });
        if(!provider){
            return this.sendResponseMessage(res, 404, 'This account is not provider')
        }
        const message = FieldsMiddleware.simpleCheckRequired(
            { price_min: serviceDt.price_min, price_max: serviceDt.price_max, service_type_id: serviceDt.service_type_id },
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

    static async updateService(req, res, next) {
        const {serviceDt} = req.body;
        const { id } = req.params;
        let service = await ServiceModel.findOne({ where: { id } });
        let provider = await ProviderModel.findOne({ where: { account_id: req.user.id } });
        if(!provider){
            return this.sendResponseMessage(res, 404, 'This account is not provider')
        }
        if(!service){
            return this.sendResponseMessage(res, 404, "Service not found"); 
        }
        const message = FieldsMiddleware.simpleCheckRequired(
            { price_min: serviceDt.price_min, price_max: serviceDt.price_max, service_type_id: serviceDt.service_type_id },
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
}
module.exports = ServiceMiddleware;