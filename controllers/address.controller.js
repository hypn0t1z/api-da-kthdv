const Controller = require('./controller');
const AddressModel = require('../database/models/02-address.model');
const CommonService = require('../services/common.service');
const WardModel = require('../database/models/16-devvn_xaphuongthitran.model');
const DistrictModel = require('../database/models/14-devvn_quanhuyen.model');
const ProvinceModel = require('../database/models/15-devvn_tinhthanhpho.model');

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
}
module.exports = AddressController;