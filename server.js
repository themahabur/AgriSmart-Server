// server.js
const mongoose = require('mongoose');
const express = require('express');
const connectDB = require('./src/config/db');
const app = express();
const PORT = 5000;
connectDB();
const userRoutes = require('./src/router/userRouter');

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
