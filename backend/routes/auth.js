const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Create user using: POST "api/auth/createuser"
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user with this email already exists
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "User already exists with this email." });
        }

        // Create the user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        res.json(user);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }
});

module.exports = router;