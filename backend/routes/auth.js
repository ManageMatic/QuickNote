const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const { issueAccessToken, issueRefreshToken, verifyRefreshToken } = require('../utils/token');

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

module.exports = router;