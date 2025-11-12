const Farm = require("../module/farmModule");
const axios = require("axios");

exports.getAiSuggestions = async (req, res) => {
  try {
    // 1. Get User and ALL potential data from the request body
    const userId = req.user.id;
    // The `completedTasks` will be present for the Farm Page, and undefined for the Weather Page
    const { currentWeather, forecast, completedTasks } = req.body;

    if (!currentWeather || !forecast) {
      return res
        .status(400)
        .json({ success: false, message: "Weather data is required" });
    }

    // 2. Fetch User's Farm Data (this is always needed)
    const farm = await Farm.findOne({ user: userId });
    if (!farm) {
      return res
        .status(404)
        .json({ success: false, message: "No farm data found." });
    }

    // 3. Dynamically Construct the Prompt
    let taskSection = ""; // Start with an empty string for the task section
    if (completedTasks && completedTasks.length > 0) {
      // If task data exists, build that part of the prompt
      const taskList = completedTasks
        .map(
          (task) =>
            `- ${task.name} (Completed on: ${new Date(
              task.completedAt
            ).toDateString()})`
        )
        .join("\n");
      taskSection = `
        **Recent Completed Tasks:**
        ${taskList}
      `;
    }

    const prompt = `
      As an expert agricultural advisor for Bangladesh, your task is to provide three actionable, concise farming suggestions. The suggestions must be highly relevant to the user's specific situation, considering their farm, recent activities, and the weather.

      **User's Farm Details:**
      - Crop Type: ${farm.cropType}
      - Soil Type: ${farm.soilType}
      - Planting Date: ${farm.plantingDate.toDateString()}

      ${taskSection} // <-- This section will only be included if tasks were provided

      **Current Weather & Forecast:**
      - Today's Condition: ${currentWeather.temperature.degrees}°C, ${
      currentWeather.weatherCondition.description.text
    }
      - Forecast: The next few days will be [Summarize the forecast briefly here].

      **Your Task:**
      Based on ALL of the above information (especially the completed tasks if listed), provide three distinct suggestions formatted as a JSON array of objects. Each object must have a "type" ("Recommended", "Avoid", or "ProTip"), a "title", and a "suggestion". The suggestions must be in Bengali. Do not suggest a task that was recently completed.

      Example JSON format:
      [
        {"type": "Recommended", "title": "পরবর্তী সেচ", "suggestion": "যেহেতু গত সপ্তাহে সার প্রয়োগ করা হয়েছে, মাটির আর্দ্রতা পরীক্ষা করে পরবর্তী সেচের জন্য প্রস্তুতি নিন।"},
        {"type": "Avoid", "title": "কীটনাশক প্রয়োগ", "suggestion": "দমকা হাওয়ার পূর্বাভাসের কারণে আজ কীটনাশক স্প্রে করা থেকে বিরত থাকুন।"},
        {"type": "ProTip", "title": "রোগ পর্যবেক্ষণ", "suggestion": "মেঘলা আবহাওয়ায় ছত্রাকজনিত রোগের ঝুঁকি বাড়ে, তাই ফসল নিবিড়ভাবে পর্যবেক্ষণ করুন।"}
      ]
    `;

    // 4. Call OpenRouter API (no changes here)
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const suggestionsJson = response.data.choices[0].message.content;

    // 5. Parse and Send the Response
    // We wrap this in a try-catch because the LLM might not return perfect JSON
    try {
      const suggestions = JSON.parse(suggestionsJson);
      res.status(200).json({ success: true, data: suggestions });
    } catch (parseError) {
      // If JSON parsing fails, send the raw text as a fallback
      res.status(200).json({
        success: true,
        data: [
          {
            type: "ProTip",
            title: "বিশেষ পরামর্শ",
            suggestion: suggestionsJson,
          },
        ],
      });
    }
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate AI suggestions" });
  }
};
