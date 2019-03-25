const nodemailer =  require('nodemailer');

/**
* Mail smtp setting
*/
class MailService {

    /**
    * Send Mail function
    * @return send mail
    */
    static async sendMail(msg, template){
        const config = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        };
        try{
            const transporter = nodemailer.createTransport(config);

            const mailOptions = {
                from: config.auth.user,
                to: msg.reciver,
                subject: msg.subject,
                text: 'You recieved message from ' + config.auth.user,
                html: await this.mailTemplate(template),
            }
            transporter.sendMail(mailOptions);
        }catch(err){
            
        }
    }

    /**
    * Get MailTemplate by type
    * @params {object} template
    * @return {string} mail_template
    */
    static async mailTemplate(template){
        let mail_template = '';
        if(template.type == 'register'){
            mail_template = `
                <h1>Hello `+ template.data.username +`! </h1>
                <p>You have been registered success from our website.</p>
                <p>Please click <a style="color: red;" href="`+ template.data.url +`/confirm-register/`+ template.data.mail_token +`">HERE</a> to confirm your registration!</p>
            `
        }
        if(template.type == 'forgot password'){
            mail_template = `
                <h1>Hello `+ template.data.username +`! </h1>
                <p>You have requested new password from our website.</p>
                <p>Please click <a style="color: red;" href="`+ template.data.url +`/forgot-pass/`+ template.data.forgot_token +`">HERE</a> to confirm!</p>
            `
        }
        return mail_template;
    }
}

module.exports = MailService;
