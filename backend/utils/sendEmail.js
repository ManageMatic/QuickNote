const nodemailer = require('nodemailer');

// ── Shared Email Template Generator ──────────────────
const generateEmailTemplate = (title, message, code, subtitle) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d0d24; margin: 0; padding: 0; color: #f1f5f9; }
        .container { max-width: 600px; margin: 20px auto; background: linear-gradient(145deg, #16163a, #0d0d24); border-radius: 16px; overflow: hidden; border: 1px solid rgba(124, 58, 237, 0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: #7c3aed; padding: 30px; text-align: center; }
        .header h1 { margin: 0; color: white; font-size: 28px; letter-spacing: 1px; }
        .content { padding: 40px; text-align: center; }
        .content h2 { color: #f1f5f9; margin-bottom: 20px; font-size: 22px; }
        .content p { color: #94a3b8; line-height: 1.6; margin-bottom: 30px; }
        .otp-box { background: rgba(124, 58, 237, 0.1); border: 2px dashed #7c3aed; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #a78bfa; margin: 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; background: rgba(0,0,0,0.2); }
        .expiry { color: #f43f5e; font-weight: 600; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>QuickNote</h1>
        </div>
        <div class="content">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="otp-box">
                <p style="margin: 0 0 10px 0; color: #94a3b8; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Your Secure Code</p>
                <h3 class="otp-code">${code}</h3>
            </div>
            <p class="expiry">${subtitle}</p>
            <p style="font-size: 13px; margin-top: 30px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} QuickNote Pro. Empowering your productivity.
        </div>
    </div>
</body>
</html>
`;

const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmailVerification = async (toEmail, code) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: `"QuickNote" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Verify Your QuickNote Account',
        html: generateEmailTemplate(
            'Confirm Your Email',
            'Welcome to QuickNote! To start capturing your ideas with style, please verify your email address using the code below.',
            code,
            'This code will expire in 10 minutes.'
        )
    };
    await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (toEmail, code) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: `"QuickNote Security" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset Your QuickNote Password',
        html: generateEmailTemplate(
            'Password Reset Request',
            'We received a request to reset your QuickNote password. Use the code below to complete the process.',
            code,
            'For security, this code is only valid for 10 minutes.'
        )
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmailVerification, sendPasswordResetEmail };
