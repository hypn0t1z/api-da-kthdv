const CommonService = require('../services/common.service')
class ImageController {

    /**
     * Function get image 
     */
    static async getImage(req, res) {
        const url = req.headers.host;
        const { path } = req.query;
        if(path){
            res.send(`${url}/${path}`)
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
        return image;
    }
}

module.exports = ImageController;
