const CommonService = require('../services/common.service')
const Controller = require('./controller')

class ImageController extends Controller{

    /**
     * Function get image 
     */
    static async getImage(req, res) {
        const url = req.headers.host;
        const { path } = req.query;
        if(path){
            const data  = {value: `${url}/${path}`}
            return this.sendResponseMessage(res, 200, "get image sucess", data)
        }
    }

    /**
     * Function upload image
     * @param {*} req 
     * @param {*} res 
     */
    static async uploadImage(req, res) {
        const { base64String } = req.body;
        let image = CommonService.uploadImage(base64String);
        const data = {image: image};
        return this.sendResponseMessage(res, 200, "upload image success", data);
    }
}

module.exports = ImageController;
