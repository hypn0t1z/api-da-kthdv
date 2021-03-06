const AccountModel = require('../database/models/01-account.model');
const JWTService = require('../services/jwt.service');
const ActiveTokenModel = require('../database/models/active-token.model');
const MailService = require('../services/mail.service');
const ProfileModel = require('../database/models/12-profile.model');
const CommonService = require('../services/common.service');
const bcrypt = require('bcryptjs');
const Controller = require('./controller')
const CustomerModel = require('../database/models/04-customer.model')


class AuthController extends Controller{
    /**
     * Login user
     * @return {obj} token
     */
    static async login(req, res) {
        // Init
        const { value, password } = req.body;
        let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let type = value.match(emailRegex) ? 'email' : 'phone';
        const account = await AccountModel.findOne( {where: { [type]: value } });
        let isAdmin = false;
        if(account.role == 0b100){
            isAdmin = true;
        }
        const token = JWTService.generateTokenByUser(account);
        // Process
        const activeToken = await ActiveTokenModel.findOne({where: {account_id: account.id}});

        (activeToken && (await activeToken.update({token}))) ||
        (await ActiveTokenModel.create({ token, account_id: account.id }));

        const res_return = {
            token: token,
            isAdmin,
            id: account.id
        }

        return this.sendResponseMessage(res, 200, "Đăng nhập thành công !", res_return)
    }

    /**
     * Check email or phone number before create register form
     * @param {*} req
     * @param {*} res
     */
    static async beforeRegister(req, res) {
        return this.sendResponseMessage(res, 200, 'Email và số điện thoại hợp lệ')
    }

    /**
     * Register user
     * @return {obj} message
     */
    static async register(req, res) {
        // Init
        const url = "13.67.50.208:" + process.env.PORT
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
        CustomerModel.create({
            account_id: user.id
        })


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

        await ActiveTokenModel.create({ token, account_id: user.id });

        return this.sendResponseMessage(res, 200,  'Đăng kí thành công, vui lòng kiểm tra email để xác nhận')
    }

    /**
    * Get profile
    * if (status == NULL ) ---> Profile not created yet
    * @param {*} req 
    * @param {*} res 
    * @author Hung Dang
    */
    static async getProfile(req, res) {
        const {id} = req.params;  // account_id
        let profile = await ProfileModel.findOne({where: { account_id: id }});
        let data = {};
        if (profile) {
            data = {
                avatar: profile.avatar ? profile.avatar : '',
                username: profile.username,
                province: profile.province ? profile.province : '',
                district: profile.district ? profile.district : '',
                ward: profile.ward ? profile.ward : '',
                address_more: profile.address_more ? profile.address_more : '',
                birthday: profile.birthday ? profile.birthday : '',
                status: profile.status ? profile.status : ''
            }
            return this.sendResponseMessage(res, 200, 'Lấy thông tin chỉnh sửa thông tin thành công', data)
        } else {
            return this.sendResponseMessage(res, 404, 'Tài khoản này không tồn tại hoặc chưa được xác nhận')
        }
    }

    /**
     * Confirm User Registration after they click link in mail
     * @param: token
     * @return: {void} json
     */
    static async confirmRegister(req, res) {
        // Init
        const {mail_token} = req.params
        const user = await AccountModel.findOne({where: {mail_token: mail_token}});
        if (!user || (user && user.status == 'Active') || !mail_token) {
            return this.sendResponseMessage(res, 403, 'Tài khoản này đã xác nhận! Đăng nhập để tiếp tục')
        } else {
            const token = JWTService.generateTokenByUser(user);

            const activeToken = await ActiveTokenModel.findOne({where: {account_id: user.id}});

            (activeToken && (await activeToken.update({token}))) ||
            (await ActiveTokenModel.create({token, account_id: user.id}));

            user.update({
                status: 'Active',
                mail_token: null,
            });
            res.send('Đăng kí thành công, trở lại trang đăng nhập để đăng nhập');
            //return this.sendResponseMessage(res, 200, "Đăng kí thành công, trở lại trang đăng nhập để đăng nhập")
        }
    }

    /**
     * Request forgot password or confirm action
     * @return: {voide} json
     */
    static async forgotPassword(req, res) {
        // Init
        const url = "fixcar.netlify.com";
        const {email, password, token} = req.body;
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
                    username: user.email,
                    url,
                    forgot_token,
                },
                type: 'forgot password',
            }
            await MailService.sendMail(msg, template);
            return this.sendResponseMessage(res, 200, 'Yêu cầu thành công! Vui lòng kiểm tra mail để xác nhận')
        } else {
            const user = await AccountModel.findOne({where: {forgot_token: token}});
            if (!user) {
                return this.sendResponseMessage(res, 404, 'Đường dẫn không tìm thấy, hoặc hết hạn')
            }
            if (!password) {
                return this.sendResponseMessage(res, 400, "Mật khẩu không đươc để trống")
            } else {
                const passwordHash = await bcrypt.hash(password, +saltRounds);
                user.update({
                    password: passwordHash,
                    forgot_token: null,
                });
                return this.sendResponseMessage(res, 200, 'Thay đổi mật khẩu thành công!')
            }
        }
    }

    static async uploadAvatar(req, res) {
        return this.sendResponseMessage(res, 200, 'file uploaded')
    }

    static async isTokenStillAlive(req, res) {
        const {token} = req.params;

        const activeToken = await ActiveTokenModel.findOne({where: {token: token}})

        const data = {id: activeToken.account_id}

        return this.sendResponseMessage(res, 200, 'Token is still alive, be fun, and here is user id', data)
    }
}

module.exports = AuthController;
