const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./src/router/userRouter");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRouter);

// MongoDB connection
connectDB();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
