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
                return res.status(400).send({'message': 'Email hoặc số điện thoại không đúng định dạng'});
        }
        const errors = {};
        const required = FieldsMiddleware.checkRequired(
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

        if (required) {
            return this.sendRequestError(required, res);
        }

        const user = await AccountModel.findOne({where: {[type]: value}});
        if (!user) {
            errors.value = this.buildError(errors, type, 'Email hoặc số điện thoại không đúng');
        } else {
            if (user.status == 'Banned') {
                return res.status(403).send({'message': 'Tài khoản này đã bị cấm'});
            }

            if (user.status == 'Inactive') {
                return res.status(403).send({'message': 'Tài khoản này chưa được xác nhận'})
            }
        }

        if (user && !(await bcrypt.compare(password, user.password))) {
            errors.password = this.buildError(errors, 'password', 'Mật khẩu không đúng!');
        }

        if (this.isError(errors)) {
            return this.sendRequestError(errors, res);
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
        const errors = {};
        let phoneRegex = /^(\+91-|\+91|0)?\d{10}$/;
        const required = FieldsMiddleware.checkRequired(
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

        if (required) {
            return this.sendRequestError(required, res);
        }
        if (!validator.isEmail(email)) {
            errors.email = this.buildError(errors, 'email', 'Email không đúng định dạng');
        }
        if (!phone.match(phoneRegex)) {
            errors.phone = this.buildError(errors, 'phone', 'Số điện thoại không đúng định dạng');
        } else {
            const userByEmail = await AccountModel.findOne({where: {email}});
            const userByPhone = await AccountModel.findOne({where: {phone}});

            if (userByEmail) {
                errors.email = this.buildError(errors, 'email', 'Email này đã được sử dụng');
            }
            if (userByPhone) {
                errors.phone = this.buildError(errors, 'phone', 'Số điện thoại này đã được sử dụng');
            }
        }

        if (this.isError(errors)) {
            return this.sendRequestError(errors, res);
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
        // const required = FieldsMiddleware.checkRequired(
        //     {email, phone, password},
        //     [
        //         'email',
        //         'phone',
        //         'password',
        //     ],
        //     [
        //         'Email không được bỏ trống',
        //         'Số điện thoại không được bỏ trống',
        //         'Mật khẩu không được bỏ trống',
        //     ]
        // );

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
            return this.sendRequestError(required, res);
        }

        if (!validator.isEmail(email)) {
            errors.email = this.buildError(errors, 'email', 'Email không đúng định dạng');
        }
        if (!phone.match(phoneRegex)) {
            errors.phone = this.buildError(errors, 'phone', 'Số điện thoại không đúng định dạng');
        } else {
            const userByEmail = await AccountModel.findOne({where: {email}});
            const userByPhone = await AccountModel.findOne({where: {phone}});

            if (userByEmail) {
                errors.email = this.buildError(errors, 'email', 'Email này đã được sử dụng');
            }
            if (userByPhone) {
                errors.phone = this.buildError(errors, 'phone', 'Số điện thoại này đã được sử dụng');
            }
        }
        if (validator.contains(password, " ")) {
            errors.password = this.buildError(errors, 'password', 'Mật khẩu không được chưa khoảng trắng');
        }

        if (!validator.isLength(password, {min: 6})) {
            errors.password = this.buildError(
                errors,
                'password',
                'Độ dài mật khẩu yêu cầu ít nhất 6 kí tự!'
            );
        }

        if (this.isError(errors)) {
            return this.sendRequestError(errors, res);
        }
        next();
    }

    /**
     * Validate profile request
     */
    static async createProfile(req, res, next) {
        const {province, district, ward, address_more, birthday} = req.body;
        const {id} = req.params;
        const required = FieldsMiddleware.checkRequired(
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

        if (required) {
            return this.sendRequestError(required, res);
        }

        let user = await AccountModel.findOne({where: {id, status: 'Active'}});
        if (!user) {
            return res.status(404).send({'message': 'Tài khoản này không tồn tại hoặc chưa được xác nhận'});
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
            const required = FieldsMiddleware.checkRequired(
                {email},
                [
                    'email',
                ],
                [
                    'Email không được bỏ trống',
                ]
            );

            if (required) {
                return this.sendRequestError(required, res);
            }

            if (!validator.isEmail(email)) {
                errors.email = this.buildError(errors, 'email', 'Email không đúng định dạng');
            }

            const user = await AccountModel.findOne({where: {email: email}});
            if (!user) {
                errors.email = this.buildError(errors, 'email', 'Tài khoản này không tồn tại');
            }
        } else {
            let now = new moment().format();
            let user = await AccountModel.findOne({where: {forgot_token: token}});
            if (user) {
                let expired = moment(user.updatedAt).add(12, 'hours').toISOString();
                if (now <= expired) {
                    const required = FieldsMiddleware.checkRequired(
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

                    if (required) {
                        return this.sendRequestError(required, res);
                    }

                    if (password !== c_password) {
                        errors.password = this.buildError(
                            errors,
                            'password',
                            'Mật khẩu và xác nhận không khớp!'
                        );
                    }

                    if (!validator.isLength(password, {min: 6})) {
                        errors.password = this.buildError(
                            errors,
                            'password',
                            'Độ dài mật khẩu yêu cầu ít nhất 6 kí tự!'
                        );
                    }
                } else {
                    return res.status(404).send({'message': 'Đường dẫn không tìm thấy, hoặc hết hạn'});
                }
            }
        }

        if (this.isError(errors)) {
            return this.sendRequestError(errors, res);
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
            return res.status(401).send({message: 'Token was dead, hmm!'})
        } else
            return res.send({message: 'Token is still alive, be fun'})
    }


    /**
     * Upload file
     */

    static async uploadAvatar(request, response, next) {
        console.log(request.body)
        let formidable = require('formidable');
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.uploadDir = "./static";
        form.keepExtensions = true;
        form.maxFieldsSize = 10 * 1024 * 1024; //10 MB
        form.multiples = false;
        form.parse(request, (err, fields, files) => {
            if (err) {
                return response.json({
                    result: "failed",
                    data: {},
                    messege: `Cannot upload images.Error is : ${err}`
                });
            }
            console.log(JSON.stringify(files))
            //return response.send({file: files})
            // var arrayOfFiles = [];
            // if (files[""] instanceof Array) {
            //     arrayOfFiles = files[""];
            // } else {
            //     arrayOfFiles.push(files[""]);
            // }
            //
            // if (arrayOfFiles.length > 0) {
            //     var fileNames = [];
            //     arrayOfFiles.forEach((eachFile) => {
            //         // fileNames.push(eachFile.path)
            //         fileNames.push(eachFile.path.split('/')[1]);
            //     });
            //     response.json({
            //         result: "ok",
            //         data: fileNames,
            //         numberOfImages: fileNames.length,
            //         messege: "Upload images successfully"
            //     });
            // } else {
            //     response.json({
            //         result: "failed",
            //         data: {},
            //         numberOfImages: 0,
            //         messege: "No images to upload !"
            //     });
            // }
        });
        next();
    }
}

exports.AuthMiddleware = AuthMiddleware;
