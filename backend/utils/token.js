const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

exports.issueAccessToken = (user) =>
    jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: '15m' });

exports.issueRefreshToken = (user) =>
    jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

exports.verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
exports.verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
