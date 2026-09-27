require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

connectDB();

const app = express();

app.use(compression());
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const allowed =
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.netlify\.app$/.test(origin) ||
      /localhost:\d+$/.test(origin) ||
      /127\.0\.0\.1:\d+$/.test(origin) ||
      /192\.168\.\d+\.\d+:\d+$/.test(origin) ||
      /10\.\d+\.\d+\.\d+:\d+$/.test(origin);
    if (allowed) return cb(null, true);
    return cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' });
app.use('/api', limiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Tantvani API running on port ${PORT}`));

