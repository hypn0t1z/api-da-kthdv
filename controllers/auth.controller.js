const UserModel = require('../database/models/user.model');
const JWTService = require('../services/jwt.service');
const ActiveTokenModel = require('../database/models/active-token.model');
const MailService = require('../services/mail.service');
const bcrypt = require('bcryptjs');

class AuthController {
    /**
    * Login user
    * @return {obj} token
    */
    static async login(req, res){
        // Init
        const { lang } = req.headers;
        const { email, password } = req.body;
        const user = await UserModel.findOne({ where: { email } });
        const token = JWTService.generateTokenByUser(user);

        // Process
        const activeToken = await user.getActiveToken();

        (activeToken && (await activeToken.update({ token }))) ||
            (await ActiveTokenModel.create({ token, user_id: user.id }));

        res.send({ token });
    }

    /**
    * Register user
    * @return {obj} message
    */
    static async register(req, res){
        // Init
        const { email, password, username, url } = req.body;
        const { lang } = req.headers;
        const { USER_PASSWORD_SALT_ROUNDS: saltRounds = 10 } = process.env;
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
        const passwordHash = await bcrypt.hash(password, +saltRounds);

        // Process
        let mail_token = '';
        for (let i = 0; i < 15; i++) {
            let random = (Math.random() * (charset.length - 1 - 0) + 0) | 0;

            mail_token += charset[random];
        }

        const user = await UserModel.create({
            email,
            password: passwordHash,
            username,
            status: 'Inactive',
            mail_token: mail_token,
        });

        const token = JWTService.generateTokenByUser(user);
        const msg = {
            reciver: email,
            subject: 'Confirm registration!',
        }
        const template = {
            data: {
                username,
                url,
                mail_token,
            },
            type: 'register',
        }
        await MailService.sendMail(msg, template);

        await ActiveTokenModel.create({ token, user_id: user.id });

        res.send({ 'message' : 'Đăng kí thành công, vui lòng kiểm tra email để xác nhận' });
    }

    /**
    * Confirm User Registration after they click link in mail
    * @param: token
    * @return: {void} json
    */
    static async confirmRegister(req, res){
        // Init
        const { lang } = req.headers;
        const { mail_token } = req.body;
        const user = await UserModel.findOne({ where: { mail_token: mail_token } });

        // Process
        if(!user || (user && user.status == 'Active') || !mail_token){
            res.status(403).send({ 'message' : 'Tài khoản này đã xác nhận! Đăng nhập để tiếp tục' });
        }else{
            const token = JWTService.generateTokenByUser(user);

            const activeToken = await user.getActiveToken();

            (activeToken && (await activeToken.update({ token }))) ||
                (await ActiveTokenModel.create({ token, user_id: user.id }));

            user.update({ 
                status: 'Active',
                mail_token: null,
            });

            res.send({ 'message' : 'Xác nhận đăng kí thành công! Đang đăng nhập, vui lòng chờ', 'token' : token });
        }
    }

    /**
    * Request forgot password or confirm action
    * @return: {voide} json
    */
    static async forgotPassword(req, res){
        // Init
        const { lang } = req.headers;
        const { email, url, password, token } = req.body;
        const { USER_PASSWORD_SALT_ROUNDS: saltRounds = 10 } = process.env;

        if(!token){
            const user = await UserModel.findOne({ where: { email: email } });
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
            res.send({ 'message' : 'Yêu cầu thành công! Vui lòng kiểm tra mail để xác nhận' });
        }else{
            const user = await UserModel.findOne({ where: { forgot_token: token } });
            if(!user){
                return res.status(404).send({ 'message': 'Đường dẫn không tìm thấy, hoặc hết hạn' })
            }
            if(!password){
                return res.send({ 'message' : 'Xác nhận thay đổi mật khẩu' });
            }else{
                const passwordHash = await bcrypt.hash(password, +saltRounds);
                user.update({
                    password: passwordHash,
                    forgot_token: null,
                });
                return res.send({ 'message' : 'Thay đổi mật khẩu thành công!' });
            }
        }
    }
}

module.exports = AuthController;
