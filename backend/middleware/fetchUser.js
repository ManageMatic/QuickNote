const { verifyAccessToken } = require('../utils/token');

const fetchUser = (req, res, next) => {
    /* 1. Get token */
    const token =
        req.cookies.accessToken ||                 // ✅ correct cookie name
        req.header('Authorization')?.split(' ')[1] // optionally "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'No access token' });
    }

    /* 2. Verify */
    try {
        const payload = verifyAccessToken(token);  // throws if invalid / expired
        req.user = { id: payload.id };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = fetchUser;
