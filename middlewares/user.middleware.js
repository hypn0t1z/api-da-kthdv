const Middleware = require('./middleware');

class UserMiddleware extends Middleware {
    static async getUserByPhone(req, res, next) {
        next()
    }
}

module.exports = UserMiddleware;
