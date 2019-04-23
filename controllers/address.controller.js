const Controller = require('./controller');
const AddressModel = require('../database/models/02-address.model');
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
}
module.exports = AddressController;