const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const verifyToken = require('./utils/auth');
const userRouter = require('./routes/user');
const scheduleRouter = require('./routes/schedule');

const app = express();
connectDB();

// 🔐 CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// ✅ Handle CORS
app.use(cors(corsOptions));

// ✅ Handle preflight requests manually (important!)
app.options('*', cors(corsOptions));

// JSON parser
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json("Welcome to Schedulify...");
});

// Auth Routes
app.use('/api/auth', userRouter);

// Schedule Routes (protected)
app.use('/api/schedule', verifyToken, scheduleRouter);

// Server Listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
