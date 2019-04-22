const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const AccountModel = require('../database/models/01-account.model');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

/**
* Initial jwt auth by header.
*/
const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

require('dotenv').config();

const { JWT_SECRET: secretOrKey } = process.env;

/**
* This service describes jwt strategy.
*/
class JWTService {
    /**
    * This method generates access token by user model.
    *
    * @param {object} accountModel
    */
    static generateTokenByUser(accountModel) {
        if (!accountModel) {
            return false;
        }

        const { id, email, account_type, role } = accountModel;

        return jwt.sign(
            { id, email, account_type, role },
            secretOrKey,
        );
    }

    /**
    * This method returns jwr strategy.
    * Jwt strategy uses Authorization header.
    *
    * @example {header} Authorization: JWT access token.
    */
    static get JWTStrategy() {
        return new JwtStrategy(
            { jwtFromRequest, secretOrKey, passReqToCallback: true },
            async (req, jwtPayload, next) => {
                const { id } = jwtPayload;

                try {
                    const accountModel = await AccountModel.findOne({ where: { id } });

                    next(null, accountModel || false);
                } catch (e) {
                    next(null, false);
                }
            },
        );
    }
    
}

module.exports = JWTService;
