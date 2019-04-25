const Controller = require('./controller');
const AddressModel = require('../database/models/02-address.model');
const CommonService = require('../services/common.service');
const WardModel = require('../database/models/16-devvn_xaphuongthitran.model');
const DistrictModel = require('../database/models/14-devvn_quanhuyen.model');
const ProvinceModel = require('../database/models/15-devvn_tinhthanhpho.model');
const AccountModel = require('../database/models/01-account.model');

class AddressController extends Controller {
    /**
     * Function get all addresses in Viet Nam
     * @param {*} req 
     * @param {*} res 
     */
    static async getAllAddress(req, res) {
       let addresses = await ProvinceModel.findAll({ include: { model: DistrictModel, include: [WardModel] } });
       return this.sendResponseMessage(res, 200, "get all addresses success", addresses)
    }

    /**
     * Get detail a address
     * http://localhost:3002/api/address/detail?address=01001000040
     * @param {*} req.address //01002000040 (option)
     * @param {*} res 
     */
    static async getDetailAddress(req, res) {
        const {address} = req.query;
        let result = await CommonService.getAddress(address);
        return this.sendResponseMessage(res, 200, "get detail address success", result)
    }

    static async test(req, res) {
        const {id, order_id, status, price_amount, price_currency, receive_currency, receive_amount, pay_amount, pay_currency, created_at} = req.body;
        console.log("OKOKOK");
        console.log(req);
        console.log(req.body);
        let test = await AccountModel.findOne({where: {id: 3}});
        await test.update({account_type: 'LOL'})
        return this.sendResponseMessage(res, 200, "get all addresses success", test)
    }
}
module.exports = AddressController;