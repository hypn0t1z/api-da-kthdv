const Middleware = require('./middleware');

class ProviderMiddleware extends Middleware {
    static async near(req, res, next){
        let { mylat = 0, mylon = 0, dist = 10 } = req.query;
        if (!mylat || !mylon)
            return this.sendResponseMessage(res, 400, "Parameter not enough: latitude, longtitude")
        next()
    }
}

module.exports = ProviderMiddleware;
