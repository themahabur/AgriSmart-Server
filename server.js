const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./src/router/userRouter");
const storeMarketRouter = require("./src/router/marketRouter");
const connectDB = require("./src/config/db");

const axios = require("axios");
const {
  fetchAndStoreMarketData,
} = require("./src/controller/storeMarketController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/", storeMarketRouter);
app.use("/api/update/marketData", fetchAndStoreMarketData);

// MongoDB connection
connectDB();

app.get("/", async (req, res) => {
  // try {
  //   const [nameData, priceData] = await Promise.all([
  //     axios.get(process.env.NAME_API),
  //     axios.get(process.env.PRICE_API),
  //   ]);
  //   const marketPrice = priceData.data.data;
  //   const nameDataArr = nameData.data.data.commodityNameList;

  //   const todayMarketData = marketPrice.map((item1) => {
  //     const match = nameDataArr.find(
  //       (item2) => item2.value === item1.commodity_id
  //     );
  //     return {
  //       ...item1,
  //       name: match ? match.text : "Unknown",
  //       nameEn: match ? match.text_en : "Unknown",
  //       nameBn: match ? match.text_bn : "Unknown",
  //     };
  //   });

  //   const preMarketData = priceData.data.prevPrice.map((item1) => {
  //     const match = nameDataArr.find(
  //       (item2) => item2.value === item1.commodity_id
  //     );
  //     return {
  //       ...item1,
  //       name: match ? match.text : "Unknown",
  //       nameEn: match ? match.text_en : "Unknown",
  //       nameBn: match ? match.text_bn : "Unknown",
  //     };
  //   });

  //   res.status(200).json({
  //     status: true,
  //     message: "Success",
  //     data: { todayMarketData: todayMarketData, preMarketData: preMarketData },
  //   });
  // } catch (error) {
  //   console.log("error", error);
  // }
  res.send("Agrismart server is running");
});

// Export the Express app for Vercel
module.exports = app;

// Start server (only for local development)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
