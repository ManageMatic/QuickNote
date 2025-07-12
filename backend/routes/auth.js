const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const { issueAccessToken, issueRefreshToken, verifyRefreshToken } = require('../utils/token');
const sendEmailVerification = require('../utils/sendEmail');
const SignupVerification = require('../models/SignupVerification');

const JWT_SECRET = process.env.JWT_SECRET;

// Route 1: Create user using: POST "api/auth/createuser"
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // Check if the user with this email already exists
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "User already exists with this email." });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        // Create the user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '2h' });
        success = true;
        res.json({ success, authToken })

        // res.json(user);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
});

// Route 2: Authenticate a user using: POST "api/auth/login"
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Paasword cannot be blank').exists(),
], async (req, res) => {

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get the user with email
    const user = { email, password } = req.body;

    // Check if the user exists
    try {
        let user = await User.findOne({ email });
        if (!user) {
            let success = false;
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        // Check if password matches
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            let success = false;
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        // Issue JWT tokens
        const accessToken = issueAccessToken(user);
        const refreshToken = issueRefreshToken(user);

        // Set the refresh token as a cookie
        const cookieOpts = {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/'
        };

        res.cookie('accessToken', accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 })
            .cookie('refreshToken', refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({
                success: true,
                message: "Logged in successfully",
                accessToken: accessToken,
                refreshToken: refreshToken
            });

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
});

// Route 3: Get loggedin user details using: POST "api/auth/getuser". Login required
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
});

// Route 4: Refresh access token using: POST "api/auth/refresh-token"
router.post('/refresh-token', async (req, res) => {
    const ref = req.cookies.refreshToken;
    if (!ref) {
        return res.status(401).json({ error: "No refresh token provided" });
    }
    try {
        const data = verifyRefreshToken(ref);

        const user = await User.findById(data.id).select("_id");
        if (!user) {
            return res.status(403).json({ error: "User not found" });
        }
        const newAccessToken = issueAccessToken(user);
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 15 * 60 * 1000 // 15 minutes
        }).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
        console.error(error.message);
        res.status(403).json({ error: "Invalid refresh token" });
    }
});

// Route 5: Logout user using: POST "api/auth/logout"
router.post('/logout', (_req, res) => {
    res
        .clearCookie('accessToken', { path: '/', sameSite: 'lax' })
        .clearCookie('refreshToken', { path: '/', sameSite: 'lax' })
        .json({ success: true });
});

// Route 6: send signup code for verify email using: POST "api/auth/send-signup-code"
router.post('/send-signup-code', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        await SignupVerification.findOneAndUpdate(
            { email },
            { code, expiresAt },
            { upsert: true, new: true }
        );

        await sendEmailVerification(email, code);

        res.json({ success: true, message: 'Verification code sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route 7: verify signup code using: POST "api/auth/verify-signup-code"
router.post('/verify-signup-code', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) return res.status(400).json({ error: 'Email and code required' });

    try {
        const record = await SignupVerification.findOne({ email });

        if (!record) {
            return res.status(400).json({ error: 'No verification code found for this email' });
        }

        if (record.code === code && Date.now() < record.expiresAt) {
            await SignupVerification.deleteOne({ email }); // clear used code
            return res.json({ success: true });
        } else {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route 8: Request for reset code using: POST "/api/auth/send-reset-code"
router.post('/send-reset-code', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetCode = code;
        user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();
        await sendEmailVerification(email, code);

        return res.json({ success: true, message: 'Verification code sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Route 9: Verify reset password code using: POST "/api/auth/verify-reset-code"
router.post('/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpires) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        return res.json({ success: true, message: 'Code verified' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Route 10: Reset password using: POST "/api/auth/reset-password"
router.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpires) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;

        await user.save();

        return res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;