const fs = require('fs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET: secretOrKey } = process.env;
const ProvinceModel = require('../database/models/15-devvn_tinhthanhpho.model');
const DistrictModel = require('../database/models/14-devvn_quanhuyen.model');
const WardModel = require('../database/models/16-devvn_xaphuongthitran.model');
class CommonService {

    /**
    * Handle upload image
    */
    static async uploadImage(base64String){
        // Init
        const root_folder = __dirname.split('services')[0];
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';

        // Process
        let file_name = '';
        for (let i = 0; i < 6; i++) {
            let random = (Math.random() * (charset.length - 1 - 0) + 0) | 0;

            file_name += charset[random];
        }
        file_name = file_name + new Date().getTime();
        if(base64String){
            let dest = `${root_folder}static/images`;
            fs.writeFile(`${file_name}.png`, base64String, {encoding: 'base64'}, function(err) {
                fs.createReadStream(`${root_folder}/${file_name}.png`).pipe(fs.createWriteStream(`${dest}/${file_name}.png`));
                fs.unlink(`${root_folder}/${file_name}.png`, (err) => {});
            });
            return `images/${file_name}.png`;
        }else{
            return false;
        }
    }

    /**
    * Paginate list datas
    * @paginate true
    * @return {void}
    */
    static async paginate(resource){
        // Init
        const { model, req, where, order, include } = resource;
        const per_page = req.query.per_page && req.query.per_page > 1 ? parseInt(req.query.per_page) : 10;
        const total = await model.count({ where });
        const last_page = Math.ceil(total / per_page) || 0;
        const current_page = req.query.page && req.query.page > 0 && req.query.page <= last_page ? parseInt(req.query.page) : 1;
        const offset = (current_page - 1) * per_page;

        // Process
        let data = await model.findAll({
            limit: per_page,
            offset,
            where,
            order: order ? order : [ ['id', 'DESC'] ],
            include: include ? include : [],
        });
        console.log(data)
        return {
            total,
            per_page,
            current_page,
            last_page,
            data
        };
    }
    /**
     * 01|002|00040
     * @param {*} query 
     */
    static async getAddress(query){
        let province = query.substr(0,2);
        let district = query.substr(2,3);
        let ward = query.substr(5,9);
        let address = await ProvinceModel.findOne({ 
            where: { matp: province }, 
            include: { 
                model: DistrictModel, 
                where: { maqh: district }, 
                include: {
                    model: WardModel,
                    where: { xaid: ward }
                } 
            }})
        return { address }
    }
}

module.exports = CommonService;
