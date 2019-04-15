const AccountModel = require('../database/models/01-account.model');
const JWTService = require('../services/jwt.service');
const ActiveTokenModel = require('../database/models/active-token.model');
const MailService = require('../services/mail.service');
const bcrypt = require('bcryptjs');

class AuthController {
    /**
     * Login user
     * @return {obj} token
     */
    static async login(req, res) {
        // Init
        const {value, password} = req.body;
        let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let type = value.match(emailRegex) ? 'email' : 'phone';
        const user = await AccountModel.findOne({where: {[type]: value}});
        const token = JWTService.generateTokenByUser(user);

        // Process
        const activeToken = await ActiveTokenModel.findOne({where: {user_id: user.id}})

            (activeToken && (await activeToken.update({token}))) ||
            (await ActiveTokenModel.create({token, user_id: user.id}));

        res.send({token});
    }

    /**
     * Check email or phone number before create register form
     * @param {*} req
     * @param {*} res
     */
    static async beforeRegister(req, res) {
        res.send({'message': 'Email và số điện thoại hợp lệ'})
    }

    /**
     * Register user
     * @return {obj} message
     */
    static async register(req, res) {
        // Init
        const url = "localhost:3002"
        const {email, password, phone} = req.body;
        const {USER_PASSWORD_SALT_ROUNDS: saltRounds = 10} = process.env;
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
        const passwordHash = await bcrypt.hash(password, +saltRounds);

        // Process
        let mail_token = '';
        for (let i = 0; i < 15; i++) {
            let random = (Math.random() * (charset.length - 1 - 0) + 0) | 0;

            mail_token += charset[random];
        }

        const user = await AccountModel.create({
            email: email,
            password: passwordHash,
            status: 'Inactive',
            account_type: 'USER',
            phone: phone,
            role: 0b001,
            mail_token: mail_token,
        });

        const token = JWTService.generateTokenByUser(user);
        const msg = {
            reciver: email,
            subject: 'Confirm registration!',
        }
        const template = {
            data: {
                phone,
                url,
                mail_token,
            },
            type: 'register',
        }
        await MailService.sendMail(msg, template);

        await ActiveTokenModel.create({token, user_id: user.id});

        res.send({'message': 'Đăng kí thành công, vui lòng kiểm tra email để xác nhận'});
    }

    /* Get profile
    * @param {*} req 
    * @param {*} res 
    */
    static async getProfile(req, res) {
        const {id} = req.params;
        let user = await AccountModel.findOne({where: {id, status: 'Active'}});
        let data = {};
        if (user) {
            data = {
                username: user.username,
                province: user.province ? user.province : '',
                district: user.district ? user.district : '',
                ward: user.ward ? user.ward : '',
                address_more: user.address_more ? user.address_more : '',
                birthday: user.birthday ? user.birthday : ''
            }
            res.send({'message': 'Lấy thông tin chỉnh sửa thông tin thành công ', data});
        } else {
            res.status(404).send({'message': 'Tài khoản này không tồn tại hoặc chưa được xác nhận'});
        }
    }

    /**
     * Create profile
     * @param {*} req
     * @param {*} res
     */
    static async createProfile(req, res) {
        const {id} = req.params;
        const {province, district, ward, address_more, birthday} = req.body;
        let user = await AccountModel.findOne({where: {id, status: 'Active'}});
        await user.update({
            province: province ? province : user.province,
            district: district ? district : user.province,
            ward: ward ? ward : user.ward,
            address_more: address_more ? address_more : user.address_more,
            birthday: birthday ? birthday : user.birthday
        })
        res.send({'message': 'Cập nhật thông tin thành công'});
    }

    /**
     * Confirm User Registration after they click link in mail
     * @param: token
     * @return: {void} json
     */
    static async confirmRegister(req, res) {
        // Init
        console.log("confirm register")
        console.log(req.params)
        const {mail_token} = req.params
        const user = await AccountModel.findOne({where: {mail_token: mail_token}});
        if (!user || (user && user.status == 'Active') || !mail_token) {
            return res.status(403).send({'message': 'Tài khoản này đã xác nhận! Đăng nhập để tiếp tục'});
        } else {
            const token = JWTService.generateTokenByUser(user);

            const activeToken = await ActiveTokenModel.findOne({where: {user_id: user.id}});

            (activeToken && (await activeToken.update({token}))) ||
            (await ActiveTokenModel.create({token, user_id: user.id}));

            user.update({
                status: 'Active',
                mail_token: null,
            });

            return res.send({'token': token});
        }
    }

    /**
     * Request forgot password or confirm action
     * @return: {voide} json
     */
    static async forgotPassword(req, res) {
        // Init
        const {email, url, password, token} = req.body;
        const {USER_PASSWORD_SALT_ROUNDS: saltRounds = 10} = process.env;

        if (!token) {
            const user = await AccountModel.findOne({where: {email: email}});
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
            let forgot_token = '';
            for (let i = 0; i < 15; i++) {
                let random = (Math.random() * (charset.length - 1 - 0) + 0) | 0;

                forgot_token += charset[random];
            }
            user.update({
                forgot_token: forgot_token
            });
            const msg = {
                reciver: email,
                subject: 'Reset password!',
            }
            const template = {
                data: {
                    username: user.username,
                    url,
                    forgot_token,
                },
                type: 'forgot password',
            }
            await MailService.sendMail(msg, template);
            res.send({'message': 'Yêu cầu thành công! Vui lòng kiểm tra mail để xác nhận'});
        } else {
            const user = await AccountModel.findOne({where: {forgot_token: token}});
            if (!user) {
                return res.status(404).send({'message': 'Đường dẫn không tìm thấy, hoặc hết hạn'})
            }
            if (!password) {
                return res.send({'message': 'Xác nhận thay đổi mật khẩu'});
            } else {
                const passwordHash = await bcrypt.hash(password, +saltRounds);
                user.update({
                    password: passwordHash,
                    forgot_token: null,
                });
                return res.send({'message': 'Thay đổi mật khẩu thành công!'});
            }
        }
    }
}

module.exports = AuthController;
