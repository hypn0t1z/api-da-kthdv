const passport = require('passport');
const Middleware = require('./middleware');
const FieldsMiddleware = require('./fields.middleware');
const AccountModel = require('../database/models/01-account.model');
const ActiveTokenModel = require('../database/models/active-token.model')
const bcrypt = require('bcryptjs');
const validator = require('validator');
const moment = require('moment');

/**
 * This middleware validates authenticate user by JWT header.
 */
exports.accessToken = passport.authenticate('jwt', {session: false});

class AuthMiddleware extends Middleware {
    /**
     * Validate register request
     */
    static async login(req, res, next) {
        const {value, password} = req.body;
        let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let phoneRegex = /^(\+91-|\+91|0)?\d{10}$/;
        let type = '';
        if (value.match(emailRegex)) {
            type = 'email'
        } else {
            if (value.match(phoneRegex))
                type = 'phone'
            else
                return this.sendResponseMessage(res, 400, 'Email hoặc số điện thoại không đúng định dạng');
        }
        const message = FieldsMiddleware.simpleCheckRequired(
            {[type]: value, password},
            [
                type,
                'password'
            ],
            [
                'Email hoặc số điện thoại không được bỏ trống',
                'Mật khẩu không được bỏ trống',
            ]
        );

        if (message) {
            return this.sendResponseMessage(res, 400, message);
        }

        const user = await AccountModel.findOne({where: {[type]: value}});
        if (!user) {
            return this.sendResponseMessage(res, 400, 'Email hoặc số điện thoại không đúng')
        } else {
            if (user.status == 'Banned') {
                return this.sendResponseMessage(res, 403, 'Tài khoản này đã bị cấm')
            }

            if (user.status == 'Inactive') {
                return this.sendResponseMessage(res, 403, 'Tài khoản này chưa được xác nhận')
            }
        }

        if (user && !(await bcrypt.compare(password, user.password))) {
            return this.sendResponseMessage(res, 400, 'Mật khẩu không đúng!')
        }

        next();
    }

    /**
     * Check email or phone number before create register form
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    static async beforeRegister(req, res, next) {
        const {email, phone} = req.body;
        let phoneRegex = /^(\+91-|\+91|0)?\d{10}$/;
        const message = FieldsMiddleware.simpleCheckRequired(
            {email, phone},
            [
                'email',
                'phone',
            ],
            [
                'Email không được bỏ trống',
                'Số điện thoại không được bỏ trống',
            ]
        );

        if (message) {
            return this.sendResponseMessage(res, 400, message);
        }
        if (!validator.isEmail(email)) {
            return this.sendResponseMessage(res, 400, 'Email không đúng định dạng');
        }
        if (!phone.match(phoneRegex)) {
            return this.sendResponseMessage(res, 400, 'Số điện thoại không đúng định dạng')
        } else {
            const userByEmail = await AccountModel.findOne({where: {email}});
            const userByPhone = await AccountModel.findOne({where: {phone}});

            if (userByEmail) {
                return this.sendResponseMessage(res, 400, 'Email này đã được sử dụng')
            }
            if (userByPhone) {
                return this.sendResponseMessage(res, 400, 'Số điện thoại này đã được sử dụng')
            }
        }

        next();
    }

    /**
     * Validate register request
     */
    static async register(req, res, next) {
        const {email, phone, password = ''} = req.body;
        const errors = {};
        let phoneRegex = /^(\+91-|\+91|0)?\d{10}$/;

        const required = FieldsMiddleware.simpleCheckRequired(
            {email, phone, password},
            [
                'email',
                'phone',
                'password',
            ],
            [
                'Email không được bỏ trống',
                'Số điện thoại không được bỏ trống',
                'Mật khẩu không được bỏ trống',
            ]
        );

        if (required) {
            return this.sendResponseMessage(required, res);
        }

        if (!validator.isEmail(email)) {
            return this.sendResponseMessage(res, 400, 'Email không đúng định dạng');
        }
        if (!phone.match(phoneRegex)) {
            return this.sendResponseMessage(res, 400, 'Số điện thoại không đúng định dạng');
        } else {
            const userByEmail = await AccountModel.findOne({where: {email}});
            const userByPhone = await AccountModel.findOne({where: {phone}});

            if (userByEmail) {
                return this.sendResponseMessage(res, 400, 'Email này đã được sử dụng')
            }
            if (userByPhone) {
                return this.sendResponseMessage(res, 400, 'Số điện thoại này đã được sử dụng')
            }
        }
        if (validator.contains(password, " ")) {
            return this.sendResponseMessage(res, 400, 'Mật khẩu không được chưa khoảng trắng');
        }

        if (!validator.isLength(password, {min: 6})) {
            return this.sendResponseMessage(res, 400,
                'Độ dài mật khẩu yêu cầu ít nhất 6 kí tự!'
            );
        }

        next();
    }

    /**
     * Validate profile request
     */
    static async createProfile(req, res, next) {
        const {province, district, ward, address_more, birthday} = req.body;
        const {id} = req.params;
        const message = FieldsMiddleware.simpleCheckRequired(
            {province, district, ward, address_more, birthday},
            [
                'province',
                'district',
                'ward',
                'address_more',
                'birthday',
            ],
            [
                'Tỉnh/Thành phố không được bỏ trống',
                'Quận/Huyện không được bỏ trống',
                'Phường/Xã không được bỏ trống',
                'Bạn không thể bỏ trống trường này',
                'Ngày sinh không được bỏ trống',
            ]
        );

        if (message) {
            return this.sendResponseMessage(res, 400, message)
        }

        let user = await AccountModel.findOne({where: {id, status: 'Active'}});
        if (!user) {
            return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại hoặc chưa được xác nhận');
        }
        next();
    }

    /**
     * Validate forgot password request
     */
    static async forgotPassword(req, res, next) {
        const {email, url, password, c_password, token} = req.body;
        const errors = {};
        if (!token) {
            const message = FieldsMiddleware.simpleCheckRequired(
                {email},
                [
                    'email',
                ],
                [
                    'Email không được bỏ trống',
                ]
            );

            if (message) {
                return this.sendResponseMessage(res, 400, message);
            }

            if (!validator.isEmail(email)) {
                return this.sendResponseMessage(res, 400, 'Email không đúng định dạng');
            }

            const user = await AccountModel.findOne({where: {email: email}});
            if (!user) {
                return this.sendResponseMessage(res, 400, 'Tài khoản này không tồn tại');
            }
        } else {
            let now = new moment().format();
            let user = await AccountModel.findOne({where: {forgot_token: token}});
            if (user) {
                let expired = moment(user.updatedAt).add(12, 'hours').toISOString();
                if (now <= expired) {
                    const message = FieldsMiddleware.simpleCheckRequired(
                        {password, c_password},
                        [
                            'password',
                            'c_password',
                        ],
                        [
                            'Mật khẩu không được bỏ trống',
                            'Xác nhận mật khẩu không được bỏ trống',
                        ]
                    );

                    if (message) {
                        return this.sendResponseMessage(res, 400, message)
                    }

                    if (password !== c_password) {
                        return this.sendResponseMessage(res, 400, 'Mật khẩu và xác nhận không khớp!');
                    }

                    if (!validator.isLength(password, {min: 6})) {
                        return this.sendResponseMessage(res, 400, 'Độ dài mật khẩu yêu cầu ít nhất 6 kí tự!');
                    }
                } else {
                    return this.sendResponseMessage(res, 403, 'Đường dẫn không tìm thấy, hoặc hết hạn');
                }
            }
        }

        next();
    }

    /**
     * Confirm email
     */

    static async confirmRegister(req, res, next) {
        //do some thing
        console.log("confirm register")
        next()
    }

    static async isTokenStillAlive(req, res, next) {
        const {token} = req.params;

        const activeToken = await ActiveTokenModel.findOne({where: {token: token}})

        if (!activeToken) {
            return this.sendResponseMessage(res, 401, 'Token was dead, hmm!')
        } else
            return this.sendResponseMessage(res, 200, 'Token is still alive, be fun')
    }


    /**
     * Upload file
     */

    static async uploadAvatar(request, response, next) {
        next();
    }
}

exports.AuthMiddleware = AuthMiddleware;
