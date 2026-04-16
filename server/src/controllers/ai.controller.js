const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

exports.analyzeImage = async (req, res) => {
  try {
    console.log("📸 Image analysis request received");
    console.log(
      "File info:",
      req.file ? `${req.file.filename} (${req.file.mimetype})` : "No file",
    );

    const apiKey = process.env.GEMINI_API_KEY;
    const { temperature, humidity, lat, lng } = req.body;

    let contextBlock =
      "Local meteorological context unavailable. Provide general organic logic.";
    if (temperature && humidity) {
      contextBlock = `Given a local temperature of ${temperature}°C and humidity of ${humidity}% at coordinates [${lat}/${lng}], analyze this plant image factoring in the evaporation index.`;
    }

    const promptText = `
        You are a Master Botanist and Agricultural Scientist specializing in Sustainable Futures and Climate-Resilience.
        ${contextBlock}
        
        Analyze this image. It is either a leaf sample or a soil pH strip.
        You MUST identify pests, nutrient deficiencies, or soil imbalances.
        CRITICAL: Your recommendations MUST be 100% organic, sustainable, and zero-chemical. Suggest compost teas, neem oil, organic top dressings, or localized climate adjustments based on the exact temperature provided.

        Return ONLY a JSON string exactly formatted like this:
        {
           "healthScore": 85,
           "diagnosis": "Detailed scientific analysis here.",
           "recommendations": ["Organic remedy 1", "Organic remedy 2"]
        }
        `;

    let imagePart;
    if (req.file) {
      const fileData = fs.readFileSync(req.file.path);
      const imageBase64 = Buffer.from(fileData).toString("base64");
      imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype,
        },
      };
      fs.unlinkSync(req.file.path);
    }

    // UNIVERSAL AUTH DETECTION: Switch between SDK and Bearer Auth
    if (apiKey.startsWith("AQ.")) {
      console.log("◇ Universal Auth: Using API Key Query Parameter (GCP mode)");

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [{ text: promptText }, ...(imagePart ? [imagePart] : [])],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      };

      console.log("📤 Using API key query parameter");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("API key auth response error:", errData);
        throw new Error(
          `API Key Auth Failed [${response.status}]: ${errData.error?.message || JSON.stringify(errData)}`,
        );
      }

      const data = await response.json();
      console.log("📋 API Response:", JSON.stringify(data).substring(0, 500));
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error(`No text in response: ${JSON.stringify(data)}`);
      }
      console.log("✅ Got response from Gemini API Key Auth");
      return res.json(JSON.parse(textResponse));
    } else {
      console.log(
        "◇ Universal Auth: Using Standard SDK Mode (Gemini 2.5 Flash)",
      );
      console.log("📤 Sending request with", imagePart ? "image" : "no image");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const contents = [
        {
          role: "user",
          parts: [{ text: promptText }, ...(imagePart ? [imagePart] : [])],
        },
      ];

      console.log("📨 Calling generateContent...");
      const result = await model.generateContent({
        contents: contents,
        generationConfig: { responseMimeType: "application/json" },
      });

      console.log("✅ Got response from Gemini");
      const textResponse = await result.response.text();
      return res.json(JSON.parse(textResponse));
    }
  } catch (err) {
    console.error("❌ AI ANALYSIS ERROR:", err.message);
    console.error("Full error:", err);

    const isQuotaError =
      err.message.includes("429") ||
      err.message.toLowerCase().includes("quota");

    return res.status(isQuotaError ? 503 : 500).json({
      success: false,
      error: err.message,
      isFallback: false,
      diagnosis: isQuotaError
        ? "Gemini quota is exhausted for this API key. Enable billing or use a key with available quota."
        : "Gemini request failed. Check the server logs for the upstream error.",
      recommendations: [],
    });
  }
};
