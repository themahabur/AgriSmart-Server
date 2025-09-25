const axios = require("axios");
const marketDataModule = require("../module/marketDataModule");

const fetchAndStoreMarketData = async () => {
  try {
    // Fetch data from both APIs
    const [nameData, priceData] = await Promise.all([
      axios.get(process.env.NAME_API),
      axios.get(process.env.PRICE_API),
    ]);

    const marketPrice = priceData.data.data;
    const nameDataArr = nameData.data.data.commodityNameList;

    // Process today's market data
    const todayMarketData = marketPrice.map((item1) => {
      const match = nameDataArr.find(
        (item2) => item2.value === item1.commodity_id
      );
      return {
        ...item1,
        name: match ? match.text : "Unknown",
        nameEn: match ? match.text_en : "Unknown",
        nameBn: match ? match.text_bn : "Unknown",
      };
    });

    // Process previous market data
    const preMarketData = priceData.data.prevPrice.map((item1) => {
      const match = nameDataArr.find(
        (item2) => item2.value === item1.commodity_id
      );
      return {
        ...item1,
        name: match ? match.text : "Unknown",
        nameEn: match ? match.text_en : "Unknown",
        nameBn: match ? match.text_bn : "Unknown",
      };
    });

    //  Delete old data and insert new data
    await marketDataModule.deleteMany({});

    // Create new market data entry
    const marketDataEntry = new marketDataModule({
      todayMarketData: todayMarketData,
      preMarketData: preMarketData,
      fetchedAt: new Date(),
      dataSource: "External API",
    });

    // Save to MongoDB
    const savedData = await marketDataEntry.save();

    return {
      success: true,
      message: "Market data fetched and stored successfully",
      //   data: {
      //     documentId: savedData._id,
      //     todayItemsCount: savedData.totalTodayItems,
      //     preItemsCount: savedData.totalPreItems,
      //     fetchedAt: savedData.fetchedAt,
      //     todayMarketData: savedData.todayMarketData,
      //     preMarketData: savedData.preMarketData,
      //   },
    };
  } catch (error) {
    console.error("Error fetching and storing market data:", error);
    throw {
      success: false,
      message: "Failed to fetch and store market data",
      error: error.message,
    };
  }
};

const getMarketData = async (req, res) => {
  try {
    const marketData = await marketDataModule.find();

    res.send({ success: true, data: marketData });
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw {
      success: false,
      message: "Failed to fetch market data",
      error: error.message,
    };
  }
};

module.exports = {
  fetchAndStoreMarketData,
  getMarketData,
};
