require('dotenv').config({ path: __dirname + '/.env' });
const nodemailer = require('nodemailer');

const sendEmailVerification = async (toEmail, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"QuickNote" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your QuickNote Verification Code',
        html: `<p>Your verification code is <b>${code}</b>. It will expire in 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmailVerification;
