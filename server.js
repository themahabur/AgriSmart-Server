const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./src/router/userRouter");
const storeMarketRouter = require("./src/router/marketRouter");
const KnowledgeHubRouter = require("./src/router/knowledgeHubRouter");
const farmRouter = require("./src/router/farmRouter");
const aiHistoryRouter = require("./src/router/aiHistoryRouter");
const commentRoute = require("./src/router/commentRoute");
const farmTaskRouter = require("./src/router/farmTaskRouter");
const dashboardRouter = require("./src/router/dashboardRouter");
const recentActivityRouter = require("./src/router/recentActivityRouter");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/", storeMarketRouter);
app.use("/api/", KnowledgeHubRouter);
app.use("/api/", farmRouter);
app.use("/api/ai-history", aiHistoryRouter);
app.use('/api', commentRoute);
app.use("/api", farmTaskRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/recent-activity", recentActivityRouter);

// MongoDB connection
connectDB();

app.get("/", async (req, res) => {
  res.send("Agrismart server is running");
});

// Export the Express app for Vercel
module.exports = app;

// Start server (only for local development)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
