const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const verifyToken = require("./utils/auth");
const userRouter = require("./routes/user");
const scheduleRouter = require("./routes/schedule");

const app = express();
connectDB();

const allowedOrigin = process.env.CLIENT_URL;

const corsOptions = {
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// JSON parser
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json("Welcome to Schedulify...");
});

// Auth Routes
app.use("/api/auth", userRouter);

// Schedule Routes (protected)
app.use("/api/schedule", verifyToken, scheduleRouter);

// Server Listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
