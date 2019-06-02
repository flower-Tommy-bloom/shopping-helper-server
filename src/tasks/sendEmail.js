let nodemailer = require('nodemailer');

const sendEmail = (userEmail,title,content) => {
    let transporter = nodemailer.createTransport({
        //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
        service: 'qq',
        port: 465, // SMTP 端口
        secureConnection: true, // 使用 SSL
        auth: {
            user: '724199718@qq.com',
            //这里密码不是qq密码，是你设置的smtp密码 qpkggpbxzqvzbdbe
            pass: 'qpkggpbxzqvzbdbe'
        }
    });
    
    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails
    
    // setup e-mail data with unicode symbols
    let mailOptions = {
        from: '724199718@qq.com', // 发件地址
        to: userEmail, // 收件列表
        subject: title, // 标题
        //text和html两者只支持一种
        // text: content, // 标题
        html: content // html 内容
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
// exports = sendEmail
sendEmail('415157361@qq.com','xxxxxxxxxx','正文,我可以')