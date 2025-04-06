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

// ✅ Manual CORS Middleware for All Requests
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
  
    next();
  });
  

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
