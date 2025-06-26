require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- 1. Connect DB ---------- */
connectToMongo();

/* ---------- 2. CORS  (allow cookies) ---------- */
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', // React URL
    credentials: true,                                            // ← send cookies
  })
);

/* ---------- 3. Global Middleware ---------- */
app.use(express.json());
app.use(cookieParser());

/* ---------- 4. Rate-limit only the login route ---------- */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15-min window
  max: 5,                    // 5 tries / IP
  standardHeaders: true,
});
app.use('/api/auth/login', loginLimiter);

/* ---------- 5. Routes ---------- */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

/* ---------- 6. Server start ---------- */
app.listen(PORT, () =>
  console.log(`Server running ➜  http://localhost:${PORT}`)
);
