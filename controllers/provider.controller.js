const Controller = require('./controller');
const ProviderModel = require('../database/models/21-provider.model')
const AddressModel = require('../database/models/02-address.model')


class ProviderController extends Controller {
    static async near(req, res){
        let { mylat = 0, mylon = 0, dist = 10 } = req.query;
        mylat = parseFloat(mylat);
        mylon = parseFloat(mylon);
        dist = parseFloat(dist);
        let lon1 = mylon-dist/Math.abs(Math.cos(mylat)*69);
        let lon2 = mylon+dist/Math.abs(Math.cos(mylat)*69);
        let lat1 = mylat-(dist/69);
        let lat2 = mylat+(dist/69);
        let data = [];
        const providers = await ProviderModel.findAll({ where: { status: 'ON' }, include: [AddressModel]});
        for( let provider of providers){
            let longtitude = provider.longtitude;
            let latitude = provider.latitude;
            if(((longtitude >= lon1 && longtitude <= lon2) || (longtitude >= lon2 && longtitude <= lon1)) && ((latitude >= lat1 && latitude <= lat2) || (latitude >= lat2 && latitude <= lat1)) ){
                let distance = 3956 * 2 * Math.asin( Math.sqrt( Math.pow( Math.sin((mylat - provider.latitude) * Math.PI/180 / 2), 2) + Math.cos(mylat *  Math.PI/180) * Math.cos(provider.latitude *  Math.PI/180) * Math.pow( Math.sin((mylon - provider.longtitude) *  Math.PI/180 / 2), 2) ));
                if(distance < dist){
                    data.push(provider);
                }
            }
        }
        return this.sendResponseMessage(res, 200, `Đã tìm thấy ${data.length} địa điểm`, data);
    }
}

module.exports = ProviderController;
