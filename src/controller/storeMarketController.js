const axios = require("axios");
const marketDataModule = require("../module/marketDataModule");

const fetchAndStoreMarketData = async (req, res) => {
  try {
    // Fetch data from both APIs
    const [nameData, priceData] = await Promise.all([
      axios.get(process.env.NAME_API),
      axios.get(process.env.PRICE_API),
    ]);

    const marketPrice = priceData.data.data;
    const nameDataArr = nameData.data.data.commodityNameList;

    // Get today's date in YYYY-MM-DD format for uniqueness
    const today = new Date().toISOString().split("T")[0];

    // Check if data already exists for today
    const existingData = await marketDataModule.findOne({
      "todayMarketData.price_date": today,
    });

    if (existingData) {
      console.log("data exists");
      // Data for today already exists, no need to store again
      const responseData = {
        success: true,
        message: "Market data for today already exists, no update needed",
        data: {
          documentId: existingData._id,
          todayItemsCount: existingData.totalTodayItems,
          preItemsCount: existingData.totalPreItems,
          fetchedAt: existingData.fetchedAt,
          dataDate: today,
          isUpdated: false,
        },
      };

      if (res) {
        return res.status(200).json(responseData);
      }
      return responseData;
    }

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

    // Delete all existing data (since it's old data)
    await marketDataModule.deleteMany({});

    // Create new market data entry
    const marketDataEntry = new marketDataModule({
      fetchedAt: new Date(),
      dataSource: "External API",
      totalTodayItems: todayMarketData.length,
      totalPreItems: preMarketData.length,
      data: {
        todayMarketData: todayMarketData,
        preMarketData: preMarketData,
      },
    });

    const responseData = {
      success: true,
      message: "Market data fetched and stored successfully",
      data: {
        documentId: marketDataEntry._id,
        dataDate: marketDataEntry.dataDate,
        todayItemsCount: marketDataEntry.totalTodayItems,
        preItemsCount: marketDataEntry.totalPreItems,
        fetchedAt: marketDataEntry.fetchedAt,
        isNewRecord:
          !marketDataEntry.createdAt ||
          marketDataEntry.createdAt === marketDataEntry.updatedAt,
      },
    };

    if (res) {
      return res.status(200).json(responseData);
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching and storing market data:", error);
    const errorResponse = {
      success: false,
      message: "Failed to fetch and store market data",
      error: error.message,
    };

    if (res) {
      return res.status(500).json(errorResponse);
    }

    throw errorResponse;
  }
};

const getMarketData = async (req, res) => {
  try {
    // Get query parameters for filtering
    const {
      date,
      limit = 0,
      page = 0,
      sortBy = "fetchedAt",
      sortOrder = "desc",
    } = req.query;

    let query = {};

    // Filter by specific date if provided
    if (date) {
      query.dataDate = date;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get total count for pagination
    const totalRecords = await marketDataModule.countDocuments(query);

    // Fetch market data with pagination and sorting
    const marketData = await marketDataModule
      .find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean(); // Use lean() for better performance

    // Get the latest data if no specific date requested
    const latestData = !date
      ? await marketDataModule.findOne().sort({ fetchedAt: -1 }).lean()
      : null;

    res.status(200).json({
      success: true,
      data: marketData,
      message: `Found ${marketData.length} market data records`,
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch market data",
      error: error.message,
    });
  }
};

module.exports = {
  fetchAndStoreMarketData,
  getMarketData,
};
