const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/db');
const verifyToken = require('./utils/auth');
const userRouter = require('./routes/user');
const scheduleRouter = require('./routes/schedule');
connectDB();



app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  // Explicitly handle preflight requests
app.options('*', cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json("Welcome to Schedulify...");
})

app.use('/api/auth', userRouter );


app.use('/api/schedule', verifyToken, scheduleRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})