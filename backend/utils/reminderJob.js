const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Note = require('../models/Notes');
const User = require('../models/User');

// Configure email transporter
// NOTE: For production, you should use environment variables for SMTP settings.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const startReminderJob = () => {
    console.log('⏰ Reminder job started (running every minute)...');

    // Run every minute
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000); // Buffer for missed jobs

        try {
            // Find notes with reminders due but not sent yet
            const notesToRemind = await Note.find({
                reminder: { $lte: now, $gte: fifteenMinutesAgo },
                reminderSent: false,
                trashed: false
            }).populate('user');

            for (const note of notesToRemind) {
                if (note.user && note.user.email) {
                    console.log(`📧 Sending reminder to ${note.user.email} for note: ${note.title}`);

                    const mailOptions = {
                        from: '"QuickNote Pro" <ishanmahida123@gmail.com>',
                        to: note.user.email,
                        subject: `Reminder: ${note.title} 🚀`,
                        text: `Hi ${note.user.name},\n\nThis is a reminder for your note: "${note.title}"\n\nDescription: ${note.description}\n\nView your note at: http://localhost:3000/dashboard\n\nBest,\nQuickNote Team`,
                        html: `
                            <div style="font-family: 'Inter', sans-serif; padding: 30px; background: #0f172a; color: #f1f5f9; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(124,58,237,0.2);">
                                <h2 style="color: #a78bfa; margin-bottom: 20px;">QuickNote Pro Reminder</h2>
                                <p style="font-size: 16px; color: #94a3b8;">Hi <b>${note.user.name}</b>,</p>
                                <p style="font-size: 16px;">This is a reminder for your note:</p>
                                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed; margin: 20px 0; color: #f1f5f9;">
                                    <h3 style="margin-top: 0; color: #fff;">${note.title}</h3>
                                    <div style="font-size: 14px; color: #cbd5e1;">${note.description}</div>
                                </div>
                                <p style="margin-top: 30px;">
                                    <a href="http://localhost:3000/dashboard" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: 600; display: inline-block;">Open Dashboard</a>
                                </p>
                                <p style="margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                                    QuickNote Pro — Next-Gen Productivity. <br/>
                                    You received this because you set a reminder for your note.
                                </p>
                            </div>
                        `
                    };

                    await transporter.sendMail(mailOptions);

                    // Mark as sent
                    await Note.findByIdAndUpdate(note._id, { reminderSent: true });

                    console.log(`✅ Email sent successfully for "${note.title}"`);
                }
            }
        } catch (error) {
            console.error('❌ Error in reminder job:', error);
        }
    });
};

module.exports = startReminderJob;
