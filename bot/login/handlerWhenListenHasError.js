const nodemailer = require('nodemailer');

module.exports = async function ({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, error }) {
    const { config, botID } = global.GoatBot;
    const { log } = global.utils;
    const configNotiWhenListenMqttError = config.notiWhenListenMqttError || {};

    if (configNotiWhenListenMqttError.smtp?.enable == true) {
        const smtpConfig = configNotiWhenListenMqttError.smtp;
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'sajiaparvin32@gmail.com',
                pass: 'rybv fnir fsyq wimw', // Use the application-specific password generated for your Gmail account
            },
        });

        let highlightCode = error;
        if (typeof error == "object" && !error.stack)
            highlightCode = JSON.stringify(error, null, 2);
        else if (error.stack)
            highlightCode = error.stack;

        const mailOptions = {
            from: smtpConfig.from,
            to: smtpConfig.to,
            subject: "Report error when listen message in Goat Bot",
            html: `<h2>Has error when listen message in Goat Bot id: ${botID}</h2><pre>${highlightCode}</pre>`,
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                log.err("handlerWhenListenHasError", "Can not send mail to admin", err);
            } else {
                // Success
                console.log("Email sent: " + info.response);
            }
        });
    }
};
